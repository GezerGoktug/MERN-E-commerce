import { useState } from "react";
import Login from "../components/Auth/Login/Login";
import Register from "../components/Auth/Register/Register";
import { Helmet } from "react-helmet";

const Auth = () => {
  const [form, setForm] = useState<boolean>(false);

  return (
    <div>
      <Helmet>
        <title>{form ? "Login" : "Register"} - Forever</title>
      </Helmet>
      {form ? (
        <Login chanceForm={() => setForm(false)} />
      ) : (
        <Register chanceForm={() => setForm(true)} />
      )}
    </div>
  );
};

export default Auth;
