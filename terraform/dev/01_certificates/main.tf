terraform {
  # Assumes s3 bucket and dynamo DB table already set up
  # See /code/03-basics/aws-backend
  backend "s3" {
    bucket         = var.s3_bucket_name
    key            = "dev/certificate.main.tfstate"
    region         = var.region
    dynamodb_table = "terraform-state-locking"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.20.0"
    }
  }
}

variable "aws_profile" {
  description = "The AWS profile to use for the certificate."
  type        = string
  default     = "default"
}

variable "s3_bucket_name" {
  description = "The name of the S3 bucket to use for the Terraform state"
  type        = string
  default     = "madali-dev-tf-state"
}

variable "region" {
  description = "The AWS region"
  type        = string
  default     = "eu-west-1"
}

provider "aws" {
  region  = var.region
  profile = var.aws_profile
}


variable "environment" {
  description = "The environment name"
  type        = string
}

variable "domain-name" {
  description = "The domain name"
  type        = string
}

variable "project" {
  description = "The project name"
  type        = string
}


##CERTIFICATES
module "webapp_certificate" {
  source            = "../../modules/aws_certificates"
  region            = var.region
  domain_name       = "${var.project}.${var.environment}.${var.domain-name}"
  alt_domain_names  = ["*.${var.project}.${var.environment}.${var.domain-name}"]
  validation_method = "DNS"
}

module "webapp_certificate_us_east_1" {
  source            = "../../modules/aws_certificates"
  region            = "us-east-1"
  domain_name       = "${var.project}.${var.environment}.${var.domain-name}"
  alt_domain_names  = ["*.${var.project}.${var.environment}.${var.domain-name}"]
  validation_method = "DNS"
}
