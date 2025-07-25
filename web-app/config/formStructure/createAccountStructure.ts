import { FormSection } from '@ui-types/input';
import * as yup from 'yup';

export const schema = yup.object().shape({
    email: yup.string().email('Please enter a valid email address').required('Please enter a valid email address'),
    firstName: yup.string().required('Please enter your first name'),
    lastName: yup.string().required('Please enter your last name'),
    password: yup.string().required('Please enter a password')
        // eslint-disable-next-line no-useless-escape
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{8,})/, 'Your password does not meet the minimum security requirements. Please input a different password.'),
    confirmPassword: yup.string().required('Please enter a confirm password')
        .oneOf([yup.ref('password'), null], 'The passwords you entered do not match. Please try again.')
});

export const structure: FormSection[] = [{
    fields: [[
        { label: 'Email Address', placeholder: 'user@email', name: 'email', disabled: true }
    ], [
        { label: 'First Name', placeholder: ' ', name: 'firstName' }
    ], [
        { label: 'Last Name', placeholder: ' ', name: 'lastName' }
    ], [
        { label: 'Password', placeholder: '', name: 'password', inputType: 'password' }
    ], [
        { label: 'Confirm Password', placeholder: '', name: 'confirmPassword', inputType: 'password' }
    ]]
}];
