export interface GamePokemonData {
  pokemonId: number;

  gameId: string;

  available: boolean;

  locations?: string[];

  notes?: string[];
}