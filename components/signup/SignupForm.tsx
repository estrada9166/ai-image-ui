import { Dispatch, FormEvent, SetStateAction } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleLogin from "../googleLogin/GoogleLogin";
import { LogoLink } from "@/components/ui/logo-link";
import { useTranslation } from "react-i18next";

interface SignupFormProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
  };
  setFormData: Dispatch<
    SetStateAction<{
      fullName: string;
      email: string;
      password: string;
    }>
  >;
  error: string | null;
  fetching: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function SignupForm({
  formData,
  setFormData,
  error,
  fetching,
  onSubmit,
}: SignupFormProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-6">
          <LogoLink />
          <div>
            <h1 className="text-2xl font-bold tracking-tight gradient-text">
              {t("signup.createAnAccount")}
            </h1>
            <p className="text-balance text-muted-foreground mt-2">
              {t("signup.enterYourDetailsBelowToCreateAnAccount")}
            </p>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="fullName">{t("signup.fullName")}</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">{t("signup.email")}</Label>
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
          <Label htmlFor="password">{t("signup.password")}</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
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
          {fetching ? t("signup.creatingAccount") : t("signup.createAccount")}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            {t("signup.orContinueWith")}
          </span>
        </div>

        <GoogleLogin />

        <div className="text-center text-sm">
          {t("signup.alreadyHaveAnAccount")}
          <Link href="/login" className="underline underline-offset-4">
            {t("signup.signIn")}
          </Link>
        </div>
      </div>
    </form>
  );
}
