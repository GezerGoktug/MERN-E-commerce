import { useMutation } from "@tanstack/react-query";
import Button from "../../../../ui/Button/Button"
import Input from "../../../../ui/Input/Input"
import api from "../../../../../utils/api";
import toast from "react-hot-toast";


const ResetPasswordRequest = ({
  next,
  setResetPasswordEmail,
  resetPasswordEmail
}: {
  next: () => void,
  setResetPasswordEmail: React.Dispatch<string>,
  resetPasswordEmail: string
}) => {
  
  const mutation = useMutation({
    mutationFn: () => {
      return api.get(`/user/reset-password-req?resetPasswordEmail=${resetPasswordEmail}`);
    },
    onSuccess: (data) => {
      toast.success(data.data.message);
      next()
    },
    onError: (error) => {
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
    }
  });

  const handleResetPasswordRequest = () => {
    mutation.mutate();
  }

  return (
    <>
      <h6>Reset Password Request</h6>
      <p>You can send reset password request code to your email account with fill your email from below</p>
      <Input
        placeholder="Your Email"
        size="lg"
        type="email"
        onChange={(e) => {
            setResetPasswordEmail(e.target.value)          
        }}
      />
      <Button
        loading={mutation.isPending}
        onClick={() => handleResetPasswordRequest()}>
        SEND REQUEST
      </Button>


    </>
  )
}

export default ResetPasswordRequest