import { Link } from 'react-router-dom';
import { MainBlock } from '../components/baseui/MainBlock';
import { BeginText } from '../components/baseui/BeginText';
import { CardOne } from '../components/baseui/CustomCard';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ModalHelper } from '../components/helperui/ModalHelper';
import { isValidEmail } from '../components/validators/EmailValidator';
import { getPasswordStrength } from '../components/validators/PasswordValidator';
import { LargeSubmit } from '../components/helperui/LargeSubmitHelper';
import { FormField } from '../components/helperui/FormFieldHelper';

export default function ForgotPassword(){
    const userResetPasswordModalRef = useRef(null);
    const [modalData, setModalData] = useState(null);

    const {register, handleSubmit, reset: resetForm, watch, formState: {errors} } = useForm({
        mode:"onChange"
    })

    const onSubmit = (data) => {
        if (!isValidEmail(data.email) && (getPasswordStrength(data.password)=="Weak")){
            return;
        }
        
        // API call to send email will be here. For now, only the modal will be shown...
        setModalData(data);
        if (userResetPasswordModalRef.current) userResetPasswordModalRef.current.showModal();
        resetForm();
    }

    const typedEmail = watch("email");
    const emailValid = isValidEmail(typedEmail);
    const fieldFilled = !!typedEmail && emailValid;

    return (
        <MainBlock>
            <BeginText title={"Forgot your password?"}>
                <p>Please follow the instructions below to reset your password.</p>
            </BeginText>
            <div className='divider my-0'></div>
            <CardOne id={"resetPasswordCard"} title={"Reset Password"}>
                <form id="resetPassword" className='flex flex-col gap-3 w-full' onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                    <FormField label={"Email"} error={errors.email && errors.email.message}>
                        <input 
                            type="text" 
                            className='input input-bordered w-full'
                            {...register("email", {required:"Email is required",
                                validate: value => isValidEmail(value) || "Please enter a valid email address"
                            })}
                            autoComplete='off'
                        />
                    </FormField>
                </form>    
                <div className="flex flex-row gap-2 w-full">
                    <LargeSubmit form={"resetPassword"} size={1} disabled={!fieldFilled}>
                        Send password reset link
                    </LargeSubmit>
                </div>
            </CardOne>
            <ModalHelper id={"reset_password_modal"} reference={userResetPasswordModalRef} modalTitle={"Check your email"}>
                {modalData && (
                    <p className='py-2'>
                    If an account exists for <span className='text-info'>{modalData.email}</span>, you’ll receive an email with instructions to reset your password.
                    <br />
                    Please check your inbox and spam folder, and wait 5 minutes before attempting to reset your password again.
                    </p>
                )}
            </ModalHelper>
        </MainBlock>
    );
}