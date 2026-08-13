#!/usr/bin/env bash
set -euo pipefail

# Determine script and project directory paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Configuration with environment defaults
PROJECT_ID="${GCP_PROJECT_ID:-bryanko-hifi-shop-demo}"
REGION="${GCP_REGION:-asia-east2}"
SPANNER_INSTANCE="${SPANNER_INSTANCE:-hifi-shop-spanner}"
SPANNER_DATABASE="${SPANNER_DATABASE:-hifi-shop-db}"
GCS_BUCKET_NAME="${GCS_BUCKET_NAME:-bryanko-hifi-shop-demo-assets}"

echo "========================================================================="
echo " Hi-Fi Shop Demo - GCP Automated Deployment"
echo " Project ID:       ${PROJECT_ID}"
echo " Region:           ${REGION}"
echo " Spanner Instance: ${SPANNER_INSTANCE}"
echo " Spanner Database: ${SPANNER_DATABASE}"
echo " GCS Bucket Name:  ${GCS_BUCKET_NAME}"
echo "========================================================================="

# 1. Enable required GCP service APIs
echo "[INFO] Step 1: Enabling required GCP service APIs..."
gcloud services enable   compute.googleapis.com   vpcaccess.googleapis.com   spanner.googleapis.com   run.googleapis.com   aiplatform.googleapis.com   artifactregistry.googleapis.com   cloudbuild.googleapis.com   storage.googleapis.com   --project="${PROJECT_ID}"

# 2. Run Terraform init and apply
echo "[INFO] Step 2: Running Terraform init and apply..."
cd "${PROJECT_ROOT}/terraform"
terraform init
terraform apply -auto-approve   -var="project_id=${PROJECT_ID}"   -var="region=${REGION}"   -var="bucket_name=${GCS_BUCKET_NAME}"
cd "${PROJECT_ROOT}"

# 3. Setup GCS Bucket & CORS configuration
echo "[INFO] Step 3: Setting up GCS bucket and CORS headers..."
GCP_PROJECT_ID="${PROJECT_ID}" GCP_REGION="${REGION}" GCS_BUCKET_NAME="${GCS_BUCKET_NAME}"   bash "${PROJECT_ROOT}/scripts/setup_gcs_bucket.sh"

# 4. Execute Spanner DDL scripts
echo "[INFO] Step 4: Executing Spanner DDL scripts..."
echo "[INFO] Applying schema DDL (01_create_tables.sql)..."
gcloud spanner databases ddl update "${SPANNER_DATABASE}"   --instance="${SPANNER_INSTANCE}"   --project="${PROJECT_ID}"   --ddl-file="${PROJECT_ROOT}/sql/01_create_tables.sql" || echo "[INFO] Table schema DDL already applied or skipped."

echo "[INFO] Applying index DDL (02_create_indexes.sql)..."
gcloud spanner databases ddl update "${SPANNER_DATABASE}"   --instance="${SPANNER_INSTANCE}"   --project="${PROJECT_ID}"   --ddl-file="${PROJECT_ROOT}/sql/02_create_indexes.sql" || echo "[INFO] Index DDL already applied or skipped."

# 5. Populate seed data into Spanner & upload product images to GCS
echo "[INFO] Step 5: Populating Spanner seed dataset and uploading images..."
if python3 -c "import google.cloud.spanner" >/dev/null 2>&1; then
  echo "[INFO] Using Python Cloud Spanner Client for batch transactional seed loading..."
  python3 - "${PROJECT_ID}" "${SPANNER_INSTANCE}" "${SPANNER_DATABASE}" "${PROJECT_ROOT}/sql/03_seed_data.sql" <<'PYEOF'
import sys
from google.cloud import spanner

project_id = sys.argv[1]
instance_id = sys.argv[2]
database_id = sys.argv[3]
sql_file = sys.argv[4]

client = spanner.Client(project=project_id)
instance = client.instance(instance_id)
database = instance.database(database_id)

with open(sql_file, 'r', encoding='utf-8') as f:
    content = f.read()

lines = [l for l in content.splitlines() if not l.strip().startswith('--')]
cleaned = '\n'.join(lines)
statements = [s.strip() for s in cleaned.split(';') if s.strip()]

print(f"[INFO] Found {len(statements)} DML seed statements to execute.")

def execute_batch(transaction, batch):
    for stmt in batch:
        transaction.execute_update(stmt)

batch_size = 20
total_batches = (len(statements) + batch_size - 1) // batch_size
for i in range(0, len(statements), batch_size):
    batch = statements[i:i+batch_size]
    database.run_in_transaction(execute_batch, batch)
    current_batch = (i // batch_size) + 1
    print(f"[INFO] Executed seed batch {current_batch}/{total_batches}")

print("[INFO] Seed dataset successfully populated into Cloud Spanner.")
PYEOF
else
  echo "[INFO] Python Cloud Spanner SDK not detected. Falling back to gcloud spanner databases execute-sql..."
  python3 -c "
import sys, subprocess
with open('${PROJECT_ROOT}/sql/03_seed_data.sql', 'r', encoding='utf-8') as f:
    content = f.read()
lines = [l for l in content.splitlines() if not l.strip().startswith('--')]
cleaned = '\n'.join(lines)
statements = [s.strip() for s in cleaned.split(';') if s.strip()]
for idx, stmt in enumerate(statements, 1):
    cmd = [
        'gcloud', 'spanner', 'databases', 'execute-sql', '${SPANNER_DATABASE}',
        '--instance=${SPANNER_INSTANCE}',
        '--project=${PROJECT_ID}',
        '--sql=' + stmt
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f'[ERROR] Statement {idx} failed: {res.stderr}')
        sys.exit(1)
"
fi

echo "[INFO] Uploading product demo images to GCS bucket gs://${GCS_BUCKET_NAME}..."
python3 "${PROJECT_ROOT}/scripts/upload_seed_images.py"   --bucket="${GCS_BUCKET_NAME}"   --sql-file="${PROJECT_ROOT}/sql/03_seed_data.sql"   --make-public

# 6. Artifact Registry Repository Creation
echo "[INFO] Step 6: Ensuring Artifact Registry repository exists..."
if ! gcloud artifacts repositories describe hifi-repo --location="${REGION}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
  echo "[INFO] Creating Artifact Registry repo 'hifi-repo' in ${REGION}..."
  gcloud artifacts repositories create hifi-repo     --repository-format=docker     --location="${REGION}"     --description="Hi-Fi Shop Demo Microservices Container Registry"     --project="${PROJECT_ID}"
fi

# 7. Build and Deploy Backend API Microservice to Cloud Run
echo "[INFO] Step 7: Building and Deploying Backend API to Cloud Run..."
BACKEND_TAG="${REGION}-docker.pkg.dev/${PROJECT_ID}/hifi-repo/backend-api:latest"
gcloud builds submit "${PROJECT_ROOT}/src/backend"   --tag="${BACKEND_TAG}"   --project="${PROJECT_ID}"

gcloud run deploy hifi-backend-api   --image="${BACKEND_TAG}"   --region="${REGION}"   --vpc-connector=hifi-shop-vpc-connector   --min-instances=0   --max-instances=5   --cpu=1   --memory=512Mi   --allow-unauthenticated   --set-env-vars="GCP_PROJECT_ID=${PROJECT_ID},SPANNER_INSTANCE_ID=${SPANNER_INSTANCE},SPANNER_INSTANCE=${SPANNER_INSTANCE},SPANNER_DATABASE_ID=${SPANNER_DATABASE},SPANNER_DATABASE=${SPANNER_DATABASE},GCS_BUCKET_NAME=${GCS_BUCKET_NAME}"   --project="${PROJECT_ID}"

BACKEND_URL=$(gcloud run services describe hifi-backend-api --region="${REGION}" --project="${PROJECT_ID}" --format='value(status.url)')
echo "[INFO] Backend API deployed at: ${BACKEND_URL}"

# 8. Build and Deploy Frontend SSR Microservice to Cloud Run
echo "[INFO] Step 8: Building and Deploying Frontend SSR to Cloud Run..."
FRONTEND_TAG="${REGION}-docker.pkg.dev/${PROJECT_ID}/hifi-repo/frontend-ssr:latest"
gcloud builds submit "${PROJECT_ROOT}/src/frontend"   --tag="${FRONTEND_TAG}"   --project="${PROJECT_ID}"

gcloud run deploy hifi-frontend-ssr   --image="${FRONTEND_TAG}"   --region="${REGION}"   --min-instances=0   --max-instances=5   --cpu=1   --memory=1Gi   --allow-unauthenticated   --set-env-vars="NEXT_PUBLIC_API_URL=${BACKEND_URL},NEXT_PUBLIC_GCS_BUCKET=${GCS_BUCKET_NAME}"   --project="${PROJECT_ID}"

FRONTEND_URL=$(gcloud run services describe hifi-frontend-ssr --region="${REGION}" --project="${PROJECT_ID}" --format='value(status.url)')

echo "========================================================================="
echo " GCP Automated Deployment Completed Successfully!"
echo " Backend API URL:  ${BACKEND_URL}"
echo " Frontend SSR URL: ${FRONTEND_URL}"
echo "========================================================================="
