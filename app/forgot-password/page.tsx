"use client";

import ForgotPassword from "@/components/forgotPassword/ForgotPassword";
import RedirectIfUser from "@/components/redirectIfUser/RedirectIfUser";

export default function ForgotPasswordPage() {
  return (
    <RedirectIfUser>
      <ForgotPassword />
    </RedirectIfUser>
  );
}
