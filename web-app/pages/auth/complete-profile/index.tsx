import { useCompleteNewPasswordMutation } from '@data-access/hooks';
import { useStore } from '@data-access/state-management';
import { Form, Typography } from '@ui';
import AuthenticationLayout from '@web-app/components/layouts/authentication/authentication';
import PrimaryLayout from '@web-app/components/layouts/primary-layout/primary-layout';
import { STORAGE_KEY } from '@web-app/config/constants';
import { schema, structure } from '@web-app/config/formStructure/createAccountStructure';
import useAuth from '@web-app/hooks/useAuth';
import { NextPageWithLayout } from '@web-app/types/pages';
import Cookies from 'js-cookie';

/* eslint-disable-next-line */
export interface CompleteProfileProps { }

export const CompleteProfile: NextPageWithLayout<CompleteProfileProps> = () => {
    const { authenticationUser } = useAuth();
    const authedUser = useStore((state) => state.authedUser);

    const completeNewPasswordMutation = useCompleteNewPasswordMutation(authenticationUser);

    const handleSubmit = async (data) => {
        data['session'] = Cookies.get(STORAGE_KEY.COGNITO_SESSION);
        delete data.confirmPassword;

        completeNewPasswordMutation.mutate(data);
    };

    return (
        <>
            <Typography >
                Complete your profile
            </Typography>
            <Typography className='mb-14'>
                Please enter your details below
            </Typography>

            <Form
                structure={structure}
                schema={schema}
                onSubmitForm={handleSubmit}
                isProcessing={completeNewPasswordMutation.isLoading}
                data={{
                    email: authedUser.email,
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: ''
                }} />
        </>
    );
};

export default CompleteProfile;

CompleteProfile.getLayout = (page) => {
    return (
        <PrimaryLayout title='Complete Your Profile'>
            <AuthenticationLayout>
                {page}
            </AuthenticationLayout>
        </PrimaryLayout>
    );
};