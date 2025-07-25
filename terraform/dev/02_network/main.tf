terraform {
  # Assumes s3 bucket and dynamo DB table already set up
  # See /code/03-basics/aws-backend
  backend "s3" {
    bucket         = "saxon-dev-tf-state"
    key            = "dev/network.tfstate"
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
  description = "The AWS profile to use for the certificate."
  type        = string
  default     = "default"
}

variable "s3_bucket_name" {
  description = "The name of the S3 bucket to use for the Terraform state"
  type        = string
  default     = "saxon-dev-tf-state"
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

variable "health_check_path" {
  description = "The path for the health check"
  type        = string
}



module "vpc" {
  source = "../../modules/aws_vpc"

  name            = "${var.project}-${var.environment}-vpc"
  cidr            = "10.0.0.0/16"
  azs             = ["eu-west-2a", "eu-west-2b", "eu-west-2c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.3.0/24", "10.0.4.0/24"]
}

output "vpc_id" {
  description = "The VPC ID"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "The Public Subnet IDs"
  value       = module.vpc.public_subnet_ids
  
}

output "private_subnet_ids" {
  description = "The Private Subnet IDs"
  value       = module.vpc.private_subnet_ids
  
}

##Security Groups

# Allow All traffic
module "webapp_load_balancer_security_group" {
  source = "../../modules/aws_security_groups_all_traffic"

  vpc_id                     = module.vpc.vpc_id
  security_group_name        = "${var.project}-${var.environment}-allow-all"
  security_group_description = "Allow all traffic"
}

# Allow traffic only from the load balancer
module "webapp_security_group_from_alb" {
  source = "../../modules/aws_security_group_from_alb"

  load_balancer_security_group_id = module.webapp_load_balancer_security_group.security_group_id
  specific_port                   = 3000
  security_group_name             = "${var.project}-${var.environment}-from-loadbalancer-sg"
  security_group_description      = "Allow traffic from the load balancer"
  vpc_id                          = module.vpc.vpc_id
}

output "alb_security_group_id" {
  description = "The ALB ID of the security group"
  value       = module.webapp_security_group_from_alb.security_group_id
  
}

# Allow Outbound traffic
module "webapp_security_group_outbound_only" {
  source = "../../modules/aws_security_group_outbound_only"

  vpc_id                     = module.vpc.vpc_id
  security_group_name        = "${var.project}-${var.environment}-outbound-only"
  security_group_description = "Allow outbound traffic only"
}

output "webapp_security_group_id" {
  description = "The WEBAPP ID of the security group"
  value       = module.webapp_security_group_from_alb.security_group_id
  
}

module "lambda_security_group_outbound_only" {
  source                     = "../../modules/aws_security_group_outbound_only"
  vpc_id                     = module.vpc.vpc_id
  security_group_name        = "${var.project}-${var.environment}-lambda-outbound-only"
  security_group_description = "Allow outbound traffic only for Lambda Functions"
}

output "lambda_security_group_id" {
  description = "The WEBAPP ID of the security group"
  value       = module.webapp_security_group_from_alb.security_group_id
  
}

##Security Groups

## LOAD BALANCER- HTTP ONLY
# This is intended for Load Balancers where Certificates are not available
module "webapp_load_balancer" {
  source = "../../modules/aws_load_balancer_http"

  alb_name          = "${var.project}-${var.environment}-webapp-alb"
  subnets           = module.vpc.public_subnet_ids
  security_groups   = [module.webapp_load_balancer_security_group.security_group_id]
  target_group_name = "${var.environment}-target-group"
  vpc_id            = module.vpc.vpc_id
  listener_port     = 80
  health_check_path = var.health_check_path
}


## LOAD BALANCER- HTTP ONLY

## LOAD BALANCER- HTTPS
# module "webapp_load_balancer_https" {
#   source            = "../../modules/aws_load_balancer_https"
#   domain_name       = "${var.environment}.old.st"
#   certificate_arn   = "arn:aws:acm:eu-west-1:654654478981:certificate/eef695ba-8d20-4da7-a475-8adfea7fdae2"
#   alb_name          = "${var.environment}-webapp-alb"
#   subnets           = module.vpc.public_subnet_ids
#   security_groups   = [module.webapp_load_balancer_security_group.security_group_id]
#   target_group_name = "${var.environment}-target-group"
#   vpc_id            = module.vpc.vpc_id
#   listener_port     = 80
#   health_check_path = var.health_check_path
# }
# ## LOAD BALANCER- HTTPS


# output "alb_arn" {
#   description = "The ARN of the ALB"
#   value       = module.webapp_load_balancer_https.alb_arn
# }

# output "target_group_arn" {
#   description = "The Target ARN of the ALB"
#   value       = module.webapp_load_balancer_https.target_group_arn
# }