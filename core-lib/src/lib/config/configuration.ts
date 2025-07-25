import { AwsSecretManagerLibService } from '@aws-secret-manager-lib';

export const configuration = async () => {
    const awsSecretsService = new AwsSecretManagerLibService();


    const awsSecrets = JSON.parse(await awsSecretsService.getSecrets());



    return {
        NODE_ENV: process.env.NODE_ENV,
        DEFAULT_REGION: process.env.DEFAULT_REGION,
        AWS_COGNITO_USER_POOL_ID: process.env.AWS_COGNITO_USER_POOL_ID,
        AWS_COGNITO_CLIENT_ID: process.env.AWS_COGNITO_CLIENT_ID,
        AWS_COGNITO_AUTHORITY: process.env.AWS_COGNITO_AUTHORITY,
        WEB_APP_API_KEY: await awsSecrets['WEB_APP_API_KEY'],
        AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
        DYNAMO_DB_MAIN_TABLE: process.env.DYNAMO_DB_MAIN_TABLE,
        AWS_AUTHENTICATION_QUEUE_URL: process.env.AWS_AUTHENTICATION_QUEUE_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
        AWS_LOGGING_QUEUE_URL: process.env.AWS_LOGGING_QUEUE_URL,
    };
};
