#!/usr/bin/env bash
set -euo pipefail

# Configuration with defaults
PROJECT_ID="${GCP_PROJECT_ID:-}"
REGION="${GCP_REGION:-asia-east2}"
BUCKET_NAME="${GCS_BUCKET_NAME:-bryanko-hifi-shop-demo-assets}"
BUCKET_URI="gs://${BUCKET_NAME}"

echo "=================================================="
echo " Setting up Google Cloud Storage Bucket"
echo " Bucket: ${BUCKET_URI}"
echo " Region: ${REGION}"
echo "=================================================="

# Base project flag if GCP_PROJECT_ID is provided
PROJECT_FLAG=()
if [[ -n "${PROJECT_ID}" ]]; then
  PROJECT_FLAG=(--project="${PROJECT_ID}")
fi

# 1. Create GCS Bucket if it does not already exist
if gcloud storage buckets describe "${BUCKET_URI}" "${PROJECT_FLAG[@]}" >/dev/null 2>&1; then
  echo "[INFO] Bucket ${BUCKET_URI} already exists."
else
  echo "[INFO] Creating bucket ${BUCKET_URI} in region ${REGION}..."
  gcloud storage buckets create "${BUCKET_URI}" \
    --location="${REGION}" \
    --uniform-bucket-level-access \
    "${PROJECT_FLAG[@]}"
  echo "[INFO] Bucket created successfully."
fi

# 2. Grant public read access to all users
echo "[INFO] Configuring public IAM access (allUsers -> roles/storage.objectViewer)..."
gcloud storage buckets add-iam-policy-binding "${BUCKET_URI}" \
  --member="allUsers" \
  --role="roles/storage.objectViewer" \
  "${PROJECT_FLAG[@]}" || echo "[WARN] Public IAM binding skipped due to GCP Org Domain Restricted Sharing policy."

# 3. Configure CORS headers for web access
echo "[INFO] Configuring CORS headers..."
CORS_FILE=$(mktemp)
trap 'rm -f "${CORS_FILE}"' EXIT

cat <<'CORS_EOF' > "${CORS_FILE}"
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "OPTIONS"],
    "responseHeader": ["*"],
    "maxAgeSeconds": 3600
  }
]
CORS_EOF

gcloud storage buckets update "${BUCKET_URI}" \
  --cors-file="${CORS_FILE}" \
  "${PROJECT_FLAG[@]}"

echo "=================================================="
echo " Bucket setup completed successfully!"
echo "=================================================="
