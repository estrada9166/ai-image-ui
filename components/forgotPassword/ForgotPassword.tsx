"use client";

import { useState, FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, CheckCircle2 } from "lucide-react";
import { graphql } from "@/gql";
import { useMutation } from "urql";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const forgotPasswordMutationDocument = graphql(/* GraphQL */ `
  mutation forgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input)
  }
`);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [{ fetching }, executeMutation] = useMutation(
    forgotPasswordMutationDocument
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const validatedFields = schema.parse({ email });

      const result = await executeMutation({
        input: { email: validatedFields.email },
      });

      if (result.error) {
        setError("An unexpected error occurred. Please try again.");
      } else {
        setSuccess(true);
      }
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg border-opacity-40">
          <CardHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-center mt-4">
              Check your email
            </CardTitle>
            <CardDescription className="text-center">
              If an account exists for that email, we&apos;ve sent you a
              password reset link. Please check your inbox and follow the
              instructions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mt-4 bg-violet-50 border-violet-200">
              <AlertTitle className="text-violet-800">Next steps</AlertTitle>
              <AlertDescription className="text-violet-700">
                1. Check your email inbox (and spam folder)
                <br />
                2. Click the password reset link in the email
                <br />
                3. Create your new password
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg border-opacity-40">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Reset your password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we&apos;ll send you instructions to
            reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
                  {error}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={fetching}>
              {fetching ? "Sending link..." : "Send reset link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
