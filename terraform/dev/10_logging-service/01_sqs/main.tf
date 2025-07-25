terraform {
  # Assumes s3 bucket and dynamo DB table already set up
  # See /code/03-basics/aws-backend
  backend "s3" {
    bucket         = "saxon-dev-tf-state"
    key            = "dev/logging-service.sqs.tfstate"
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
  description = "Environment Name"
  type        = string
}


variable "lambda_role_name" {
  description = "Lambda Role name"
  type        = string
}

variable "project" {
  description = "Project Name"
  type        = string
}


module "logging_sqs_queue" {
  source = "../../../modules/aws_sqs"
  queue_name = "${var.project}-${var.environment}-logging-queue"
}




output "sqs_logging_url" {
  value = module.logging_sqs_queue.queue_url
  
}

output "sqs_arn_trigger" {
  value = module.logging_sqs_queue.queue_arn
  
}