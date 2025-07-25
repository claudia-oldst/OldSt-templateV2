terraform {
  # Assumes s3 bucket and dynamo DB table already set up
  # See /code/03-basics/aws-backend
  backend "s3" {
    bucket         = "saxon-dev-tf-state"
    key            = "dev/iam.tfstate"
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

variable "environment" {
  description = "The environment name"
  type        = string
}



variable "aws_profile" {
  description = "The AWS profile to use for the certificate."
  type        = string
  default     = "default"
}

variable "project" {
  description = "The project name"
  type        = string
}

provider "aws" {
  region  = var.region
  profile = var.aws_profile
}



# ECS Task Role
module "ecs_task_role" {
  source    = "../../modules/aws_iam_role"
  services   = ["ecs-tasks.amazonaws.com"]
  role_name = "${var.project}-${var.environment}-ecs-task-role"
}

module "ecs_task_execution_role_policy_attachment" {
  source     = "../../modules/aws_iam_role_policy_attachment"
  role_name  = module.ecs_task_role.role_name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"

}

module "ecs_full_access_policy_attachment" {
  source     = "../../modules/aws_iam_role_policy_attachment"
  role_name  = module.ecs_task_role.role_name
  policy_arn = "arn:aws:iam::aws:policy/AmazonECS_FullAccess"
}
# ECS Task Role




# CodeBuild Task Role
module "codebuild_iam_role" {
  source    = "../../modules/aws_iam_role"
  services   = ["codebuild.amazonaws.com","codepipeline.amazonaws.com"]
  role_name = "${var.project}-${var.environment}-codebuild-role"
}

data "aws_iam_policy_document" "codebuild_policy" {
  statement {
    actions = [
      "codebuild:CreateProject",
      "codebuild:BatchGetBuilds",
      "codebuild:StartBuild",
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "codepipeline:CreatePipeline",
      "codepipeline:StartPipelineExecution",
      "codepipeline:GetPipeline",
      "codepipeline:GetPipelineState",
      "codepipeline:GetPipelineExecution",
      "codepipeline:PutJobSuccessResult",
      "codepipeline:PutJobFailureResult",
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:GetRepositoryPolicy",
      "ecr:DescribeRepositories",
      "ecr:ListImages",
      "ecr:DescribeImages",
      "ecr:BatchGetImage",
      "ecr:GetLifecyclePolicy",
      "ecr:GetLifecyclePolicyPreview",
      "ecr:ListTagsForResource",
      "ecr:DescribeImageScanFindings",
      "s3:*",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
      "ecr:PutImage",
      "lambda:UpdateFunctionCode",
      "ecs:UpdateService",
      "codestar-connections:*" 


    ]
    resources = ["*"]
  }
}

module "codebuild_policy" {
  source          = "../../modules/aws_iam_policy"
  role_name       = "${var.project}-${var.environment}-codebuild-role"
  policy_document = data.aws_iam_policy_document.codebuild_policy.json
}

module "codebuild_policy_attachment" {
  source     = "../../modules/aws_iam_role_policy_attachment"
  role_name  = module.codebuild_iam_role.role_name
  policy_arn = module.codebuild_policy.policy_arn
}

# Lambda Function Task Role
module "lamda_task_role" {
  source    = "../../modules/aws_iam_role"
  services   = ["lambda.amazonaws.com"]
  role_name = "${var.project}-${var.environment}-lambda-role"
}

module "lamda_task_role_role_policy_attachment" {
  source     = "../../modules/aws_iam_role_policy_attachment"
  role_name  = module.lamda_task_role.role_name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}
# Lambda Function Task Role

output "lambda_role_name" {
  value = module.lamda_task_role.role_name
}

output "lambda_role_arn" {
  value = module.lamda_task_role.role_arn
}


output "ecs_task_role_name" {
  value = module.ecs_task_role.role_name
}


output "ecs_task_role_arn" {
  value = module.ecs_task_role.role_arn
}

output "codebuild_role_name" {
  value = module.codebuild_iam_role.role_name
}
output "codebuild_role_arn" {
  value = module.codebuild_iam_role.role_arn
}


