terraform {
  # Assumes s3 bucket and dynamo DB table already set up
  # See /code/03-basics/aws-backend
  backend "s3" {
    bucket         = "saxon-dev-tf-state"
    key            = "dev/custom.message.ecr.tfstate"
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


variable "lambda_timeout" {
  description = "Timeout"
  type        = number
  default     = 900
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

variable "project" {
  description = "Project Name"
  type        = string
}



variable "lambda_lambda_outbound_security_group_ids" {
  description = "Security Group Ids"
  type        = list(string)
  
}

variable "lambda_environment_variables" {
  description = "Environment variables for the Lambda function"
  type        = map(string)
  default     = {}
}


# //ECR
module "service-ecr" {
  source          = "../../../modules/aws_ecr"
  repository_name = "${var.project}-${var.environment}-${var.service_name}"
}
# //ECR

resource "null_resource" "docker_image" {
  depends_on = [ module.service-ecr ]
  provisioner "local-exec" {
   command = "docker login ${module.service-ecr.token_proxy_endpoint} -u AWS -p ${module.service-ecr.token_password} >> output.txt && docker info >> output.txt && docker pull alpine >> output.txt && docker tag alpine ${module.service-ecr.repository_url}:latest >> output.txt && docker push ${module.service-ecr.repository_url}:latest >> output.txt"
  }
}

## LAMBDA 
module "lambda" {
  source = "../../../modules/aws_lambda_docker"
  function_name = "${var.project}-${var.environment}-${var.service_name}"
  role_arn = var.lambda_role_arn
  docker_image_uri = "${module.service-ecr.repository_url}:latest"
  vpc_id = var.lambda_vpc_id
  subnet_ids = var.lambda_private_subnet_ids
  security_group_ids = var.lambda_lambda_outbound_security_group_ids
  timeout = var.lambda_timeout
  memory_size = var.lambda_memory_size
  environment_variables = var.lambda_environment_variables

  depends_on = [ null_resource.docker_image ]

}

## LAMBDA 
output "lambda_function_arn" {
  value = module.lambda.lambda_function_arn
  
}

resource "aws_lambda_permission" "custom_message_cognito" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.lambda_function_arn
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = module.cognito_user_pool.arn
}

module "sms_uuid" {
  source = "../../../modules/random_uuid"
}

module "sms_iam_role" {
  source      = "../../../modules/aws_iam_role_condition"
  service     = "cognito-idp.amazonaws.com"
  role_name   = "${var.project}-${var.environment}-sms-role"
  external_id = module.sms_uuid.uuid

}

# create the sms policy for the IAM role
data "aws_iam_policy_document" "sms_policy" {
  statement {
    effect = "Allow"
    actions = [
      "sns:publish"
    ]
    resources = ["*"]
  }
}

module "sms_policy" {
  source          = "../../../modules/aws_iam_policy"
  role_name       = "${var.project}-${var.environment}-sms-policy-access"
  policy_document = data.aws_iam_policy_document.sms_policy.json
}

module "sms_policy_attachment" {
  source     = "../../../modules/aws_iam_role_policy_attachment"
  role_name  = "${var.project}-${var. environment}-sms-role"
  policy_arn = module.sms_policy.policy_arn
}
#Cognito IAM ROLE FOR SMS Configuration

# Cognito User Pool
module "cognito_user_pool" {
  source              = "../../../modules/aws_cognito"
  cognito_client_name = "${var.project}-${var.environment}-cognito-client"
  cognito_pool_name   = "${var.project}-${var.environment}-user-pool"
  sms_iam_role        = module.sms_iam_role.role_arn
  sms_external_id     = module.sms_uuid.uuid
  cognito_domain_name = "${var.project}-${var.environment}-domain"
  custom_message_lambda_arn = module.lambda.lambda_function_arn
}

data "aws_iam_policy_document" "lambda-cognito_policy" {
  statement {
    actions = [
      "lambda:InvokeFunction",
      "cognito-sync:*",
      "cognito-identity:*",
      "cognito-idp:*",
    ]
    resources = ["*"]
  }
}

module "lambda_policy_cognito" {
  source = "../../../modules/aws_iam_policy"

  role_name       = "${var.environment}-cognito-policy-access"
  policy_document = data.aws_iam_policy_document.lambda-cognito_policy.json
}

module "lambda_cognito_policy_attachment" {
  source     = "../../../modules/aws_iam_role_policy_attachment"
  role_name  = var.lambda_role_name
  policy_arn = module.lambda_policy_cognito.policy_arn
}
