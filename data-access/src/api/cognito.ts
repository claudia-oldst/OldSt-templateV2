/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';

class CognitoApi {
    public getUser = (email: string) => {
        const userPool = new CognitoUserPool({
            UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
            ClientId: process.env.AWS_COGNITO_CLIENT_ID,
        });

        return new CognitoUser({ Username: email, Pool: userPool });
    };

    public loginUser = async (loginDetails: { email: string, password: string }): Promise<{
        result: any; cognitoUser: CognitoUser;
    }> => {
        const cognitoUser = this.getUser(loginDetails.email);
        const authDetails = new AuthenticationDetails({ Username: loginDetails.email, Password: loginDetails.password });

        return await this.asyncAuthenticateUser(cognitoUser, authDetails);
    };

    public asyncAuthenticateUser = async (cognitoUser: CognitoUser, cognitoAuthenticationDetails: AuthenticationDetails): Promise<{
        result: any; cognitoUser: CognitoUser;
    }> => {
        const result = await new Promise(function (resolve, reject) {
            cognitoUser.authenticateUser(cognitoAuthenticationDetails, {
                onSuccess: resolve,
                newPasswordRequired: (data) => resolve({ ...data, 'newPasswordRequired': true }),
                onFailure: reject,
            });
        });

        return { result, cognitoUser };
    };

    public completeNewPasswordChallenge = (cognitoUser: CognitoUser, newPassword: string): Promise<any> => {
        return new Promise(function (resolve, reject) {
            cognitoUser.completeNewPasswordChallenge(newPassword, [], {
                onSuccess: resolve,
                onFailure: reject,
            });
        });
    };

    public forgotPassword = (email: string): Promise<any> => {
        const cognitoUser = this.getUser(email);

        return new Promise(function (resolve, reject) {
            cognitoUser.forgotPassword({
                onSuccess: resolve,
                onFailure: reject,
            });
        });
    };

    public verifyAndSetPassword = (verificationCode: string, newPassword: string, email: string): Promise<any> => {
        const cognitoUser = this.getUser(email);

        return new Promise(function (resolve, reject) {
            cognitoUser.confirmPassword(verificationCode, newPassword, {
                onSuccess: resolve,
                onFailure: reject,
            });
        });
    };

    public resendConfirmationCode = (email: string) => {
        const cognitoUser = this.getUser(email);

        return new Promise(function (resolve, reject) {
            cognitoUser.resendConfirmationCode((err, result) => {
                resolve(result);
                reject(err);
            });
        });
    };

    public getSession = (cognitoUser: CognitoUser) => {
        // const cognitoUser = UserPool.getCurrentUser();
        // console.log({ cognitoUser });

        if (cognitoUser != null) {
            return new Promise(function (resolve, reject) {
                cognitoUser.getSession((err: any, session: unknown) => {
                    reject(err);
                    resolve(session);
                });
            });
        }

        return null;
    };
}

const Cognito = new CognitoApi();
export { Cognito };
