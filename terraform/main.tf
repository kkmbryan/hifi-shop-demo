terraform {
  required_version = ">= 1.0.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.0.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# 1. VPC Network
resource "google_compute_network" "hifi_vpc" {
  name                    = "hifi-shop-vpc"
  auto_create_subnetworks = false
}

# 2. VPC Subnetwork
resource "google_compute_subnetwork" "hifi_subnet" {
  name          = "hifi-shop-subnet"
  region        = var.region
  network       = google_compute_network.hifi_vpc.id
  ip_cidr_range = "10.0.1.0/24"
}

# 3. Serverless VPC Access Connector
resource "google_vpc_access_connector" "vpc_connector" {
  name          = "hifi-shop-vpc-connector"
  region        = var.region
  ip_cidr_range = "10.8.0.0/28"
  network       = google_compute_network.hifi_vpc.name
}

# 4. Cloud Spanner Instance
resource "google_spanner_instance" "hifi_spanner" {
  name             = "hifi-shop-spanner"
  config           = "regional-${var.region}"
  display_name     = "hifi-shop-spanner"
  processing_units = var.spanner_processing_units
}

# 5. Cloud Spanner Database
resource "google_spanner_database" "hifi_db" {
  instance            = google_spanner_instance.hifi_spanner.name
  name                = "hifi-shop-db"
  deletion_protection = false
}

# 6. Google Cloud Storage Asset Bucket
resource "google_storage_bucket" "assets_bucket" {
  name                        = var.bucket_name
  location                    = var.region
  uniform_bucket_level_access = true

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "OPTIONS"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# GCS Public Read IAM Binding
resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.assets_bucket.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}
