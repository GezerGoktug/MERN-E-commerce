import { Controller, useForm } from "react-hook-form";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import styles from "./Register.module.scss";
import { ErrorMessage } from "@hookform/error-message";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "@tanstack/react-query";
import api from "../../../utils/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { setUser } from "../../../store/auth/actions";
import Modal from "../../ui/Modal/Modal";
import ResetPasswordModal from "./ResetPasswordModal/ResetPasswordModal";

type RegisterProps = {
  chanceForm: () => void;
};

const schema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("İnvalid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /(?=(?:[^a-zA-Z]*[a-zA-Z]){4})/,
        "Password must contain at least 4 letters"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = ({ chanceForm }: RegisterProps) => {
  const navigate = useNavigate();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const callbackLoginGoogle = async () => {
      if (searchParams[0].get("accessToken")) {
        localStorage.setItem(
          "accessToken",
          searchParams[0].get("accessToken") as string
        );
      } else return;

      const res = await api.get("/auth/session");
      setUser(res.data.user);

      setTimeout(() => {
        navigate("/profile");
        toast.success("Login with Google succesfully");
      }, 1000);
    };
    if (
      searchParams[0].get("google_login") &&
      searchParams[0].get("accessToken")
    ) {
      callbackLoginGoogle();
    }
  }, [searchParams]);

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof schema>) => {
      return api.post("/auth/register", data);
    },
    onSuccess: (data) => {
      setUser(data.data.user);
      localStorage.setItem("accessToken", data.data.accessToken);
      toast.success(data.data.message);
      navigate("/profile");
    },
    onError(error) {
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
      if (apiError && typeof apiError === "object") {
        Object.entries(apiError).forEach(([key, value]) => {
          value.forEach((val) => {
            toast.error(`${key} : ${val}`);
          });
        });
      }
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    mutation.mutate(data);
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const ShowPasswordIcon = showPassword ? FaEye : FaEyeSlash;

  const loginWithGoogle = () => {
    window.location.href = import.meta.env.VITE_REACT_API_URL + "/auth/google";
  };

  return (
    <div className={styles.register_wrapper}>
      <Modal className={styles.reset_password_request_modal} open={modal} closeModal={() => setModal(false)}>
        <ResetPasswordModal closeModal={() => setModal(false)} />
      </Modal>
      <h5>Sign Up</h5>
      <form
        className={styles.register_form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => (
            <Input<z.infer<typeof schema>>
              size="lg"
              className={styles.register_input}
              fields={field}
              placeholder="Name"
              type="text"
            />
          )}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="name"
          render={({ message }) => (
            <p className={styles.error_message}>{message}</p>
          )}
        />
        <Controller
          control={form.control}
          name="email"
          render={({ field }) => (
            <Input<z.infer<typeof schema>>
              size="lg"
              className={styles.register_input}
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
          render={({ field }) => (
            <Input<z.infer<typeof schema>>
              size="lg"
              className={styles.register_input}
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
        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <Input<z.infer<typeof schema>>
              size="lg"
              className={styles.register_input}
              fields={field}
              placeholder="Confirm password"
              type="password"
            />
          )}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="confirmPassword"
          render={({ message }) => (
            <p className={styles.error_message}>{message}</p>
          )}
        />

        <div className={styles.register_interactions}>
          <span onClick={() => setModal(true)}>Forgot your password?</span>
          <span onClick={() => chanceForm()}>Login here</span>
        </div>
        <Button className={styles.register_btn} type="submit">
          Sign Up
        </Button>
      </form>
      <div className={styles.login_with_app_provider_section}>
        <div className={styles.or_section}>
          <div />
          <span>OR</span>
          <div />
        </div>
        <div
          onClick={() => loginWithGoogle()}
          className={styles.login_with_google_btn}
        >
          <FcGoogle size={30} />
          <span>Login with Google</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
