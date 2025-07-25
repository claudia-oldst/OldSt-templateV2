import { useResendConfirmationMutation, useSignupConfirmMutation } from '@data-access/hooks';
import { useStore } from '@data-access/state-management';
import { Button, Typography } from '@ui';
import { maskedEmail } from '@utils';
import { ROUTES } from '@web-app/config/constants';
import { useCountdown } from '@web-app/hooks/useCountdown';
// import { setFlashNotification } from '@web-app/stateManagement/modules/flashNotification';
import clsx from 'classnames';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

/* eslint-disable-next-line */
export interface EnterOTPProps { }

let currentOTPIndex = 0;

export function EnterOTP(props: EnterOTPProps) {
    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);

    const authedUser = useStore((state) => state.authedUser);

    const { countdown, enableCounting, isCounting } = useCountdown();

    // mutation hooks
    const resendCodeMutation = useResendConfirmationMutation(enableCounting);
    const confirmSignupMutation = useSignupConfirmMutation();

    const [isError, setIsError] = useState<boolean>(false);
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);

    useEffect(() => {
        inputRef.current?.focus();
        setIsError(false);
    }, [activeOTPIndex]);

    const handleOnChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const { value } = target;
        const newOtp: string[] = [...otp];
        const val = value.substring(value.length - 1);

        // check if value entered is number
        // prevent setting of otp if value is e.+
        const isNumber = /[0-9]/.test(val);

        newOtp[currentOTPIndex] = isNumber ? val : '';

        setActiveOTPIndex(!val ? currentOTPIndex - 1 : isNumber ? currentOTPIndex + 1 : currentOTPIndex);
        setOtp(newOtp);
    };

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        currentOTPIndex = index;

        if (e.key === 'Backspace') {
            setActiveOTPIndex(currentOTPIndex - 1);
        }
    };

    useEffect(() => {
        if (confirmSignupMutation.status === 'success') {
            router.replace(ROUTES.AUTH_LOGIN);
        }
    }, [confirmSignupMutation.status]);

    const handleVerify = () => {
        if (otp.includes('')) {
            setIsError(true);

            return;
        }

        confirmSignupMutation.mutate({
            email: authedUser.email as string,
            code: otp.join('')
        });
    };

    // prevent user from requesting new code while request is still processing
    const handleRequestNew = async () => {
        // prevent request if account is being verified
        if (confirmSignupMutation) return;

        resendCodeMutation.mutate(authedUser.email as string);
    };

    return (
        <div className='flex justify-center items-center h-screen w-screen overflow-auto scrollbar-hide'>
            <div className='w-[28rem] pb-3 mt-10'>
                <Typography
                    className='text-center mt-14'>
                    Confirm your account
                </Typography>
                <Typography
                    className='mb-14 text-center'>
                    We have sent a code by email to {maskedEmail(authedUser.email)}. Enter it below to confirm your account.
                </Typography>

                <div className='flex flex-row gap-4 justify-center'>
                    {otp.map((_, index) =>
                        <input
                            key={index}
                            ref={activeOTPIndex === index ? inputRef : null}
                            type='phone'
                            className={clsx(
                                'spin-button-none', 'border', 'border-ui-04', 'focus:border-primary',
                                'h-20', 'w-[3.8687rem]', 'text-3xl', 'text-center', 'outline-none', 'transition',
                                { 'border-primary': !!otp[index] && !isError, 'border-support-error': isError }
                            )}
                            disabled={confirmSignupMutation.isLoading}
                            onChange={handleOnChange}
                            onKeyDown={(e) => handleOnKeyDown(e, index)}
                            value={otp[index]} />
                    )}
                </div>

                <Button
                    label='verify'
                    className='mt-[4.5rem] w-full'
                    isProcessing={confirmSignupMutation.isLoading}
                    onClick={handleVerify} />

                <div className='flex flex-row justify-center items-center mt-14'>
                    <Typography className='p-1'>{'Didn’t receive a code?'}</Typography>
                    <Typography className='w-12'>
                        {isCounting
                            ? countdown
                            : <span onClick={handleRequestNew} className='cursor-pointer'>
                                Resend
                            </span>
                        }
                    </Typography>
                </div>
            </div>
        </div>
    );
}

export default EnterOTP;
