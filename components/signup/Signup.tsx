"use client";

import { useState, FormEvent } from "react";
import { z } from "zod";
import { graphql } from "@/gql";
import { useMutation } from "urql";
import { Card, CardContent } from "@/components/ui/card";
import { SignupSuccess } from "./SignupSuccess";
import { SignupForm } from "./SignupForm";
import Link from "next/link";

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const signUpMutationDocument = graphql(/* GraphQL */ `
  mutation signUp($input: SignUpUserInput!) {
    signUp(input: $input)
  }
`);

export function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [{ fetching }, executeMutation] = useMutation(signUpMutationDocument);

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
          setSuccess(true);
        }
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <SignupSuccess />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Go back
        </Link>
      </div>
      <Card className="w-full max-w-lg shadow-xl border-opacity-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl">
        <CardContent className="p-0">
          <SignupForm
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
