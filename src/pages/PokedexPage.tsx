import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

import { PokemonCard } from "../components/pokemon/PokemonCard";
import { PokemonGridCard } from "../components/pokemon/PokemonGridCard";

import { PokeApiError } from "../data/api/pokeApi";

import {
  getPokemon,
  getPokemonPage,
} from "../data/repositories/pokemonRepository";

import type { Pokemon } from "../models/pokemon";

const PAGE_SIZE = 12;

export function PokedexPage() {
  const [query, setQuery] = useState("pikachu");

  const [selectedPokemon, setSelectedPokemon] =
    useState<Pokemon | null>(null);

  const [pokemonList, setPokemonList] = useState<Pokemon[]>(
    [],
  );

  const [page, setPage] = useState(1);
  const [totalPokemon, setTotalPokemon] = useState(0);

  const [isSearching, setIsSearching] = useState(false);
  const [isGridLoading, setIsGridLoading] = useState(true);

  const [searchError, setSearchError] = useState<
    string | null
  >(null);

  const [gridError, setGridError] = useState<string | null>(
    null,
  );

  const activeSearchRequest =
    useRef<AbortController | null>(null);

  async function searchPokemon(searchQuery: string) {
    const cleanedQuery = searchQuery.trim();

    if (!cleanedQuery) {
      setSearchError(
        "Enter a Pokémon name or Pokédex number.",
      );

      return;
    }

    activeSearchRequest.current?.abort();

    const controller = new AbortController();

    activeSearchRequest.current = controller;

    try {
      setIsSearching(true);
      setSearchError(null);

      const result = await getPokemon(
        cleanedQuery,
        controller.signal,
      );

      setSelectedPokemon(result);
      setQuery(result.name);
    } catch (caughtError) {
      if (controller.signal.aborted) {
        return;
      }

      if (
        caughtError instanceof PokeApiError &&
        caughtError.status === 404
      ) {
        setSearchError(
          `No Pokémon could be found for "${cleanedQuery}".`,
        );

        return;
      }

      setSearchError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while loading Pokémon data.",
      );
    } finally {
      if (!controller.signal.aborted) {
        setIsSearching(false);
      }
    }
  }

  useEffect(() => {
    void searchPokemon("pikachu");

    return () => {
      activeSearchRequest.current?.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPokemonPage() {
      try {
        setIsGridLoading(true);
        setGridError(null);

        const offset = (page - 1) * PAGE_SIZE;

        const result = await getPokemonPage(
          PAGE_SIZE,
          offset,
          controller.signal,
        );

        setPokemonList(result.pokemon);
        setTotalPokemon(result.totalCount);
      } catch (caughtError) {
        if (controller.signal.aborted) {
          return;
        }

        setGridError(
          caughtError instanceof Error
            ? caughtError.message
            : "Something went wrong while loading the Pokédex.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsGridLoading(false);
        }
      }
    }

    void loadPokemonPage();

    return () => {
      controller.abort();
    };
  }, [page]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    void searchPokemon(query);
  }

  function handlePokemonSelection(pokemon: Pokemon) {
    setSelectedPokemon(pokemon);
    setQuery(pokemon.name);
    setSearchError(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const totalPages = Math.ceil(
    totalPokemon / PAGE_SIZE,
  );

  const firstPokemonNumber =
    (page - 1) * PAGE_SIZE + 1;

  const lastPokemonNumber = Math.min(
    page * PAGE_SIZE,
    totalPokemon,
  );

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-cyan-300">
          Pokédex
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Pokémon Database
        </h1>

        <p className="mt-2 max-w-2xl text-slate-400">
          Search for a Pokémon directly or browse the
          Pokédex below.
        </p>
      </header>

      <section className="space-y-4">
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
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Try Pikachu, Lucario, or 25..."
              aria-label="Search Pokémon"
              className="w-full rounded-xl border border-white/10 bg-white/[0.035] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>

        {searchError && (
          <div className="max-w-3xl rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
            {searchError}
          </div>
        )}
      </section>

      {selectedPokemon && (
        <section>
          <PokemonCard pokemon={selectedPokemon} />
        </section>
      )}

      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Browse Pokémon
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select a Pokémon to view its information
              above.
            </p>
          </div>

          {totalPokemon > 0 && (
            <p className="text-sm text-slate-500">
              {firstPokemonNumber}–{lastPokemonNumber} of{" "}
              {totalPokemon}
            </p>
          )}
        </div>

        {gridError && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-300">
            {gridError}
          </div>
        )}

        {isGridLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: PAGE_SIZE }).map(
              (_, index) => (
                <div
                  key={index}
                  className="aspect-[3/4] animate-pulse rounded-2xl border border-white/10 bg-white/[0.035]"
                />
              ),
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {pokemonList.map((pokemon) => (
              <PokemonGridCard
                key={pokemon.id}
                pokemon={pokemon}
                isSelected={
                  selectedPokemon?.id === pokemon.id
                }
                onSelect={handlePokemonSelection}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 pt-5">
            <button
              type="button"
              disabled={page === 1 || isGridLoading}
              onClick={() =>
                setPage((currentPage) =>
                  Math.max(1, currentPage - 1),
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={
                page === totalPages || isGridLoading
              }
              onClick={() =>
                setPage((currentPage) =>
                  Math.min(
                    totalPages,
                    currentPage + 1,
                  ),
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={17} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}