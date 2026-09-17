import fs from "node:fs/promises";
import path from "node:path";

const POKE_API_BASE_URL = "https://pokeapi.co/api/v2";

const OUTPUT_DIRECTORY = path.resolve(
  "public",
  "data",
);

const OUTPUT_FILE = path.join(
  OUTPUT_DIRECTORY,
  "pokemon-index.json",
);

const CONCURRENT_REQUESTS = 8;

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error(
      `Request failed: ${response.status} ${url}`,
    );

    error.status = response.status;

    throw error;
  }

  return response.json();
}

async function getDefaultPokemonForSpecies(species) {
  try {
    return await fetchJson(
      `${POKE_API_BASE_URL}/pokemon/${encodeURIComponent(
        species.name,
      )}`,
    );
  } catch (error) {
    if (error.status !== 404) {
      throw error;
    }

    console.log(
      `↳ Resolving default form for ${species.name}...`,
    );

    const speciesData = await fetchJson(species.url);

    const defaultVariety = speciesData.varieties.find(
      (variety) => variety.is_default,
    );

    if (!defaultVariety) {
      throw new Error(
        `No default variety found for ${species.name}.`,
      );
    }

    return fetchJson(defaultVariety.pokemon.url);
  }
}

async function getGenerationMap() {
  console.log("Loading generation information...");

  const generationList = await fetchJson(
    `${POKE_API_BASE_URL}/generation?limit=100`,
  );

  const generationMap = new Map();

  for (const generationReference of generationList.results) {
    const generation = await fetchJson(
      generationReference.url,
    );

    for (const species of generation.pokemon_species) {
      generationMap.set(
        species.name,
        generation.id,
      );
    }
  }

  return generationMap;
}

async function getAllPokemonSpecies() {
  const initialResponse = await fetchJson(
    `${POKE_API_BASE_URL}/pokemon-species?limit=1`,
  );

  const totalSpecies = initialResponse.count;

  console.log(
    `PokéAPI reports ${totalSpecies} Pokémon species.`,
  );

  const fullResponse = await fetchJson(
    `${POKE_API_BASE_URL}/pokemon-species?limit=${totalSpecies}`,
  );

  return fullResponse.results;
}

function getStat(pokemon, statName) {
  return (
    pokemon.stats.find(
      (entry) => entry.stat.name === statName,
    )?.base_stat ?? 0
  );
}

function convertPokemon(
  pokemon,
  generation,
  speciesName,
) {
  return {
    id: pokemon.id,

    nationalDexNumber: pokemon.id,

    name: speciesName,

    generation,

    types: pokemon.types
      .sort((a, b) => a.slot - b.slot)
      .map((entry) => entry.type.name),

    baseStats: {
      hp: getStat(pokemon, "hp"),

      attack: getStat(pokemon, "attack"),

      defense: getStat(pokemon, "defense"),

      specialAttack: getStat(
        pokemon,
        "special-attack",
      ),

      specialDefense: getStat(
        pokemon,
        "special-defense",
      ),

      speed: getStat(pokemon, "speed"),
    },

    artworkUrl:
      pokemon.sprites.other?.["official-artwork"]
        ?.front_default ?? undefined,
  };
}

async function processSpecies(
  species,
  generationMap,
  index,
  total,
) {
  const pokemon = await getDefaultPokemonForSpecies(
  species,
  );

  const generation =
    generationMap.get(species.name) ?? null;

  console.log(
    `[${index}/${total}] ${species.name}`,
  );

  return convertPokemon(
  pokemon,
  generation,
  species.name,
  );
}

async function processInBatches(
  speciesList,
  generationMap,
) {
  const results = [];

  for (
    let start = 0;
    start < speciesList.length;
    start += CONCURRENT_REQUESTS
  ) {
    const batch = speciesList.slice(
      start,
      start + CONCURRENT_REQUESTS,
    );

    const batchResults = await Promise.all(
      batch.map((species, batchIndex) =>
        processSpecies(
          species,
          generationMap,
          start + batchIndex + 1,
          speciesList.length,
        ),
      ),
    );

    results.push(...batchResults);
  }

  return results;
}

async function main() {
  console.log("");
  console.log(
    "Generating Universal Pokédex index...",
  );
  console.log("");

  const generationMap =
    await getGenerationMap();

  const species =
    await getAllPokemonSpecies();

  const pokemon =
    await processInBatches(
      species,
      generationMap,
    );

  pokemon.sort(
    (a, b) =>
      a.nationalDexNumber -
      b.nationalDexNumber,
  );

  const data = {
    generatedAt: new Date().toISOString(),

    source: "PokéAPI",

    count: pokemon.length,

    pokemon,
  };

  await fs.mkdir(
    OUTPUT_DIRECTORY,
    {
      recursive: true,
    },
  );

  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(data, null, 2),
    "utf8",
  );

  console.log("");
  console.log(
    `✓ Generated ${pokemon.length} Pokémon.`,
  );

  console.log(
    `✓ Saved to ${OUTPUT_FILE}`,
  );

  console.log("");
}

main().catch((error) => {
  console.error("");
  console.error(
    "Failed to generate Pokédex index:",
  );

  console.error(error);

  process.exitCode = 1;
});