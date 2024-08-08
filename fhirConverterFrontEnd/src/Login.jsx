import React, {useEffect} from 'react';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script';
import "./Login.css"
import googleLogo from './assets/googleLogoGif.gif'

const CLIENT_ID = import.meta.env.VITE_APP_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/devstorage.read_write';

const GoogleSignInButton = () => {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES,
      });
    }

    gapi.load('client:auth2', start);
  }, []);


  const navigate = useNavigate();

  const onSuccessHandler = (response) => {
    console.log("Success! Access token:", response.accessToken);
    const accessToken = response.accessToken;
    localStorage.setItem("accessToken", accessToken);
    navigate("/convertPage");
  };

  const onFailureHandler = (error) => {
    console.error("Google sign-in failed:", error);
  };

  return (
    <div className = "loginWrapper">
      <img src = {googleLogo} className = "googleLogo"></img>
      <div className = "linebreak"></div>
      <GoogleLogin
        buttonText="Sign in with Google"
        onSuccess={onSuccessHandler}
        onFailure={onFailureHandler} // Add onFailure handler
        cookiePolicy={'single_host_origin'}
        className = "loginButton"
      />
    </div>
  );
};

export default GoogleSignInButton;
