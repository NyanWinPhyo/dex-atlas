import { TypeBadge } from "./TypeBadge";

import type { Pokemon } from "../../models/pokemon";

import {
  formatDexNumber,
  formatPokemonName,
} from "../../utils/pokemonFormatting";

interface PokemonGridCardProps {
  pokemon: Pokemon;
  isSelected?: boolean;
  onSelect: (pokemon: Pokemon) => void;
}

export function PokemonGridCard({
  pokemon,
  isSelected = false,
  onSelect,
}: PokemonGridCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(pokemon)}
      className={[
        "group rounded-2xl border p-4 text-left transition",
        "hover:-translate-y-0.5 hover:bg-white/[0.055]",
        isSelected
          ? "border-cyan-400/40 bg-cyan-400/[0.06]"
          : "border-white/10 bg-white/[0.035]",
      ].join(" ")}
    >
      <div className="flex aspect-square items-center justify-center rounded-xl bg-white/[0.03]">
        {pokemon.artwork?.officialArtworkUrl ? (
          <img
            src={pokemon.artwork.officialArtworkUrl}
            alt={formatPokemonName(pokemon.name)}
            loading="lazy"
            className="h-[85%] w-[85%] object-contain transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <span className="text-xs text-slate-500">
            No artwork
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs text-slate-500">
          {formatDexNumber(pokemon.nationalDexNumber)}
        </p>

        <h3 className="mt-1 truncate font-semibold text-white">
          {formatPokemonName(pokemon.name)}
        </h3>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {pokemon.types.map((type) => (
            <TypeBadge
              key={type.slot}
              type={type.name}
            />
          ))}
        </div>
      </div>
    </button>
  );
}