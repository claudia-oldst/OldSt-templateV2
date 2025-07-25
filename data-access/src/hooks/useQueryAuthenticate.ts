import { AdminInitiateAuthCommandOutput, AdminInitiateAuthResponse } from '@aws-sdk/client-cognito-identity-provider';
import { Auth } from '@data-access/api/auth';
import { useStore } from '@data-access/state-management';
import { CognitoCompleteNewPasswordDto, CognitoConfirmCodeDto, CognitoDto, CognitoEmailDto, CognitoForgotPasswordDto } from '@dto';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { ResponseError } from './../types/responseError';

export const useLoginUserMutation = (
    onSuccessFunc: (data: CognitoDto, accessToken: string) => void,
    onNewPasswordRequiredFunc: (data: AdminInitiateAuthCommandOutput) => void
) => {
    const setFlashNotification = useStore((state) => state.setFlashNotification);
    const updateAuthedUser = useStore((state) => state.updateAuthedUser);

    return useMutation({
        mutationFn: (data: CognitoDto) => {
            return Auth.login(data);
        },
        onError() {
            // TODO handle if email does not exist
            // if (error.response?.status === 401) {
            //     return;
            // }

            setFlashNotification({
                title: 'Your email address or password is incorrect',
                message: 'Please check your details and try again.',
                alertType: 'error'
            });
        },
        onSuccess(data: AdminInitiateAuthCommandOutput, variables) {
            if (data.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
                onNewPasswordRequiredFunc(data);
                updateAuthedUser({
                    email: variables.email
                });
            } else {
                onSuccessFunc(variables, data.AuthenticationResult.AccessToken);
            }
        }
    });
};

export const useSignupMutation = () => {
    const setFlashNotification = useStore((state) => state.setFlashNotification);
    const updateAuthedUser = useStore((state) => state.updateAuthedUser);

    return useMutation({
        mutationFn: (data: CognitoEmailDto) => {
            return Auth.signUp(data);
        },
        onError() {
            setFlashNotification({
                title: 'Some error occured while signing up',
                message: 'Please try again.',
                alertType: 'error'
            });
        },
        onSuccess(_, variables: CognitoEmailDto) {
            updateAuthedUser({
                email: variables.email
            });
        }
    });
};

export const useCompleteNewPasswordMutation = (
    onSuccessFunc: (data: CognitoCompleteNewPasswordDto, accessToken: string) => void,
) => {
    const setFlashNotification = useStore((state) => state.setFlashNotification);

    return useMutation({
        mutationFn: (data: CognitoCompleteNewPasswordDto) => {
            return Auth.completeNewPassword(data);
        },
        onError() {
            setFlashNotification({
                title: 'Some error occured while setting your account and new password',
                message: 'Please check your details and try again.',
                alertType: 'error'
            });
        },
        onSuccess(data: AdminInitiateAuthResponse, variables) {
            onSuccessFunc(variables, data.AuthenticationResult.AccessToken);
        }
    });
};

export const useResendConfirmationMutation = (onMutateFunc: (isEnabled: boolean) => void) => {
    const setFlashNotification = useStore((state) => state.setFlashNotification);

    return useMutation({
        mutationFn: (email: string) => {
            return Auth.resendConfirmation(email);
        },
        onMutate() {
            onMutateFunc(true);
        },
        onError() {
            onMutateFunc(false);
            setFlashNotification({
                title: 'Some error occured while sending the OTP',
                message: 'Please try again.',
                alertType: 'error'
            });
        }, onSuccess() {
            setFlashNotification({
                title: 'New OTP has been sent to your email address',
                message: 'Please check your inbox and enter the code to continue.',
                alertType: 'success'
            });
        }
    });
};

export const useSignupConfirmMutation = () => {
    const setFlashNotification = useStore((state) => state.setFlashNotification);

    return useMutation({
        mutationFn: (params: CognitoConfirmCodeDto) => {
            return Auth.confirmSignup(params);
        },
        onError() {
            setFlashNotification({
                title: 'An error occured while confirming your account',
                message: 'Please try again.',
                alertType: 'error'
            });
        }, onSuccess() {
            setFlashNotification({
                title: 'Success! Your account has been confirmed.',
                message: 'Kindly login to continue.',
                alertType: 'success'
            });
        }
    });
};

export const useForgotPasswordMutation = () => {
    const router = useRouter();
    const setFlashNotification = useStore((state) => state.setFlashNotification);

    return useMutation({
        mutationFn: (params: CognitoEmailDto) => {
            return Auth.forgotPassword(params);
        },
        onError(error: ResponseError) {
            if (error.response?.status === 401) {
                return;
            }

            setFlashNotification({
                title: 'Something went wrong',
                message: 'Please check your details and try again.',
                alertType: 'error'
            });
        }, onSuccess(_, data: CognitoEmailDto) {
            router.push(`/auth/set-new-password?email=${data.email}`);

            setFlashNotification({
                title: 'The verification code has been sent to your email address',
                message: 'Please check your inbox and enter the code to continue.',
                alertType: 'success'
            });
        }
    });
};

export const useConfirmPasswordChangeMutation = () => {
    const router = useRouter();
    const setFlashNotification = useStore((state) => state.setFlashNotification);

    return useMutation({
        mutationFn: (params: CognitoForgotPasswordDto) => {
            return Auth.confirmPasswordChange(params);
        },
        onError(err: ResponseError) {
            // if (err.code === 'CodeMismatchException') {
            //     setError({
            //         email: 'The verification code you entered is incorrect. Please check the code and try again.'
            //     });

            //     return;
            // }

            setFlashNotification({
                title: 'Failed to set new password',
                message: err.response.data.message,
                alertType: 'error',
                duration: 4000
            });
        }, onSuccess() {
            router.push('/auth/login');

            setFlashNotification({
                title: 'Successfully set new password',
                message: 'Please login using your new password.',
                alertType: 'success'
            });
        }
    });
};