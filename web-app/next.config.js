//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require("@nx/next/plugins/with-nx");
const { GetSecretValueCommand, SecretsManagerClient } = require('@aws-sdk/client-secrets-manager');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
    nx: {
        // Set this to true if you would like to to use SVGR
        // See: https://github.com/gregberge/svgr
        svgr: false,
    },
    env: {
        DEFAULT_REGION: process.env.DEFAULT_REGION,
        AWS_SECRET_ID: process.env.AWS_SECRET_ID,
        AWS_ASSUME_ROLE_ARN: process.env.AWS_ASSUME_ROLE_ARN,
        AWS_COGNITO_USER_POOL_ID: process.env.AWS_COGNITO_USER_POOL_ID,
        AWS_COGNITO_CLIENT_ID: process.env.AWS_COGNITO_CLIENT_ID,
        // Api URLs
        USER_BASE_URL: process.env.USER_BASE_URL
    },
    async redirects() {
        if (process.env.NX_WEB_APP_API_KEY) {
            try {
                const client = new SecretsManagerClient({
                    region: process.env.DEFAULT_REGION
                });
                const { SecretString } = await client.send(
                    new GetSecretValueCommand({
                        SecretId: process.env.AWS_SECRET_ID,
                        VersionStage: 'AWSCURRENT'
                    })
                );
                const secretsJson = JSON.parse(SecretString);
        
                Object.keys(secretsJson).forEach((key) => {
                    process.env[`NX_${key}`] = secretsJson[key];
                });
            } catch (err) {
                console.error(err);
            }
        }

        return [
            {
                source: '/',
                destination: '/auth/login',
                permanent: true
            }
        ]
    },
};

module.exports = withNx(nextConfig);
