import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

import { PokemonGridCard } from "../components/pokemon/PokemonGridCard";
import { TypeBadge } from "../components/pokemon/TypeBadge";

import { getPokemonIndex } from "../data/repositories/pokemonIndexRepository";

import type { PokemonIndexEntry } from "../models/pokemonIndex";
import type { PokemonTypeName } from "../models/type";

import {
  formatDexNumber,
  formatPokemonName,
} from "../utils/pokemonFormatting";

const PAGE_SIZE = 48;

type SortOption =
  | "dex-asc"
  | "dex-desc"
  | "name-asc"
  | "name-desc"
  | "hp-desc"
  | "attack-desc"
  | "defense-desc"
  | "speed-desc";

const pokemonTypes: PokemonTypeName[] = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export function PokedexPage() {
  const [allPokemon, setAllPokemon] = useState<
    PokemonIndexEntry[]
  >([]);

  const [selectedPokemon, setSelectedPokemon] =
    useState<PokemonIndexEntry | null>(null);

  const [query, setQuery] = useState("");
  const [generation, setGeneration] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] =
    useState<SortOption>("dex-asc");

  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resultsRef = useRef<HTMLElement | null>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadIndex() {
      try {
        setIsLoading(true);

        const data = await getPokemonIndex(
          controller.signal,
        );

        setAllPokemon(data.pokemon);
      } catch (caughtError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to load Pokédex.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadIndex();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    resultsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [page]);

  const filteredPokemon = useMemo(() => {
    const cleanedQuery = query
      .trim()
      .toLowerCase();

    const result = allPokemon.filter((pokemon) => {
      const matchesQuery =
        !cleanedQuery ||
        pokemon.name.includes(cleanedQuery) ||
        String(pokemon.nationalDexNumber).includes(
          cleanedQuery,
        );

      const matchesGeneration =
        generation === "all" ||
        pokemon.generation === Number(generation);

      const matchesType =
        type === "all" ||
        pokemon.types.includes(
          type as PokemonTypeName,
        );

      return (
        matchesQuery &&
        matchesGeneration &&
        matchesType
      );
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "dex-desc":
          return b.nationalDexNumber - a.nationalDexNumber;

        case "name-asc":
          return a.name.localeCompare(b.name);

        case "name-desc":
          return b.name.localeCompare(a.name);

        case "hp-desc":
          return b.baseStats.hp - a.baseStats.hp;

        case "attack-desc":
          return (
            b.baseStats.attack -
            a.baseStats.attack
          );

        case "defense-desc":
          return (
            b.baseStats.defense -
            a.baseStats.defense
          );

        case "speed-desc":
          return (
            b.baseStats.speed -
            a.baseStats.speed
          );

        default:
          return a.nationalDexNumber - b.nationalDexNumber;
      }
    });

  }, [
    allPokemon,
    query,
    generation,
    type,
    sort,
  ]);

  useEffect(() => {
    setPage(1);
  }, [query, generation, type, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPokemon.length / PAGE_SIZE),
  );

  const currentPokemon = filteredPokemon.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  function handlePageChange(nextPage: number) {
    const safePage = Math.min(
      Math.max(nextPage, 1),
      totalPages,
    );

    setPage(safePage);
  }

  function handleSelect(
    pokemon: PokemonIndexEntry,
  ) {
    setSelectedPokemon(pokemon);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-cyan-300">
          Universal Pokédex
        </p>

        <h1 className="mt-2 text-3xl font-bold text-white">
          Explore Pokémon
        </h1>

        <p className="mt-2 text-slate-400">
          Search, filter and sort Pokémon across every
          generation.
        </p>
      </header>

      {selectedPokemon && (
        <section className="max-w-3xl rounded-2xl border border-white/10 bg-white/[0.035] p-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex h-48 w-full shrink-0 items-center justify-center rounded-2xl bg-white/[0.03] sm:w-48">
              {selectedPokemon.artworkUrl && (
                <img
                  src={selectedPokemon.artworkUrl}
                  alt={selectedPokemon.name}
                  className="h-40 w-40 object-contain"
                />
              )}
            </div>

            <div className="flex-1">
              <p className="text-sm text-slate-500">
                {formatDexNumber(
                  selectedPokemon.nationalDexNumber,
                )}
              </p>

              <h2 className="mt-1 text-3xl font-bold text-white">
                {formatPokemonName(
                  selectedPokemon.name,
                )}
              </h2>

              <div className="mt-3 flex gap-2">
                {selectedPokemon.types.map((type) => (
                  <TypeBadge
                    key={type}
                    type={type}
                  />
                ))}
              </div>

              <p className="mt-4 text-sm text-slate-400">
                Generation{" "}
                {selectedPokemon.generation ?? "Unknown"}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search name or Pokédex number..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.035] py-3 pl-11 pr-4 text-sm text-white outline-none"
          />
        </div>

        <select
          value={generation}
          onChange={(event) =>
            setGeneration(event.target.value)
          }
          className="rounded-xl border border-white/10 bg-[#0e131d] px-4 py-3 text-sm text-white"
        >
          <option value="all">All generations</option>

          {Array.from({ length: 9 }, (_, index) => (
            <option
              key={index + 1}
              value={index + 1}
            >
              Generation {index + 1}
            </option>
          ))}
        </select>

        <select
          value={type}
          onChange={(event) =>
            setType(event.target.value)
          }
          className="rounded-xl border border-white/10 bg-[#0e131d] px-4 py-3 text-sm capitalize text-white"
        >
          <option value="all">All types</option>

          {pokemonTypes.map((pokemonType) => (
            <option
              key={pokemonType}
              value={pokemonType}
            >
              {pokemonType}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) =>
            setSort(event.target.value as SortOption)
          }
          className="rounded-xl border border-white/10 bg-[#0e131d] px-4 py-3 text-sm text-white"
        >
          <option value="dex-asc">
            Dex number ↑
          </option>

          <option value="dex-desc">
            Dex number ↓
          </option>

          <option value="name-asc">
            Name A–Z
          </option>

          <option value="name-desc">
            Name Z–A
          </option>

          <option value="hp-desc">
            Highest HP
          </option>

          <option value="attack-desc">
            Highest Attack
          </option>

          <option value="defense-desc">
            Highest Defense
          </option>

          <option value="speed-desc">
            Highest Speed
          </option>
        </select>
      </section>

      {isLoading && (
        <p className="text-slate-400">
          Loading Universal Pokédex...
        </p>
      )}

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
        <section ref={resultsRef} className="scroll-mt-24 space-y-5">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Pokémon
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredPokemon.length} Pokémon found
              </p>
            </div>

            <PaginationControls
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {currentPokemon.map((pokemon) => (
              <PokemonGridCard
                key={pokemon.id}
                pokemon={pokemon}
                isSelected={
                  selectedPokemon?.id === pokemon.id
                }
                onSelect={handleSelect}
              />
            ))}
          </div>

          <div className="border-t border-white/10 pt-6">
            <PaginationControls
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
        </>
      )}
    </div>
  );
}

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft size={17} />

        <span className="hidden sm:inline">
          Previous
        </span>
      </button>

      <label className="flex items-center gap-2 text-sm text-slate-400">
        Page

        <input
          type="number"
          min={1}
          max={totalPages}
          value={page}
          onChange={(event) => {
            const nextPage = Number(event.target.value);

            if (
              Number.isInteger(nextPage) &&
              nextPage >= 1 &&
              nextPage <= totalPages
            ) {
              onPageChange(nextPage);
            }
          }}
          className="w-20 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-center text-white outline-none focus:border-cyan-400/40"
        />

        of {totalPages}
      </label>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <span className="hidden sm:inline">
          Next
        </span>

        <ChevronRight size={17} />
      </button>
    </div>
  );
}
