import type { PokemonBaseStats } from "./pokemon";
import type { PokemonTypeName } from "./type";

export interface PokemonIndexEntry {
  id: number;

  nationalDexNumber: number;

  name: string;

  generation: number | null;

  types: PokemonTypeName[];

  baseStats: PokemonBaseStats;

  artworkUrl?: string;
}

export interface PokemonIndexData {
  generatedAt: string;

  source: string;

  count: number;

  pokemon: PokemonIndexEntry[];
}