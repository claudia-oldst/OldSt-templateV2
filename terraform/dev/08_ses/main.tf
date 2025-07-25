terraform {
  backend "s3" {
    bucket         = "saxon-dev-tf-state"
    key            = "dev/ses.tfstate"
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

variable "aws_profile" {
  description = "The AWS profile to use"
  type        = string
  default     = "default"
}

variable "project" {
  description = "The project name"
  type        = string
}

provider "aws" {
  region  = var.region
  profile = var.aws_profile
}

variable "lambda_role_name" {
  description = "The name of the lambda role"
  type        = string
  
}

variable "environment" {
  description = "The environment name"
  type        = string
}


data "aws_iam_policy_document" "lambda-ses_policy" {
  statement {
    actions = [
      "ses:SendEmail",
      "ses:SendRawEmail"
    ]
    resources = ["*"]
  }
}

module "lambda_policy_ses" {
  source          = "../../modules/aws_iam_policy"
  role_name       = "${var.project}-${var.environment}-ses-policy-access"
  policy_document = data.aws_iam_policy_document.lambda-ses_policy.json
}

module "lambda_ses_policy_attachment" {
  source     = "../../modules/aws_iam_role_policy_attachment"
  role_name  = var.lambda_role_name
  policy_arn = module.lambda_policy_ses.policy_arn
}


# SES IAM ROLE FOR EMAIL Configuration

# SES Email Verification
module "ses_email" {
  source        = "../../modules/aws_ses"
  email_address = ["arben@old.st","mark@old.st"]
}
