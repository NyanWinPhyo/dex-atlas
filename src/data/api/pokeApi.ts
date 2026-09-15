import type {
  PokeApiListResponse,
  PokeApiNamedResource,
  PokeApiPokemonResponse,
} from "./pokeApiTypes";

const POKE_API_BASE_URL = "https://pokeapi.co/api/v2";

export class PokeApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);

    this.name = "PokeApiError";
    this.status = status;
  }
}

async function fetchFromPokeApi<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${POKE_API_BASE_URL}${path}`, {
    signal,
  });

  if (!response.ok) {
    throw new PokeApiError(
      response.status,
      `PokéAPI request failed with status ${response.status}.`,
    );
  }

  return response.json() as Promise<T>;
}

export function fetchPokemon(
  nameOrId: string | number,
  signal?: AbortSignal,
): Promise<PokeApiPokemonResponse> {
  const query = encodeURIComponent(
    String(nameOrId).trim().toLowerCase(),
  );

  return fetchFromPokeApi<PokeApiPokemonResponse>(
    `/pokemon/${query}`,
    signal,
  );
}

export function fetchPokemonList(
  limit: number,
  offset: number,
  signal?: AbortSignal,
): Promise<PokeApiListResponse<PokeApiNamedResource>> {
  return fetchFromPokeApi<
    PokeApiListResponse<PokeApiNamedResource>
  >(
    `/pokemon?limit=${limit}&offset=${offset}`,
    signal,
  );
}