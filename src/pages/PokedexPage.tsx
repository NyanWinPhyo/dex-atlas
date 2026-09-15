import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { Search } from "lucide-react";

import { PokemonCard } from "../components/pokemon/PokemonCard";
import { PokeApiError } from "../data/api/pokeApi";
import { getPokemon } from "../data/repositories/pokemonRepository";

import type { Pokemon } from "../models/pokemon";

export function PokedexPage() {
  const [query, setQuery] = useState("pikachu");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeRequest = useRef<AbortController | null>(null);

  async function searchPokemon(searchQuery: string) {
    const cleanedQuery = searchQuery.trim();

    if (!cleanedQuery) {
      setError("Enter a Pokémon name or Pokédex number.");
      return;
    }

    activeRequest.current?.abort();

    const controller = new AbortController();

    activeRequest.current = controller;

    try {
      setIsLoading(true);
      setError(null);

      const result = await getPokemon(
        cleanedQuery,
        controller.signal,
      );

      setPokemon(result);
    } catch (caughtError) {
      if (controller.signal.aborted) {
        return;
      }

      setPokemon(null);

      if (
        caughtError instanceof PokeApiError &&
        caughtError.status === 404
      ) {
        setError(
          `No Pokémon could be found for "${cleanedQuery}".`,
        );

        return;
      }

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while loading Pokémon data.",
      );
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    void searchPokemon("pikachu");

    return () => {
      activeRequest.current?.abort();
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    void searchPokemon(query);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-cyan-300">
          Pokédex
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Pokémon Database
        </h1>

        <p className="mt-2 max-w-2xl text-slate-400">
          Search for a Pokémon by name or National Pokédex number.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex max-w-3xl flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try Pikachu, Lucario, or 25..."
            aria-label="Search Pokémon"
            className="w-full rounded-xl border border-white/10 bg-white/[0.035] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {isLoading && !pokemon && (
        <div className="max-w-3xl rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-slate-400">
          Loading Pokémon...
        </div>
      )}

      {error && (
        <div className="max-w-3xl rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-300">
          {error}
        </div>
      )}

      {pokemon && !error && (
        <PokemonCard pokemon={pokemon} />
      )}
    </div>
  );
}