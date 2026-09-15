import {
  fetchPokemon,
  fetchPokemonList,
} from "../api/pokeApi";

import type { PokeApiPokemonResponse } from "../api/pokeApiTypes";
import type {
  Pokemon,
  PokemonBaseStats,
} from "../../models/pokemon";
import type {
  PokemonType,
  PokemonTypeName,
} from "../../models/type";

const validPokemonTypes: PokemonTypeName[] = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

function isPokemonTypeName(
  value: string,
): value is PokemonTypeName {
  return validPokemonTypes.includes(value as PokemonTypeName);
}

function getBaseStat(
  pokemon: PokeApiPokemonResponse,
  statName: string,
): number {
  return (
    pokemon.stats.find(
      (entry) => entry.stat.name === statName,
    )?.base_stat ?? 0
  );
}

function mapBaseStats(
  pokemon: PokeApiPokemonResponse,
): PokemonBaseStats {
  return {
    hp: getBaseStat(pokemon, "hp"),
    attack: getBaseStat(pokemon, "attack"),
    defense: getBaseStat(pokemon, "defense"),
    specialAttack: getBaseStat(pokemon, "special-attack"),
    specialDefense: getBaseStat(pokemon, "special-defense"),
    speed: getBaseStat(pokemon, "speed"),
  };
}

function mapTypes(
  pokemon: PokeApiPokemonResponse,
): PokemonType[] {
  return pokemon.types.flatMap((entry) => {
    if (!isPokemonTypeName(entry.type.name)) {
      return [];
    }

    if (entry.slot !== 1 && entry.slot !== 2) {
      return [];
    }

    return [
      {
        name: entry.type.name,
        slot: entry.slot,
      },
    ];
  });
}

function mapPokemon(
  rawPokemon: PokeApiPokemonResponse,
): Pokemon {
  return {
    id: rawPokemon.id,
    nationalDexNumber: rawPokemon.id,

    name: rawPokemon.name,

    types: mapTypes(rawPokemon),

    baseStats: mapBaseStats(rawPokemon),

    artwork: {
      spriteUrl: rawPokemon.sprites.front_default ?? undefined,

      officialArtworkUrl:
        rawPokemon.sprites.other?.["official-artwork"]
          ?.front_default ?? undefined,
    },

    height: rawPokemon.height,
    weight: rawPokemon.weight,
  };
}

const pokemonCache = new Map<string, Pokemon>();

export async function getPokemon(
  nameOrId: string | number,
  signal?: AbortSignal,
): Promise<Pokemon> {
  const cacheKey = String(nameOrId).trim().toLowerCase();

  const cachedPokemon = pokemonCache.get(cacheKey);

  if (cachedPokemon) {
    return cachedPokemon;
  }

  const rawPokemon = await fetchPokemon(
    nameOrId,
    signal,
  );

  const pokemon = mapPokemon(rawPokemon);

  pokemonCache.set(pokemon.name, pokemon);
  pokemonCache.set(String(pokemon.id), pokemon);

  return pokemon;
}

export interface PokemonPage {
  pokemon: Pokemon[];
  totalCount: number;
}

export async function getPokemonPage(
  limit: number,
  offset: number,
  signal?: AbortSignal,
): Promise<PokemonPage> {
  const list = await fetchPokemonList(
    limit,
    offset,
    signal,
  );

  const pokemon = await Promise.all(
    list.results.map((entry) =>
      getPokemon(entry.name, signal),
    ),
  );

  return {
    pokemon,
    totalCount: list.count,
  };
}