"use client";

import ResetPasswordForm from "@/components/resetPassword/ResetPassword";
import RedirectIfUser from "@/components/redirectIfUser/RedirectIfUser";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <RedirectIfUser>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </RedirectIfUser>
  );
}
