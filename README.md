# Nx Workspace Tempalte


## Initial Setup
Run `yarn install` 

create a .env.local file with the following details : 
DEFAULT_REGION=<AWS REGION>
DYNAMO_DB_MAIN_TABLE=<DYNAMO_DB_TABLE NAME> -> if the database to be use is DynamoDB
AWS_ACCESS_KEY_ID=<AWS KEY ID> ->  only for local development
AWS_SECRET_ACCESS_KEY=<AWS SECRET KEY> -> only for local development
DATABASE_URL= <mysql://username:password@localhost:3306/db_name>  -> if PRISMA Library is used

## Development server

Run `nx serve <application-name>` - run specific application

Run `yarn all ` - run all application with different ports

## Prisma Migration / Generate
- Modify the prisma schema file
- Run `yarn prisma-local:apply` for LOCAL ENVIRONMENT
- Run `yarn prisma-migrate:development` for DEV ENVIRONMENT
- Run `yarn prisma-migrate:staging` for STG ENVIRONMENT

## How to Add ENV variables 
- Modify the env files (env.local , env.dev etc etc)
- Modify configuration.ts from /libs/core/src/lib/config and assign a corresponding variable name 
- Use ConfigService as needed (e.g. configService.get<string>('DATABASE_URL') )



## Deployment Backend

Pre-req:
-Install Serverless Cli : npm install -g serverless
-Install AWS CLI : https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
-Setup an aws profile on your local machine named mercuri

Build All Backend Application for Serverless: 
Run `yarn build-all-serverless`

Create Backend Application Serverless Required Files:
Run `yarn build-serverless-files-<application-name> --stage=<stage>`
    e.g. `yarn build-serverless-files-core-service --stage=dev`

Go to the `dist/apps/<application-name>`
Run `sls deploy --stage=<stage>`

## Run Frontend
Local Environment (.env.local)
- Run `npx nx serve web-app`

Specific Environment
- create .env file `.env.<envname>`
- add script to package.json `"web-app:<envname>": "npx env-cmd -f .env.<envname> nx serve web-app"`
- Run `yarn web-app:<envname>`


## Deployment Frontend
Pre-req:
A existing EBS Node JS instance t2.small minimum

- Build the frontend app `nx build admin-app`
- Run `buildAdminAppZip.sh`
-a zip admin_app.zip file will be created
-upload zip on the EBS Node Js Instance

## Storybook
- Run `yarn storybook`


### Encountered issues
Issue: 
```
ERROR in ./apps/user-service/src/file-services/file-services.controller.ts:25:46
TS2694: Namespace 'global.Express' has no exported member 'Multer'.
    23 |     })
    24 |     @UseInterceptors(FileInterceptor('file'))
  > 25 |     uploadFile(@UploadedFile() file: Express.Multer.File) {
       |                                              ^^^^^^
    26 |         return this.fileServicesService.uploadFile(file);
    27 |     }
    28 |
```
Solution:
Updated `tsconfig.app.json`
{
  "compilerOptions": {
    ...
    "types": ["node", "Multer"] // added "Multer" in here
  },
  ...
}
