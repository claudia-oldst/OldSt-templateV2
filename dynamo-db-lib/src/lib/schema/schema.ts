export const Schema = {
    version: '0.0.1',
    indexes: {
        primary: { hash: 'PK', sort: 'SK' },
        GSI1: { hash: 'GSI1PK', sort: 'GSI1SK' },
        GSI2: { hash: 'GSI2PK' },
        GSI3: { hash: 'GSI3PK', sort: 'GSI3SK' },
    },
    models: {
        User: {
            PK: { type: String, value: 'USER' },
            SK: { type: String, value: '${userId}' },
            userRole: {
                type: String,
                enum: ['USER', 'ADMIN'],
                required: true,
            },
            userId: { type: String, generate: 'ulid' },
            email: { type: String, required: true },
            GSI1PK: { type: String, value: '${userRole}' },
            GSI1SK: { type: String, value: '${email}' },
            GSI2PK: { type: String, value: '${email}' },
            GSI3PK: { type: String, value: 'USER' },
            GSI3SK: { type: String, value: '${userRole}' },
            firstName: { type: String },
            lastName: { type: String },
            data: {
                type: Object,
                default: {},
                schema: {
                    country: { type: String },
                },
            },
        },
        EmailTemplate: {
            PK: { type: String, value: 'EMAIL_TEMPLATE' },
            SK: { type: String, value: '${emailTemplateId}' },
            emailTemplateId: { type: String, generate: 'ulid' },
            GSI2PK: { type: String }, //email type and language
            subject: { type: String },
            data: {
                type: Object,
                default: {},
                schema: {
                    htmlData: { type: String },
                    textData: { type: String }
                },
            }
        },
        Logs: {
            PK: { type: String, value: 'LOGS' },
            SK: { type: String, value: '${logId}' },
            logId: { type: String, generate: 'ulid' },
            GSI1PK: { type: String },  //entity name
            GSI1SK: { type: String },  //reference Id
            GSI2PK: { type: String },  //entity name
            user: { type: String },
            action: { type: String },
            data: { type: String },

        }
    } as const,
    params: {
        isoDates: true,
        timestamps: true,
    },
};