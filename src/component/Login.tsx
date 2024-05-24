import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import React from "react";

const Login = () => {
  const clientId = "599467764330-imh8k96aer7kbghf1432dd4vjnj9814j.apps.googleusercontent.com";

  const onSuccess = async (res: CredentialResponse) => {
    const token = res.credential;
    console.log(token);
    axios.defaults.withCredentials = true;
    const loginResponse = await axios
      .post("http://localhost:8080/sign-in", {
        token: token,
      })
      .then((res) => res.data)
      .catch((err) => console.log(err));
    console.log(loginResponse);
    //window.location.href = "http://localhost:3000";
  };

  const onError = () => {};

  return (
    <div>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin onSuccess={onSuccess} onError={onError} />
      </GoogleOAuthProvider>
    </div>
  );
};

export default Login;
