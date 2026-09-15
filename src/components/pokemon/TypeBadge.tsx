import type { PokemonTypeName } from "../../models/type";

interface TypeBadgeProps {
  type: PokemonTypeName;
}

const typeStyles: Record<PokemonTypeName, string> = {
  normal: "border-slate-400/30 bg-slate-400/10 text-slate-300",
  fire: "border-orange-400/30 bg-orange-400/10 text-orange-300",
  water: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  electric: "border-yellow-400/30 bg-yellow-400/10 text-yellow-300",
  grass: "border-green-400/30 bg-green-400/10 text-green-300",
  ice: "border-cyan-300/30 bg-cyan-300/10 text-cyan-200",
  fighting: "border-red-500/30 bg-red-500/10 text-red-300",
  poison: "border-purple-400/30 bg-purple-400/10 text-purple-300",
  ground: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  flying: "border-indigo-300/30 bg-indigo-300/10 text-indigo-200",
  psychic: "border-pink-400/30 bg-pink-400/10 text-pink-300",
  bug: "border-lime-400/30 bg-lime-400/10 text-lime-300",
  rock: "border-stone-400/30 bg-stone-400/10 text-stone-300",
  ghost: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  dragon: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  dark: "border-zinc-400/30 bg-zinc-400/10 text-zinc-300",
  steel: "border-slate-300/30 bg-slate-300/10 text-slate-200",
  fairy: "border-rose-300/30 bg-rose-300/10 text-rose-200",
};

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span
      className={[
        "rounded-full border px-3 py-1 text-sm font-medium capitalize",
        typeStyles[type],
      ].join(" ")}
    >
      {type}
    </span>
  );
}