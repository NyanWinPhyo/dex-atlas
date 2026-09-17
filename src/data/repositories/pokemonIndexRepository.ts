import type {
  PokemonIndexData,
  PokemonIndexEntry,
} from "../../models/pokemonIndex";

let cachedIndex: PokemonIndexData | null = null;

export async function getPokemonIndex(
  signal?: AbortSignal,
): Promise<PokemonIndexData> {
  if (cachedIndex) {
    return cachedIndex;
  }

  const response = await fetch("/data/pokemon-index.json", {
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load Pokédex index (${response.status}).`,
    );
  }

  const data = (await response.json()) as PokemonIndexData;

  cachedIndex = data;

  return data;
}

export function findPokemonInIndex(
  pokemon: PokemonIndexEntry[],
  query: string,
): PokemonIndexEntry | undefined {
  const cleanedQuery = query.trim().toLowerCase();

  if (!cleanedQuery) {
    return undefined;
  }

  const dexNumber = Number(cleanedQuery);

  if (Number.isInteger(dexNumber)) {
    return pokemon.find(
      (entry) => entry.nationalDexNumber === dexNumber,
    );
  }

  return pokemon.find(
    (entry) => entry.name.toLowerCase() === cleanedQuery,
  );
}