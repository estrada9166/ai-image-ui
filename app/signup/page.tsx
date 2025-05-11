"use client";

import RedirectIfUser from "@/components/redirectIfUser/RedirectIfUser";
import { Signup } from "@/components/signup/Signup";

export default function Page() {
  return (
    <RedirectIfUser>
      <div className="flex h-screen w-full items-center justify-center px-4">
        <Signup />
      </div>
    </RedirectIfUser>
  );
}
