import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { LogoLink } from "@/components/ui/logo-link";

export function SignupSuccess() {
  return (
    <Card className="w-full max-w-sm shadow-2xl border-opacity-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg">
      <CardHeader className="space-y-6 text-center">
        <LogoLink />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Check your email
          </CardTitle>
          <CardDescription className="text-balance">
            We&apos;ve sent you an email with a confirmation link. Please check
            your inbox and click the link to activate your account.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Alert className="mt-4 bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/50 dark:to-violet-800/50 border-violet-200 dark:border-violet-700">
          <AlertTitle className="text-violet-800 dark:text-violet-200 font-semibold">
            Next steps
          </AlertTitle>
          <AlertDescription className="text-violet-700 dark:text-violet-300 mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-200 dark:bg-violet-700 text-violet-700 dark:text-violet-200 text-sm font-medium">
                1
              </div>
              <span>Check your email inbox (and spam folder)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-200 dark:bg-violet-700 text-violet-700 dark:text-violet-200 text-sm font-medium">
                2
              </div>
              <span>Click the confirmation link in the email</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-200 dark:bg-violet-700 text-violet-700 dark:text-violet-200 text-sm font-medium">
                3
              </div>
              <span>Once confirmed, you can log in to your account</span>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
