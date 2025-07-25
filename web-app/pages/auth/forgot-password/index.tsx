// import { checkIfEmailExisit } from "@web-app/api/user";
import { useForgotPasswordMutation } from '@data-access/hooks';
import { ResponseError } from '@data-access/types/responseError';
import { CognitoEmailDto } from '@dto';
import { Form, Typography } from '@ui';
import AuthenticationLayout from '@web-app/components/layouts/authentication/authentication';
import PrimaryLayout from '@web-app/components/layouts/primary-layout/primary-layout';
import { schema, structure } from '@web-app/config/formStructure/forgotPasswordStructure';
import { NextPageWithLayout } from '@web-app/types/pages';
import { useEffect, useState } from 'react';

export const ForgotPassword: NextPageWithLayout = () => {
    const [error, setError] = useState<{ [key: string]: string }>(null);

    const forgotPasswordMutation = useForgotPasswordMutation();

    useEffect(() => {
        if ((forgotPasswordMutation.error as ResponseError)?.response?.status === 401) {
            setError({
                email: 'We could not find any account with this email address. Please check your details and try again.'
            });
        }
    }, [(forgotPasswordMutation.error as ResponseError)?.response?.status]);

    const handleSubmit = async (data: CognitoEmailDto) => {
        forgotPasswordMutation.mutate(data);
    };

    return (
        <>
            <div className='flex flex-col gap-3'>
                <Typography family='font-montserrat' size='text-2xl' fontWeight='font-bold' color='text-N900'>
                    Forgot Password
                </Typography>
                <Typography size='text-lg' color='text-N700'>
                    Enter the email associated to your account
                </Typography>
            </div>

            <Form
                structure={structure}
                schema={schema}
                data={{ email: '' }}
                onSubmitForm={handleSubmit}
                isProcessing={forgotPasswordMutation.isLoading}
                submitLabel='Continue'
                resultError={error}
                resetResultError={() => setError(null)} />
        </>
    );
};

export default ForgotPassword;

ForgotPassword.getLayout = (page) => {
    return (
        <PrimaryLayout title='Forgot Password'>
            <AuthenticationLayout>
                {page}
            </AuthenticationLayout>
        </PrimaryLayout>
    );
};