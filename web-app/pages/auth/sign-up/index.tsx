import { useSignupMutation } from '@data-access/hooks';
import { Button, Form, Typography } from '@ui';
import AuthenticationLayout from '@web-app/components/layouts/authentication/authentication';
import PrimaryLayout from '@web-app/components/layouts/primary-layout/primary-layout';
import { ROUTES } from '@web-app/config/constants';
import { schema, structure } from '@web-app/config/formStructure/signupStructure';
import { NextPageWithLayout } from '@web-app/types/pages';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.module.scss';

/* eslint-disable-next-line */
export interface SignUpProps { }

export const SignUp: NextPageWithLayout<SignUpProps> = () => {
    const router = useRouter();

    const [error, setError] = useState<{ [key: string]: string }>(null);

    const signUpMutation = useSignupMutation();

    useEffect(() => {
        if (signUpMutation.status === 'success') {
            router.push(ROUTES.AUTH_ENTER_OTP);
        }
    }, [signUpMutation.status]);

    const handleSignIn = useCallback(async (data: { email: string, password: string }) => {
        signUpMutation.mutate(data);
    }, []);

    return (
        <>
            <Typography >
                Sign Up
            </Typography>
            <Typography className='mb-14'>
                Please enter your details to continue
            </Typography>

            <Form
                structure={structure}
                schema={schema}
                onSubmitForm={handleSignIn}
                isProcessing={signUpMutation.isLoading}
                data={{ email: '', password: '' }}
                resetResultError={() => setError(null)}
                resultError={error} />

            <hr className={styles.divider} data-content='OR' />

            <div className='space-y-5'>
                <Button
                    label='Signin with Apple'
                    className='w-full'
                    disabled={signUpMutation.isLoading} />
                <Button
                    label='Signin with Google'
                    disabled={signUpMutation.isLoading}
                    className='w-full' />
            </div>
        </>
    );
};

export default SignUp;

SignUp.getLayout = (page) => {
    return (
        <PrimaryLayout title='Sign Up'>
            <AuthenticationLayout>
                {page}
            </AuthenticationLayout>
        </PrimaryLayout>
    );
};
