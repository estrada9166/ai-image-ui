"use client";

import { Login } from "@/components/login/login";
import RedirectIfUser from "@/components/redirectIfUser/RedirectIfUser";

export default function Page() {
  return (
    <RedirectIfUser>
      <div className="flex h-screen w-full items-center justify-center px-4">
        <Login />
      </div>
    </RedirectIfUser>
  );
}
