"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { auth } from "@/app/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FirebaseAuthError } from "firebase-admin/auth";
import { useUser } from "./hooks/useUser";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Home() {
  const user = useUser();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isLoading, isValid },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });
  const handleSignIn = async (data: yup.InferType<typeof schema>) => {
    try {
      const currUser = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      console.log({ currUser });
    } catch (error) {
      if (
        (error as FirebaseAuthError)?.code === "auth/user-not-found" ||
        (error as FirebaseAuthError)?.code === "auth/invalid-credential"
      ) {
        setError("email", { message: "Invalid credentials" });
      } else if ((error as FirebaseAuthError)?.code === "auth/wrong-password") {
        setError("password", { message: "Wrong password" });
      } else {
        setError("email", {
          message:
            (error as FirebaseAuthError)?.message ||
            "Failed to sign in. Please check your credentials.",
        });
      }
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center pb-12 px-4 sm:px-6 lg:px-8 bg-transparent">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur shadow-xl border-border/80">
        <CardHeader className="text-center space-y-4 pt-10">
          <div className="w-16 h-16 bg-primary/10 border border-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-primary tracking-tight">
              Competition Portal
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-10 px-8">
          {user ? (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Link
                href={user.claims.role === "admin" ? "/admin" : "/student"}
                className="w-full"
              >
                <Button className="w-full shadow-lg" size="lg">
                  {user.claims.role === "admin"
                    ? "Go to admin dashboard"
                    : "Join competition"}
                </Button>
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(handleSignIn)}
              className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pt-2"
            >
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                disabled={isLoading}
                error={touchedFields.email ? errors.email?.message : undefined}
                {...register("email")}
              />
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                disabled={isLoading}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer focus:outline-none hover:text-foreground transition-colors bg-transparent border-none p-0 flex items-center justify-center"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                }
                error={
                  touchedFields.password ? errors.password?.message : undefined
                }
                {...register("password")}
              />

              <Button
                type="submit"
                className="w-full mt-4"
                disabled={!isValid || isLoading}
                size="lg"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          )}

          <div className="mt-8 text-center text-xs text-muted-foreground pt-6 font-medium">
            {user
              ? "Requires camera & screen sharing permissions to enter"
              : "Secure authentication required for proctoring"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
