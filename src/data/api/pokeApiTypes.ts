export interface PokeApiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PokeApiNamedResource {
  name: string;
  url: string;
}

export interface PokeApiPokemonTypeSlot {
  slot: number;
  type: PokeApiNamedResource;
}

export interface PokeApiPokemonStat {
  base_stat: number;
  effort: number;
  stat: PokeApiNamedResource;
}

export interface PokeApiPokemonSprites {
  front_default: string | null;

  other?: {
    "official-artwork"?: {
      front_default: string | null;
    };
  };
}

export interface PokeApiPokemonResponse {
  id: number;
  name: string;

  height: number;
  weight: number;

  types: PokeApiPokemonTypeSlot[];
  stats: PokeApiPokemonStat[];

  sprites: PokeApiPokemonSprites;
}