import { TypeBadge } from "./TypeBadge";

import type { Pokemon } from "../../models/pokemon";

interface PokemonCardProps {
  pokemon: Pokemon;
}

function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <article className="max-w-3xl rounded-2xl border border-white/10 bg-white/[0.035] p-6">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex h-48 w-full shrink-0 items-center justify-center rounded-2xl bg-white/[0.03] sm:w-48">
          {pokemon.artwork?.officialArtworkUrl ? (
            <img
              src={pokemon.artwork.officialArtworkUrl}
              alt={formatPokemonName(pokemon.name)}
              className="h-40 w-40 object-contain"
            />
          ) : (
            <span className="text-sm text-slate-500">
              No artwork available
            </span>
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm text-slate-500">
            #
            {pokemon.nationalDexNumber
              .toString()
              .padStart(4, "0")}
          </p>

          <h2 className="mt-1 text-3xl font-bold text-white">
            {formatPokemonName(pokemon.name)}
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {pokemon.types.map((type) => (
              <TypeBadge
                key={type.slot}
                type={type.name}
              />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat
              label="HP"
              value={pokemon.baseStats.hp}
            />

            <Stat
              label="Attack"
              value={pokemon.baseStats.attack}
            />

            <Stat
              label="Defense"
              value={pokemon.baseStats.defense}
            />

            <Stat
              label="Sp. Atk"
              value={pokemon.baseStats.specialAttack}
            />

            <Stat
              label="Sp. Def"
              value={pokemon.baseStats.specialDefense}
            />

            <Stat
              label="Speed"
              value={pokemon.baseStats.speed}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

interface StatProps {
  label: string;
  value: number;
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/10 p-3">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-white">
        {value}
      </p>
    </div>
  );
}