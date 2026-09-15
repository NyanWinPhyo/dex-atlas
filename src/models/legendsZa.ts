import type { GamePokemonData } from "./gamePokemon";

export type ZaTimeOfDay =
  | "day"
  | "night";

export type ZaSpawnType =
  | "wild-zone"
  | "rooftop"
  | "street"
  | "park"
  | "special";

export interface ZaPokemonData extends GamePokemonData {
  wildZones?: number[];

  spawnTypes?: ZaSpawnType[];

  timeAvailability?: ZaTimeOfDay[];

  weatherConditions?: string[];

  canBeAlpha?: boolean;

  canMegaEvolve?: boolean;

  notes?: string[];
}