terraform {
  backend "s3" {
    bucket         = "saxon-dev-tf-state"
    key            = "dev/sqs.policy.tfstate"
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

variable "aws_profile" {
  description = "The AWS profile to use"
  type        = string
  default     = "default"
}

variable "region" {
  description = "The AWS region"
  type        = string
  default     = "eu-west-2"
}

provider "aws" {
  region  = var.region
  profile = var.aws_profile
}



variable "environment" {
  description = "The environment name"
  type        = string
}

variable "project" {
  description = "The project name"
  type        = string
}

variable "lambda_role_name" {
  description = "The name of the lambda role"
  type        = string
  default     = "dev-lambda-role"
}


data "aws_iam_policy_document" "lambda-auth_sqs_policy" {
  statement {
    actions = [
      "sqs:SendMessage",
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes"

    ]
   resources = ["arn:aws:sqs:*:*:*"]
  }
}

module "lambda_policy_auth_sqs" {
  source = "../../modules/aws_iam_policy"

  role_name       = "${var.project}-${var.environment}-sqs-policy-access"
  policy_document = data.aws_iam_policy_document.lambda-auth_sqs_policy.json
}

module "lambda_sqs_policy_attachment" {
  source     = "../../modules/aws_iam_role_policy_attachment"
  role_name  = var.lambda_role_name
  policy_arn = module.lambda_policy_auth_sqs.policy_arn
}

