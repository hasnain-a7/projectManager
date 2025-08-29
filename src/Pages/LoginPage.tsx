import React from "react";
import SignIn from "../Components/SignIn";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 font-sans">
      <div className="bg-gray-200 p-10 rounded-xl shadow-lg w-80 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Welcome back
        </h2>
        <SignIn />
      </div>
    </div>
  );
};

export default LoginPage;
