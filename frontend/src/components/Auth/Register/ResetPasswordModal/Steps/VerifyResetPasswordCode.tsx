import { useMutation } from "@tanstack/react-query";
import Button from "../../../../ui/Button/Button"
import toast from "react-hot-toast";
import api from "../../../../../utils/api";
import { useState } from "react";
import PinInput from "../../../../ui/PinInput/PinInput";

const VerifyResetPasswordCode = ({
  next,
  resetPasswordEmail,
  setResetPasswordToken
}: {
  next: () => void,
  resetPasswordEmail: string,
  setResetPasswordToken: React.Dispatch<string>
}) => {
  const [resetPasswordCode, setResetPasswordCode] = useState('');

  const mutation = useMutation({
    mutationFn: () => {
      const searchParams = new URLSearchParams({
        resetPasswordEmail,
        resetPasswordCode
      })
      return api.get(`/user/eval-reset-password-code?${searchParams.toString()}`);
    },
    onSuccess: (data) => {
      setResetPasswordToken(data.data.token);
      toast.success(data.data.message);
      next();
    },
    onError: (error) => {
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
    }
  });

  const handleVerifyResetPasswordCode = () => {
    mutation.mutate();
  }

  return (
    <>
      <h6>Verify Reset Password Code</h6>
      <p>You can verify with fill your code from incoming in your gmail box from below</p>
      <PinInput
        characterLength={6}
        onInputChange={(val) => setResetPasswordCode(val)}
      />
      <Button
        loading={mutation.isPending}
        onClick={() => handleVerifyResetPasswordCode()}>
        VERIFY
      </Button>
    </>
  )
}

export default VerifyResetPasswordCode