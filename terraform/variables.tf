variable "project_id" {
  description = "The GCP project ID where resources will be created."
  type        = string
  default     = "bryanko-hifi-shop-demo"
}

variable "region" {
  description = "The GCP region for resources."
  type        = string
  default     = "asia-east2"
}

variable "spanner_processing_units" {
  description = "The number of processing units allocated to the Spanner instance."
  type        = number
  default     = 100
}

variable "bucket_name" {
  description = "The name of the Google Cloud Storage bucket."
  type        = string
  default     = "hifi-shop-demo-assets"
}
