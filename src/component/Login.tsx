import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { sign } from "crypto";
import React from "react";
import { useNavigate } from "react-router-dom";

type LoginProps = {
  signInSuccessUrl: string | undefined;
  signupUrl: string | undefined;
  signInFailureUrl: string | undefined;
};

function setCookie(key: String, value: String, expiration: number) {
  let today = new Date();
  today.setDate(today.getDate() + expiration);
  document.cookie = `${key}=${value}; path=/; expires=${today.toUTCString}; SameSite=None; Secure`;
}

const Login = (props: LoginProps) => {
  const host = "http://15.165.25.19:8080";
  // const host = "http://localhost:8080";
  const clientId = "599467764330-imh8k96aer7kbghf1432dd4vjnj9814j.apps.googleusercontent.com";
  const navigate = useNavigate();
  const onSuccess = async (res: CredentialResponse) => {
    const token = res.credential;
    axios.defaults.withCredentials = true;
    const signInRes = await axios
      .post(`${host}/sign-in`, {
        token: token,
      })
      .then((res) => res.headers["authorization"])
      .catch((err) => console.log(err));
    console.log(signInRes);
    if (signInRes) window.localStorage.setItem("Authorization", signInRes);
    const state = await axios
      .get(`${host}/login-info`, {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
      })
      .then((res) => res.data.body)
      .catch((err) => console.log(err));
    console.log(state);
    if (state == "USER") {
      if (props.signInSuccessUrl) navigate(props.signInSuccessUrl);
    } else if (state == "LIMITED") {
      console.log(props.signupUrl);
      if (props.signupUrl) navigate(props.signupUrl);
    } else {
      if (props.signInFailureUrl) navigate(props.signInFailureUrl);
    }
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
