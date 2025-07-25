/* eslint-disable @typescript-eslint/no-explicit-any */
import { CognitoCompleteNewPasswordDto, CognitoConfirmCodeDto, CognitoDto, CognitoEmailDto, CognitoForgotPasswordDto } from '@dto';
import { AxiosConfig } from './axiosConfig';

const API_AUTH = '/authentication';

class AuthApi extends AxiosConfig {

    constructor() {
        super(process.env.API_USER_URL, false, false);
    }

    public login = async <T>(params: CognitoDto): Promise<T> => {
        return await this.axiosInstance.post(`${API_AUTH}/login`, params);
    };

    public signUp = async <T>(params: CognitoEmailDto): Promise<T> => {
        return await this.axiosInstance.post(`${API_AUTH}/sign-up`, params);
    };

    public confirmSignup = async <T>(params: CognitoConfirmCodeDto): Promise<T> => {
        return await this.axiosInstance.post(`${API_AUTH}/sign-up-confirmation`, params);
    };

    public resendConfirmation = async <T>(email: string): Promise<T> => {
        return await this.axiosInstance.post(`${API_AUTH}/resend-confirmation`, { email });
    };

    public completeNewPassword = async <T>(params: CognitoCompleteNewPasswordDto): Promise<T> => {
        return await this.axiosInstance.post(`${API_AUTH}/complete-new-password`, params);
    };

    public forgotPassword = async <T>(params: CognitoEmailDto): Promise<T> => {
        return await this.axiosInstance.post(`${API_AUTH}/forgot-password`, params);
    };

    public confirmPasswordChange = async <T>(params: CognitoForgotPasswordDto): Promise<T> => {
        return await this.axiosInstance.post(`${API_AUTH}/confirm-password-change`, params);
    };
}

const Auth = new AuthApi();
export { Auth };
