interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="mx-auto max-w-4xl">
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
        <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
          Planned module
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-slate-400">
          {description}
        </p>

        <div className="mt-8 rounded-xl border border-dashed border-white/10 bg-black/10 p-6 text-sm text-slate-500">
          This module will be implemented in a future milestone.
        </div>
      </div>
    </section>
  );
}