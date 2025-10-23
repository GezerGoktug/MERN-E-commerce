import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Input from "../../ui/Input/Input";
import { ErrorMessage } from "@hookform/error-message";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import Button from "../../ui/Button/Button";
import styles from "./Login.module.scss";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../../store/auth/actions";
import { useLoginMutation } from "../../../services/hooks/mutations/auth.mutations";
import Modal from "../../ui/Modal/Modal";
import ResetPasswordModal from "../Register/ResetPasswordModal/ResetPasswordModal";

type LoginProps = {
  chanceForm: () => void;
};

interface Login_Form_Types {
  email: string;
  password: string;
}

const Login = ({ chanceForm }: LoginProps) => {
  const navigate = useNavigate();
  const form = useForm<Login_Form_Types>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLoginMutation({
    onSuccess: (data) => {
      setUser(data.data.user);
      localStorage.setItem("accessToken", data.data.accessToken);
      toast.success(data.data.message);

      if (data.data.user.role === "ADMIN") {
        navigate("/admin/stats");
        return;
      }
      navigate("/profile");
    },
    onError: (error) => {
      const apiError = error?.response?.data?.error.errorMessage;


      if (typeof apiError === "string") toast.error(apiError);
    },
  })

  const onSubmit: SubmitHandler<Login_Form_Types> = (data) => mutate(data);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const ShowPasswordIcon = showPassword ? FaEye : FaEyeSlash;

  return (
    <div className={styles.login_wrapper}>
      <Modal wrapperClassName={styles.reset_password_request_modal_wrapper} open={modal} closeModal={() => setModal(false)}>
        <ResetPasswordModal closeModal={() => setModal(false)} />
      </Modal>
      <h5>Login</h5>
      <form
        className={styles.login_form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Controller
          control={form.control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <Input
              size="lg"
              className={styles.login_input}
              fields={field}
              placeholder="Email"
              type="email"
            />
          )}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="email"
          render={({ message }) => (
            <p className={styles.error_message}>{message}</p>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          rules={{ required: "Password is required" }}
          render={({ field }) => (
            <Input
              size="lg"
              className={styles.login_input}
              fields={field}
              rightIcon={ShowPasswordIcon}
              rightIconOnClick={() => setShowPassword(!showPassword)}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
            />
          )}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="password"
          render={({ message }) => (
            <p className={styles.error_message}>{message}</p>
          )}
        />

        <div className={styles.login_interactions}>
          <span onClick={() => setModal(true)}>Forgot your password?</span>
          <span onClick={() => chanceForm()}>Create account</span>
        </div>
        <Button className={styles.login_btn} type="submit" loading={isPending}>
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default Login;
