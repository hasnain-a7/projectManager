import React from "react";
import SignIn from "../Components/SignIn";

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Welcome back </h2>
        <SignIn />
      </div>
    </div>
  );
};

export default LoginPage;
