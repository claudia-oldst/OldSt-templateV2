terraform {
  backend "s3" {
    bucket         = "saxon-dev-tf-state"
    key            = "dev/dynamodb.main.tfstate"
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


variable "environment" {
  description = "The environment name"
  type        = string
}

variable "lambda_role_name" {
  description = "The name of the lambda role"
  type        = string
  default     = "dev-lambda-role"
}

variable "project" {
  description = "The project name"
  type        = string
}




resource "aws_dynamodb_table" "dynamodb-table" {
  name         = "${var.project}-${var.environment}-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"

  point_in_time_recovery {
    enabled = true
  }

attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }
  attribute {
    name = "GSI1PK"
    type = "S"
  }

  attribute {
    name = "GSI1SK"
    type = "S"
  }

  attribute {
    name = "GSI2PK"
    type = "S"
  }

  attribute {
    name = "GSI3PK"
    type = "S"
  }

  attribute {
    name = "GSI3SK"
    type = "S"
  }

  global_secondary_index {
    name            = "GSI1"
    hash_key        = "GSI1PK"
    range_key       = "GSI1SK"
    projection_type = "ALL"
  }


  global_secondary_index {
    name            = "GSI2"
    hash_key        = "GSI2PK"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "GSI3"
    hash_key        = "GSI3PK"
    range_key       = "GSI3SK"
    projection_type = "ALL"
  }
}

data "aws_iam_policy_document" "lambda-dynamodb_policy" {
  statement {
    actions = [
      "dynamodb:PutItem",
      "dynamodb:GetItem",
      "dynamodb:DeleteItem",
      "dynamodb:UpdateItem",
      "dynamodb:Query",
      "dynamodb:Scan"
    ]
    resources = [aws_dynamodb_table.dynamodb-table.arn, "${aws_dynamodb_table.dynamodb-table.arn}/*"]
  }
}

module "lambda_policy_dynamodb" {
  source          = "../../modules/aws_iam_policy"
  role_name       = "${var.project}-${var.environment}-dynamodb-policy-access"
  policy_document = data.aws_iam_policy_document.lambda-dynamodb_policy.json
}

module "lambda_dynamodb_policy_attachment" {
  source     = "../../modules/aws_iam_role_policy_attachment"
  role_name  = var.lambda_role_name
  policy_arn = module.lambda_policy_dynamodb.policy_arn
}
