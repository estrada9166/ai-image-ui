"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { graphql } from "@/gql";
import { useMutation } from "urql";
import { useSearchParams } from "next/navigation";

export const ConfirmUserEmailMutation = graphql(/* GraphQL */ `
  mutation ConfirmUserEmail($input: ConfirmUserEmailInput!) {
    confirmUserEmail(input: $input) {
      id
    }
  }
`);

export default function UserConfirmationPage() {
  const searchParams = useSearchParams();
  const hash = searchParams.get("hash");

  const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);
  const [, confirmUserEmail] = useMutation(ConfirmUserEmailMutation);

  useEffect(() => {
    const confirmUser = async () => {
      if (!hash) {
        setIsConfirmed(false);
        return;
      }

      try {
        const result = await confirmUserEmail({
          input: {
            hash,
          },
        });

        setIsConfirmed(!!result.data?.confirmUserEmail);
      } catch (error) {
        console.error("Error confirming user:", error);
        setIsConfirmed(false);
      }
    };

    if (hash) {
      confirmUser();
    }
  }, [hash, confirmUserEmail]);

  if (isConfirmed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <p>Confirming your account...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            {isConfirmed ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
          </div>
          <CardTitle className="mt-3 text-center text-2xl font-extrabold text-gray-900">
            {isConfirmed ? "Account Confirmed!" : "Confirmation Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-gray-600">
            {isConfirmed ? (
              <>
                <p>
                  Thank you for confirming your account. Your email has been
                  successfully verified.
                </p>
                <p className="mt-2">
                  You now have full access to all features of our platform. Here
                  are some next steps you might want to take:
                </p>
                <ul className="mt-4 space-y-2 text-left list-disc list-inside">
                  <li>Create your first project</li>
                  <li>Create your first demo</li>
                </ul>
              </>
            ) : (
              <p>
                We were unable to confirm your account. The confirmation link
                may have expired or is invalid. Please try signing up again or
                contact support.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
