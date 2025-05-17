"use client";

import { Login } from "@/components/login/login";
import RedirectIfUser from "@/components/redirectIfUser/RedirectIfUser";

export default function Page() {
  return (
    <RedirectIfUser>
      <Login />
    </RedirectIfUser>
  );
}
