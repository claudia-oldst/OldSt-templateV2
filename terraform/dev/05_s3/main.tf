terraform {
  backend "s3" {
    bucket         = "saxon-dev-tf-state"
    key            = "dev/s3.tfstate"
    region         = "eu-west-2"
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

variable "region" {
  description = "The AWS region"
  type        = string
  default     = "eu-west-2"
}

variable "project" {
  description = "The project name"
  type        = string
}

variable "aws_profile" {
  description = "The AWS profile to use"
  type        = string
  default     = "default"
}

provider "aws" {
  region  = var.region
  profile = var.aws_profile
}



variable "environment" {
  description = "The environment name"
  type        = string
}

variable "lambda_role_name" {
  description = "The name of the lambda role"
  type        = string
  default     = "dev-lambda-role"
}


# S3 bucket
# Note s3 bucket has to be unique across all AWS accounts
module "lambda_s3_bucket" {
  source = "../../modules/aws_s3"

  bucket_name = "${var.project}-${var.environment}-data"
  tags = {
    Name = "${var.project}-${var.environment}-data"
  }
}


  data "aws_iam_policy_document" "lambda_s3_policy" {
  statement {
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:ListBucket",
      "s3:DeleteObject"
    ]
    resources = [module.lambda_s3_bucket.bucket_arn, "${module.lambda_s3_bucket.bucket_arn}/*"]
  }
}

module "lambda_policy_s3" {
  source          = "../../modules/aws_iam_policy"
  role_name       = "${var.project}-${var.environment}-s3-policy-access"
  policy_document = data.aws_iam_policy_document.lambda_s3_policy.json
}

module "lambda_s3_policy_attachment" {
  source     = "../../modules/aws_iam_role_policy_attachment"
  role_name  = var.lambda_role_name
  policy_arn = module.lambda_policy_s3.policy_arn
}
