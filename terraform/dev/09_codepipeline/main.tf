terraform {
  # Assumes s3 bucket and dynamo DB table already set up
  # See /code/03-basics/aws-backend
  backend "s3" {
    bucket         = "saxon-dev-tf-state"
    key            = "dev/main-code-build.tfstate"
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
  description = "Environment Name"
  type        = string
}

variable "repository-url" {
  description = "Repository URL"
  type        = string
}

variable "repository-name" {
  description = "Repository Name"
  type        = string
}

variable "codebuild_role_arn" {
  description = "CodeBuild Role ARN"
  type        = string

}





variable "backend_codebuild_environment_variables" {
  description = "Backend CodeBuild Environment Variables"
  type        = map(string)

}

variable "webapp_codebuild_environment_variables" {
  description = "WebApp CodeBuild Environment Variables"
  type        = map(string)

}


variable "project" {
  description = "The Project Name"
  type        = string
}



variable "github_token" {
  description = "The Github Token" 
  type = string
}



module "code-build-credentials" {
  source = "../../modules/aws_code_build_credential"
  github_token = var.github_token
}


# #CODE BUILD 
module "code-build-backend"  {
  source                = "../../modules/aws_code_build"
  codebuild_name        = "${var.project}-${var.environment}-main-code-build"
  repository_url        = var.repository-url
  codebuild_role_arn    = var.codebuild_role_arn
  branch_name           = "development"
  buildspec_file        = "buildspec-backend.yml"
  environment_variables = var.backend_codebuild_environment_variables

}

# #CODE BUILD 
module "code-build-webapp"  {
  source                = "../../modules/aws_code_build"
  codebuild_name        = "${var.project}-${var.environment}-webapp-code-build"
  repository_url        = var.repository-url
  codebuild_role_arn    = var.codebuild_role_arn
  branch_name           = "development"
  buildspec_file        = "buildspec-webapp.yml"
  environment_variables = var.webapp_codebuild_environment_variables

}


# #CODE BUILD 

# #CODE PIPELINE
module "backend-code-pipeline" {
  source                 = "../../modules/aws_code_pipeline"
  repository_name        = var.repository-name
  pipeline_name          = "${var.project}-${var.environment}-main-pipeline"
  codebuild_project_name = module.code-build-backend.codebuild_project_name
  iam_role_arn           = var.codebuild_role_arn
  branch_name           = "development"
  github_owner          = "Old-St-Labs"

}

module "webapp-code-pipeline" {
  source                 = "../../modules/aws_code_pipeline"
  repository_name        = var.repository-name
  pipeline_name          = "${var.project}-${var.environment}-webapp-pipeline"
  codebuild_project_name = module.code-build-webapp.codebuild_project_name
  iam_role_arn           = var.codebuild_role_arn
  branch_name           = "development"
  github_owner          = "Old-St-Labs"

}


#CODE PIPELINE
