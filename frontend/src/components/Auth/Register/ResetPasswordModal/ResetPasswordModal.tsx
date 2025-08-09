import useMultipleStepForm from "../../../../hooks/use-multiple-step-form";
import ChangePassword from "./Steps/ChangePassword";
import ResetPasswordRequest from "./Steps/ResetPasswordRequest";
import VerifyResetPasswordCode from "./Steps/VerifyResetPasswordCode";
import styles from './ResetPasswordModal.module.scss';
import { useState } from "react";

const ResetPasswordModal = ({ closeModal }: { closeModal: () => void }) => {

  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [resetPasswordToken, setResetPasswordToken] = useState('');

  const handleNext = () => next();

  const { next, step } = useMultipleStepForm([
    <ResetPasswordRequest
      resetPasswordEmail={resetPasswordEmail}
      setResetPasswordEmail={setResetPasswordEmail}
      next={handleNext}
    />,
    <VerifyResetPasswordCode
      setResetPasswordToken={setResetPasswordToken}
      resetPasswordEmail={resetPasswordEmail}
      next={handleNext}
    />,
    <ChangePassword
      closeModal={closeModal}
      resetPasswordEmail={resetPasswordEmail}
      resetPasswordToken={resetPasswordToken}
    />,
  ]);

  return <div className={styles.reset_password_request_modal_content}>{step}</div>;
};

export default ResetPasswordModal;
