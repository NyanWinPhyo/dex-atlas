import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <p className="text-sm font-semibold text-cyan-300">
          404
        </p>

        <h1 className="mt-2 text-3xl font-bold text-white">
          Area not found
        </h1>

        <p className="mt-3 text-slate-400">
          Looks like this part of Lumiose isn't on our map yet.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          <ArrowLeft size={16} />
          Return home
        </Link>
      </div>
    </div>
  );
}