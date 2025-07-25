terraform {
  # Assumes s3 bucket and dynamo DB table already set up
  # See /code/03-basics/aws-backend
  backend "s3" {
    bucket         = "saxon-dev-tf-state"
    key            = "dev/user-service.ecr.tfstate"
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

variable "lambda_environment_variables" {
  description = "Environment variables for the Lambda function"
  type        = map(string)
  default     = {}
}

variable "project" {
  description = "Project Name"
  type        = string
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