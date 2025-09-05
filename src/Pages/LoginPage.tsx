import React from "react";
import SignIn from "../Components/SignIn";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#59448A] to-[#884C85] font-sans">
      <div className="bg-gradient bg-transparent border text-white from-[#59448A] to-[#884C85] p-10 rounded-xl shadow-lg w-80 text-center">
        <h2 className="text-2xl font-semibold  text-[#101204] mb-6">
          Welcome back
        </h2>
        <SignIn />
      </div>
    </div>
  );
};

export default LoginPage;
