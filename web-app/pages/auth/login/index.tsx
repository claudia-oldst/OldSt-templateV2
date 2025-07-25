// import { checkIfEmailExisit } from '@web-app/api/user';
import { AdminInitiateAuthCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { useLoginUserMutation } from '@data-access/hooks';
import { useStore } from '@data-access/state-management';
import { Form, Typography } from '@ui';
import AuthenticationLayout from '@web-app/components/layouts/authentication/authentication';
import PrimaryLayout from '@web-app/components/layouts/primary-layout/primary-layout';
import { ROUTES, STORAGE_KEY } from '@web-app/config/constants';
import { schema, structure } from '@web-app/config/formStructure/loginStructure';
import useAuth from '@web-app/hooks/useAuth';
import { NextPageWithLayout } from '@web-app/types/pages';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

/* eslint-disable-next-line */
export interface LoginProps { }


export const Login: NextPageWithLayout<LoginProps> = () => {
    const router = useRouter();

    const { authenticationUser } = useAuth();

    const handleCompleteProfile = (data: AdminInitiateAuthCommandOutput) => {
        Cookies.set(STORAGE_KEY.COGNITO_SESSION, data.Session);
        router.push('/auth/complete-profile');
    };

    const loginUserMutation = useLoginUserMutation(authenticationUser, handleCompleteProfile);

    const clearAuthedUser = useStore((state) => state.clearAuthedUser);

    const [error, setError] = useState<{ [key: string]: string }>(null);

    useEffect(() => {
        clearAuthedUser();
    }, []);

    const handleSubmit = useCallback(async (data: { email: string, password: string }) => {
        loginUserMutation.mutate(data);
    }, []);

    return (
        <>
            <Typography >
                Welcome!
            </Typography>
            <Typography className='mb-14'>
                Please enter your details to continue
            </Typography>

            <Form
                structure={structure}
                schema={schema}
                onSubmitForm={handleSubmit}
                isProcessing={loginUserMutation.isLoading}
                data={{ email: '', password: '' }}
                resetResultError={() => setError(null)}
                resultError={error}>
                <div className='flex justify-start'>
                    <Link href={ROUTES.AUTH_FORGOT_PASSWORD}>
                        <Typography className='mb-3'>
                            Forgot Password?
                        </Typography>
                    </Link>
                </div>
            </Form>

            <div>
                <Typography className='mt-10 text-center'>
                    {'Don’t have an account? '}
                    <Typography component='span' className='underline'>
                        <Link href={ROUTES.AUTH_SIGNUP}>
                            Sign Up
                        </Link>
                    </Typography>
                </Typography>
            </div>
        </>
    );
};

export default Login;

Login.getLayout = (page) => {
    return (
        <PrimaryLayout title='Login'>
            <AuthenticationLayout>
                {page}
            </AuthenticationLayout>
        </PrimaryLayout>
    );
};
