import toast from "react-hot-toast";
import Button from "../../../../ui/Button/Button";
import Input from "../../../../ui/Input/Input";
import { useMutation } from "@tanstack/react-query";
import api from "../../../../../utils/api";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import styles from "./ChangePassword.module.scss";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const schema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /(?=(?:[^a-zA-Z]*[a-zA-Z]){4})/,
        "Password must contain at least 4 letters"
      ),
    newPasswordConfirm: z.string().min(1, "Confirm password is required."),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ChangePassword = ({
  resetPasswordEmail,
  closeModal,
  resetPasswordToken
}: {
  resetPasswordEmail: string,
  closeModal: () => void
  resetPasswordToken: string
}) => {

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: '',
      newPasswordConfirm: ''
    }
  })

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof schema>) => {
      return api.post(`/user/reset-password`, {
        newPassword: data.newPassword,
        resetPasswordEmail
      }, {
        headers: {
          Authorization: `Bearer ${resetPasswordToken}`
        }
      });
    },
    onSuccess: (data) => {
      toast.success(data.data.message);
      closeModal();
    },
    onError: (error) => {
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
    }
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    mutation.mutate(data);
  }

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const ShowPasswordIcon = showPassword ? FaEye : FaEyeSlash;
  return (
    <>
      <h6>Change Password</h6>
      <p>You can change with fill your desire to new password from below</p>
      <form className={styles.change_password_form} onSubmit={form.handleSubmit(onSubmit)} >

        <Controller
          name="newPassword"
          control={form.control}
          render={({ field }) => (
            <>
              <Input<z.infer<typeof schema>>
                size="lg"
                fields={field}
                className={styles.change_password_input}
                rightIcon={ShowPasswordIcon}
                rightIconOnClick={() => setShowPassword(!showPassword)}
                placeholder="New Password"
                type={showPassword ? "text" : "password"}
              />
            </>
          )}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="newPassword"
          render={({ message }) => (
            <p className={styles.error_message}>{message}</p>
          )}
        />
        <Controller
          name="newPasswordConfirm"
          control={form.control}
          render={({ field }) => (
            <>
              <Input<z.infer<typeof schema>>
                size="lg"
                fields={field}
                className={styles.change_password_input}
                placeholder="New Password Confirm"
                type='password'
              />
            </>
          )}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="newPasswordConfirm"
          render={({ message }) => (
            <p className={styles.error_message}>{message}</p>
          )}
        />
        <Button
          type="submit"
          loading={form.formState.isSubmitting}
        >
          CHANGE
        </Button>
      </form>
    </>
  )
}

export default ChangePassword