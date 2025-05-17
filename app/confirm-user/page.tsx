"use client";

import ConfirmUser from "@/components/confirmUser/ConfirmUser";
import RedirectIfUser from "@/components/redirectIfUser/RedirectIfUser";
import { Suspense } from "react";

export default function ConfirmUserPage() {
  return (
    <RedirectIfUser>
      <Suspense fallback={<div>Loading...</div>}>
        <ConfirmUser />
      </Suspense>
    </RedirectIfUser>
  );
}
