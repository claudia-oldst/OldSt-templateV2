terraform {
  # Assumes s3 bucket and dynamo DB table already set up
  # See /code/03-basics/aws-backend
  backend "s3" {
    bucket         = "saxon-dev-tf-state"
    key            = "dev/webapp.ecr.tfstate"
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

provider "aws" {
  region  = var.region
  profile = var.aws_profile
}



variable "service_name" {
  description = "The Service Name"
  type        = string
}


variable "region" {
  description = "The AWS Region"
  type        = string
}

variable "environment" {
  description = "Environment Name"
  type        = string
}

variable "ecs_task_role" {
  description = "ECS Task Role ARN"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private Subnet Ids"
  type        = list(string)
}

variable "alb_security_group" {
  description = "ALB Security Group"
   type        = list(string)
}

variable "target_group_arn" {
  description = "Target Group ARN"
  type        = string
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



# ECS Task Definition
module "webapp_task_definition" {
  source = "../../../modules/aws_ecs_task_definition"

  task_definition_name = "${var.project}-${var.environment}-${var.service_name}-task"
  task_role_arn        = var.ecs_task_role
  execution_role_arn   = var.ecs_task_role
  ecr_repository_url   = module.service-ecr.repository_url
  container_port       = 3000
  host_port            = 3000
  cpu                  = "256"
  memory               = "512"
  log_group            = "${var.project}-${var.environment}-${var.service_name}-log-group"
  log_region           = var.region
  os_family            = "LINUX"
  cpu_architecture     = "X86_64"

}

## ECS Cluster
module "ecs_cluster" {
  source = "../../../modules/aws_ecs_cluster"

  cluster_name = "${var.project}-${var.environment}-${var.service_name}-cluster"
}

module "webapp_ecs_service" {
  source = "../../../modules/aws_ecs"
  service_name     = "${var.project}-${var.environment}-${var.service_name}"
  cluster          = module.ecs_cluster.ecs_cluster_id
  task_definition  = module.webapp_task_definition.ecs_task_definition_arn
  desired_count    = 1
  subnets          = var.private_subnet_ids
  security_groups  = var.alb_security_group
  target_group_arn = var.target_group_arn
  container_name   = "${var.project}-${var.environment}-${var.service_name}-task"

  container_port   = 3000

 
 }