service_name ="webapp"
environment= "dev"
project = "saxon"
region = "eu-west-2"
aws_profile = "saxon-dev"
private_subnet_ids=["subnet-03216aed997cfe5c9","subnet-0fb1c2aee28012d8a"]
lambda_role_arn = "arn:aws:iam::528757825223:role/saxon-dev-lambda-role"
ecs_task_role="arn:aws:iam::528757825223:role/saxon-dev-ecs-task-role"
alb_security_group=["sg-03fac3e0525de0943"]
target_group_arn="arn:aws:elasticloadbalancing:eu-west-2:528757825223:targetgroup/dev-target-group/2ef75a9ca89272fa"



