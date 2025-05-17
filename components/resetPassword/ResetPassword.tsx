"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { graphql } from "@/gql";
import { useMutation } from "urql";
import { useTranslation } from "react-i18next";

export const resetPasswordMutationDocument = graphql(/* GraphQL */ `
  mutation resetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`);

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [{ fetching }, executeMutation] = useMutation(
    resetPasswordMutationDocument
  );

  const schema = z.object({
    password: z
      .string()
      .min(8, t("resetPassword.passwordMinLength"))
      .regex(/[A-Z]/, t("resetPassword.passwordUppercase"))
      .regex(/[a-z]/, t("resetPassword.passwordLowercase"))
      .regex(/[0-9]/, t("resetPassword.passwordNumber"))
      .regex(/[^A-Za-z0-9]/, t("resetPassword.passwordSpecialCharacter")),
    hash: z.string(),
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const validatedFields = schema.parse({
        password,
        hash: searchParams.get("hash") as string,
      });

      const result = await executeMutation({
        input: {
          password: validatedFields.password,
          hash: validatedFields.hash,
        },
      });

      if (result.error) {
        setError(t("resetPassword.unexpectedError"));
      } else if (result.data?.resetPassword) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(t("resetPassword.unexpectedError"));
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        if (!searchParams.get("hash")) {
          setError(t("resetPassword.invalidOrExpiredLink"));
        } else {
          setError(err.errors[0].message);
        }
      } else {
        setError(t("resetPassword.unexpectedError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg border-opacity-40">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t("resetPassword.resetYourPassword")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("resetPassword.peaseChooseStrongPassword")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                {t("resetPassword.newPassword")}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t("resetPassword.enterYourNewPassword")}
                  required
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={success}
                />
              </div>
              <div className="text-sm text-muted-foreground space-y-1 mt-2">
                <p>{t("resetPassword.passwordMustContain")}</p>
                <ul className="list-disc list-inside pl-2 space-y-1">
                  <li>{t("resetPassword.atLeast8Characters")}</li>
                  <li>{t("resetPassword.oneUppercaseLetter")}</li>
                  <li>{t("resetPassword.oneLowercaseLetter")}</li>
                  <li>{t("resetPassword.oneNumber")}</li>
                  <li>{t("resetPassword.oneSpecialCharacter")}</li>
                </ul>
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || success}
            >
              {isSubmitting || fetching
                ? t("resetPassword.resettingPassword")
                : t("resetPassword.resetPassword")}
            </Button>
          </form>
        </CardContent>
        {(error || success) && (
          <CardFooter className="pt-4">
            {error && (
              <Alert variant="destructive" className="w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("resetPassword.error")}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="w-full bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>{t("resetPassword.success")}</AlertTitle>
                <AlertDescription>
                  {t("resetPassword.yourPasswordHasBeenReset")}
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
