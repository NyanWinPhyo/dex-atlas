import type { PokemonType } from "./type";

export interface PokemonBaseStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface PokemonArtwork {
  spriteUrl?: string;
  officialArtworkUrl?: string;
}

export interface ZaAvailability {
  availableInZa: boolean | null;

  wildZones?: number[];

  canBeAlpha?: boolean;
  canMegaEvolve?: boolean;

  dayAvailability?: boolean;
  nightAvailability?: boolean;

  weatherConditions?: string[];

  notes?: string;
}

export interface Pokemon {
  id: number;

  nationalDexNumber: number;

  name: string;

  types: PokemonType[];

  baseStats: PokemonBaseStats;

  artwork?: PokemonArtwork;

  height?: number;
  weight?: number;

  evolutionChainId?: number;

  za: ZaAvailability;
}