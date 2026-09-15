import type { PokemonGame } from "../models/game";

export const games: PokemonGame[] = [
  {
    id: "legends-za",

    name: "Pokémon Legends: Z-A",

    shortName: "Legends: Z-A",

    category: "legends",

    generation: 9,

    platforms: [
      "Nintendo Switch",
      "Nintendo Switch 2",
    ],

    regionOrSetting: "Lumiose City",

    description:
      "The currently supported deep-dive game guide.",
  },
];

export function getGameById(
  id: string,
): PokemonGame | undefined {
  return games.find((game) => game.id === id);
}