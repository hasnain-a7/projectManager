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

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { setUserId, userContextId } = useUserContextId();
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
          console.log("✅ Logged in:", userContextId);
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

  const handleloginchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <Card className="w-[90%] max-w-sm shadow-lg ">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Welcome </CardTitle>
        <CardDescription className="text-center mb-2">
          Enter your email to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-2">
          <div className="grid gap-1">
            <Input
              type="email"
              id="email"
              value={email}
              onChange={handleloginchange}
              placeholder="johndoe@mail.com"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-3 mb-2">
            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full cursor-pointer"
            >
              {loading ? "Processing..." : "Login"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignIn;
