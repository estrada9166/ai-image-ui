import { Sparkles } from "lucide-react";
import Link from "next/link";

export function LogoLink({
  redirectToDashboard = false,
}: {
  redirectToDashboard?: boolean;
}) {
  return (
    <Link
      href={redirectToDashboard ? "/dashboard" : "/"}
      className="flex items-center gap-2 text-xl font-semibold hover:opacity-80 transition-opacity"
    >
      <div className="text-2xl font-bold gradient-text">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          Newpix.ai
        </div>
      </div>
    </Link>
  );
}
