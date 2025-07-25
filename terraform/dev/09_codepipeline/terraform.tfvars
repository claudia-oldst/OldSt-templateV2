environment= "dev"
project = "saxon"
region = "eu-west-2"
repository-url = "https://github.com/Old-St-Labs/saxon.git"
repository-name = "saxon"
codebuild_role_arn = "arn:aws:iam::528757825223:role/saxon-dev-codebuild-role"

backend_codebuild_environment_variables ={
  BRANCH_NAME="development"
  PROJECT_NAME="saxon"
  AWS_ACCOUNT_ID = "528757825223"
  AWS_REGION = "eu-west-2"
  ENVIRONMENT="dev"
}

webapp_codebuild_environment_variables ={
  SERVICE_NAME ="webapp"
  AWS_ACCOUNT_ID = "528757825223"
  PROJECT_NAME="saxon"
  AWS_REGION = "eu-west-2"
  ENVIRONMENT="dev"
  AWS_SECRET_ID="saxon-dev-secret"

}