// eslint-disable-next-line @nx/enforce-module-boundaries
import { useConfirmPasswordChangeMutation, useResendConfirmationMutation } from '@data-access/hooks';
import { CognitoForgotPasswordDto } from '@dto';
import { Form, Typography } from '@ui';
import AuthenticationLayout from '@web-app/components/layouts/authentication/authentication';
import PrimaryLayout from '@web-app/components/layouts/primary-layout/primary-layout';
import { schema, structure } from '@web-app/config/formStructure/setNewPassword';
import { useCountdown } from '@web-app/hooks/useCountdown';
import { NextPageWithLayout } from '@web-app/types/pages';
import { useRouter } from 'next/router';
import { useState } from 'react';

/* eslint-disable-next-line */
export interface SetNewPasswordProps { }

export const SetNewPassword: NextPageWithLayout<SetNewPasswordProps> = () => {
    const router = useRouter();

    const { countdown, enableCounting, isCounting } = useCountdown();

    // mutation hooks
    const resendCodeMutation = useResendConfirmationMutation(enableCounting);
    const confirmPasswordMutation = useConfirmPasswordChangeMutation();

    const [error, setError] = useState<{ [key: string]: string }>(null);

    const handleSubmit = async (data: { [key: string]: string }) => {
        confirmPasswordMutation.mutate({
            email: router.query.email as string,
            password: data.password,
            code: data.verificationCode
        } as CognitoForgotPasswordDto);
    };

    // const handleRequestNew = async () => {
    //     enableCounting(true);

    //     try {
    //         await Cognito.resendConfirmationCode(router.query.email as string);

    //         setFlashNotification({
    //             title: 'New verification code has been sent to your email address',
    //             message: 'Please check your inbox and enter the code to continue.',
    //             alertType: 'success'
    //         });
    //     } catch (err) {
    //         setFlashNotification({
    //             title: 'Failed to resend verification code',
    //             message: 'Please try again.',
    //             alertType: 'error'
    //         });
    //     }
    // };

    // prevent user from requesting new code while request is still processing
    const handleRequestNew = async () => {
        // prevent request if account is being verified
        if (confirmPasswordMutation) return;
        enableCounting(true);

        resendCodeMutation.mutate(router.query.email as string);
    };

    structure[0].fields[0][0]['extra'] = <div className='flex flex-row items-center'>
        <Typography className='p-1'>{'Didn’t receive a code?'}</Typography>
        <Typography className='w-12'>
            {isCounting
                ? countdown
                : <span onClick={handleRequestNew} className='cursor-pointer font-semibold text-B600'>
                    Resend
                </span>
            }
        </Typography>
    </div>;

    return (
        <>
            <div className='flex flex-col gap-3'>
                <Typography family='font-montserrat' size='text-2xl' fontWeight='font-bold' color='text-N900'>
                    Check your email
                </Typography>
                <Typography size='text-lg' color='text-N700'>
                    We sent you a verification code to reset your password
                </Typography>
            </div>

            <Form
                structure={structure}
                schema={schema}
                onSubmitForm={handleSubmit}
                isProcessing={confirmPasswordMutation.isLoading}
                submitLabel='Reset Password'
                resultError={error}
                resetResultError={() => setError(null)}
                data={{ confirmPassword: '', password: '' }} />
        </>
    );
};

export default SetNewPassword;

SetNewPassword.getLayout = (page) => {
    return (
        <PrimaryLayout title='Set New Password'>
            <AuthenticationLayout>
                {page}
            </AuthenticationLayout>
        </PrimaryLayout>
    );
};