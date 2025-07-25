import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({
    region: process.env.DEFAULT_REGION
});

export async function getSecret() {
    try {
        const { SecretString } = await client.send(
            new GetSecretValueCommand({
                SecretId: process.env.AWS_SECRET_ID,
                VersionStage: 'AWSCURRENT'
            })
        );
        const secretsJson = JSON.parse(SecretString);

        Object.keys(secretsJson).forEach((key) => {
            process.env[key] = secretsJson[key];
        });
    } catch (err) {
        console.error(err);
    }
}