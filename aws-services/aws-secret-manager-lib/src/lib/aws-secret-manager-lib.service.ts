import {
    GetSecretValueCommand,
    SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsSecretManagerLibService {
    private client;

    constructor() {
        this.client = new SecretsManagerClient({
            region: process.env['DEFAULT_REGION'],
        });
    }

    async getSecrets() {
        const response = await this.client.send(
            new GetSecretValueCommand({
                SecretId: process.env['AWS_SECRET_ID'],
                VersionStage: 'AWSCURRENT',
            })
        );

        const secrets = response.SecretString;

        return secrets;
    }
}
