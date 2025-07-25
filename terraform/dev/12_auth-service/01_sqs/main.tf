terraform {
  # Assumes s3 bucket and dynamo DB table already set up
  # See /code/03-basics/aws-backend
  backend "s3" {
    bucket         = "saxon-dev-tf-state"
    key            = "dev/authentication-sqs.tfstate"
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

variable "service_name" {
  description = "The Service Name"
  type        = string
}


variable "environment" {
  description = "Environment Name"
  type        = string
}

variable "lambda_vpc_id" {
  description = "Vpc Id"
  type        = string
}

variable "lambda_private_subnet_ids" {
  description = "Subnet Ids"
  type        = list(string)
}

variable "lambda_role_arn" {
  description = "Lambda Role Arn"
  type        = string
}

variable "lambda_role_name" {
  description = "Lambda Role name"
  type        = string
}

variable "lambda_memory_size" {
  description = "Memory Size"
  type        = number
  default     = 128
  
}

variable "lambda_timeout" {
  description = "Timeout"
  type        = number
  default     = 900
}

variable "lambda_lambda_outbound_security_group_ids" {
  description = "Security Group Ids"
  type        = list(string)
  
}

variable "project" {
  description = "Project Name"
  type        = string
}



variable "lambda_environment_variables" {
  description = "Environment variables for the Lambda function"
  type        = map(string)
  default     = {}
}


module "auth_sqs_queue" {
  source = "../../../modules/aws_sqs"
  queue_name = "${var.project}-${var.environment}-auth-queue"
}

data "aws_iam_policy_document" "lambda-auth_sqs_policy" {
  statement {
    actions = [
      "sqs:SendMessage",
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes"

    ]
    resources = [module.auth_sqs_queue.queue_arn, "${module.auth_sqs_queue.queue_arn}/*"]
  }
}

module "lambda_policy_auth_sqs" {
  source = "../../../modules/aws_iam_policy"

  role_name       = "${var.project}-${var.environment}-auth-sqs-policy-access"
  policy_document = data.aws_iam_policy_document.lambda-auth_sqs_policy.json
}

module "lambda_sqs_policy_attachment" {
  source     = "../../../modules/aws_iam_role_policy_attachment"
  role_name  = var.lambda_role_name
  policy_arn = module.lambda_policy_auth_sqs.policy_arn
}


output "sqs_authentication_url" {
  value = module.auth_sqs_queue.queue_url
  
}

output "sqs_arn_trigger" {
  value = module.auth_sqs_queue.queue_arn
  
}