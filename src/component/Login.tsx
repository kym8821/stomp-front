import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

const Login = () => {
  const clientId = '599467764330-imh8k96aer7kbghf1432dd4vjnj9814j.apps.googleusercontent.com';
  const redirectUri = 'http://localhost:3000';
  const google_token_url = `
    https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email
  `;

  const onSuccess = (res: CredentialResponse) => {
    console.log(res.credential);
  };

  const onError = () => {};

  return (
    <div>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin onSuccess={onSuccess} onError={onError} useOneTap />
      </GoogleOAuthProvider>
    </div>
  );
};

export default Login;
