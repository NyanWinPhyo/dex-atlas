export type GameCategory =
  | "main-series"
  | "legends"
  | "remake"
  | "spinoff";

export interface PokemonGame {
  id: string;

  name: string;

  shortName?: string;

  category: GameCategory;

  generation: number;

  releaseYear?: number;

  platforms: string[];

  regionOrSetting?: string;

  description?: string;
}