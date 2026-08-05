import { useState } from "react";
import Login from "@/components/Auth/Login/Login";
import Register from "@/components/Auth/Register/Register";
import { Helmet } from "react-helmet";
import GoogleOauthWrapper from "@/components/Auth/GoogleOauthWrapper/GoogleOauthWrapper";

const Auth = () => {
  const [form, setForm] = useState<boolean>(true);

  return (
    <div>
      <Helmet>
        <title>{form ? "Login" : "Register"} - Forever</title>
      </Helmet>
      <GoogleOauthWrapper>
        {form ? (
          <Login chanceForm={() => setForm(false)} />
        ) : (
          <Register chanceForm={() => setForm(true)} />
        )}
      </GoogleOauthWrapper>
    </div>
  );
};

export default Auth;
