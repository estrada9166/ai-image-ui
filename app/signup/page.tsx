"use client";

import RedirectIfUser from "@/components/redirectIfUser/RedirectIfUser";
import { Signup } from "@/components/signup/Signup";

export default function Page() {
  return (
    <RedirectIfUser>
      <Signup />
    </RedirectIfUser>
  );
}
