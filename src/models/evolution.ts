export type EvolutionMethod =
  | "level"
  | "item"
  | "friendship"
  | "time"
  | "move"
  | "location"
  | "trade"
  | "special";

export interface EvolutionRequirement {
  method: EvolutionMethod;

  level?: number;
  itemName?: string;
  minimumFriendship?: number;
  timeOfDay?: "day" | "night";
  knownMove?: string;
  location?: string;

  notes?: string;
}

export interface EvolutionLink {
  fromPokemonId: number;
  toPokemonId: number;

  requirement: EvolutionRequirement;
}