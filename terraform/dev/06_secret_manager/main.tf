terraform {
  backend "s3" {
    bucket         = "saxon-dev-tf-state"
    key            = "dev/secretmanager.tfstate"
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

provider "aws" {
  region  = var.region
  profile = var.aws_profile
}

variable "lambda_role_name" {
  description = "The name of the lambda role"
  type        = string
  
}

variable "secret_variables" {
  description = "The secret variables"
  type        = map(string)
  default     =  {
    TEST = "test"
    }
}

variable "environment" {
  description = "The environment name"
  type        = string
}

variable "project" {
  description = "The project name"
  type        = string
}


#Secret Manager
module "secret_manager" {
  source             = "../../modules/aws_secret_manager"
  secret_name        = "${var.project}-${var.environment}-secret"
  secret_description = "${var.project}-${var.environment}-secret"
  secret_variables   = var.secret_variables
}
#Secret Manager

# Secret Manager IAM Task Role
data "aws_iam_policy_document" "lambda-secret_manager_policy" {
  statement {
    actions = [
      "secretsmanager:GetSecretValue",
    ]
      resources = ["arn:aws:secretsmanager:*:*:secret:*"]
  }
}

module "lambda_policy_secret_manager" {
  source          = "../../modules/aws_iam_policy"
  role_name       = "${var.project}-${var.environment}-secret-policy-access"
  policy_document = data.aws_iam_policy_document.lambda-secret_manager_policy.json
}

module "lambda_secret_manager_policy_attachment" {
  source     = "../../modules/aws_iam_role_policy_attachment"
  role_name  = var.lambda_role_name
  policy_arn = module.lambda_policy_secret_manager.policy_arn
}
