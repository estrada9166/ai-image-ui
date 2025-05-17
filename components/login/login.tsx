"use client";

import { useState, FormEvent } from "react";
import { z } from "zod";
import { graphql } from "@/gql";
import { useMutation } from "urql";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "./LoginForm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signInMutationDocument = graphql(/* GraphQL */ `
  mutation signIn($input: SignInUserInput!) {
    signIn(input: $input) {
      id
      email
      fullName
    }
  }
`);

export function Login() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [{ fetching }, executeMutation] = useMutation(signInMutationDocument);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const validatedFields = schema.parse(formData);

      executeMutation({
        input: validatedFields,
      }).then((result) => {
        if (result.error) {
          setError(result.error.graphQLErrors[0].message);
        } else {
          router.push("/dashboard");
        }
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(t("login.unexpectedError"));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← {t("login.goBack")}
        </Link>
      </div>
      <Card className="w-full max-w-lg shadow-xl border-opacity-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl">
        <CardContent className="p-0">
          <LoginForm
            formData={formData}
            setFormData={setFormData}
            error={error}
            fetching={fetching}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
