import { Dispatch, FormEvent, SetStateAction } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleLogin from "../googleLogin/GoogleLogin";
import { LogoLink } from "@/components/ui/logo-link";

interface LoginFormProps {
  formData: {
    email: string;
    password: string;
  };
  setFormData: Dispatch<
    SetStateAction<{
      email: string;
      password: string;
    }>
  >;
  error: string | null;
  fetching: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function LoginForm({
  formData,
  setFormData,
  error,
  fetching,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-6">
          <LogoLink />
          <div>
            <h1 className="text-2xl font-bold tracking-tight gradient-text">
              Welcome back
            </h1>
            <p className="text-balance text-muted-foreground mt-2">
              Enter your credentials to access your account
            </p>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-2 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-3 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={fetching}
          className="px-8 gradient-button"
        >
          {fetching ? "Signing in..." : "Sign in"}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <GoogleLogin />
      </div>
    </form>
  );
}
