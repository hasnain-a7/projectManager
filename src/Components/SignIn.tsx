import React, { useState, useEffect } from "react";
import { auth } from "../Config/firbase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useUserContextId } from "../AuthContext/UserContext";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { setUserId } = useUserContextId();
  const dummyPassword = "123456";
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser && currentUser.email) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        dummyPassword
      );

      console.log("✅ New user created:", userCredential.user.uid);
      setUserId(userCredential.user.uid);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        try {
          const userCredentialLogin = await signInWithEmailAndPassword(
            auth,
            email,
            dummyPassword
          );
          setUserId(userCredentialLogin.user.uid);

          console.log("✅ Logged in:", userCredentialLogin.user.uid);
        } catch (loginError: any) {
          console.error("❌ Login error:", loginError.message);
          alert(`Login failed: ${loginError.message}`);
        }
      } else {
        console.error("❌ Signup error:", error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleNavigtion = () => {
    navigate("/");
  };
  if (user && user.email) {
    return (
      <div className="login-box">
        <p>✅ You're signed in as {user.email}</p>
        <button onClick={handleNavigtion}>Go to Home</button>
      </div>
    );
  }
  const handleloginchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="flex flex-col items-center gap-4 ">
      <form
        onSubmit={handleLoginSubmit}
        className="w-full flex flex-col items-center gap-4"
      >
        <div className="w-full">
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleloginchange}
            placeholder="Enter your email"
            required
            disabled={loading}
            className="w-full px-4 py-2 border-none text-[#B6C2CF] rounded-lg text-base bg-[#1D2125] outline-none placeholder:text-[#B6C2CF]"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 cursor-pointer ${
            loading || !email.trim()
              ? "bg-gray-400 text-black cursor-not-allowed"
              : "bg-[#1a202c] hover:bg-gray-700"
          }`}
        >
          {loading ? "Processing" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
