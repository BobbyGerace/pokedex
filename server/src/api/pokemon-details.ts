import type { Context } from "hono";
import type {
  EvolutionChainResult,
  FlavorText,
  Pokemon,
  PokemonEvolutionChain,
  PokemonSpecies,
  PokemonStat,
} from "shared-types/poke-api.ts";
import { ParamCache } from "../lib/param-cache.js";
import { HTTPException } from "hono/http-exception";
import type { PokemonDetailResult } from "../../../shared-types/api-response.js";
import { constructImgUrl } from "./utils.js";

const cache = new ParamCache<PokemonDetailResult>();

export const fetchPokemonDetails = async (
  id: number,
): Promise<PokemonDetailResult> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

  if (!response.ok) throw new Error("Oopsies");

  const parsed = (await response.json()) as Pokemon;

  const speciesInfo = await fetchSpeciesInfo(id);
  const evolutionChain = await fetchEvolutionChain(
    speciesInfo.evolution_chain.url,
  );

  return {
    name: parsed.name,
    id: parsed.id,
    height: parsed.height,
    weight: parsed.weight,
    img: constructImgUrl(parsed.id),
    stats: formatStats(parsed.stats),
    types: parsed.types.map(
      (t) => typeMap[parseId(t.type.url) as keyof typeof typeMap],
    ),
    flavorTexts: formatFlavorTexts(speciesInfo.flavor_text_entries),
    evolutionChain,
  };
};

const fetchSpeciesInfo = async (id: number): Promise<PokemonSpecies> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${id}`,
  );

  if (!response.ok) throw new Error("Oopsies");

  return response.json();
};

const formatFlavorTexts = (entries: FlavorText[]) => {
  const texts = entries
    .filter((ft) => ft.language.name == "en")
    .map((ft) => ft.flavor_text);

  return [...new Set(texts)];
};

const fetchEvolutionChain = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) throw new Error("Oopsies");

  const result = (await response.json()) as EvolutionChainResult;

  const pokemonIds = extractEvolutionIds(result.chain);

  const pokemonDetails = await getPokemonDetailMap(pokemonIds);

  const rebuildChain = (
    chain: PokemonEvolutionChain,
  ): PokemonDetailResult["evolutionChain"] => {
    const deets = pokemonDetails.get(extractId(chain.species.url));
    if (!deets) throw new Error("Missing pokemon details");
    return {
      evolvesTo: chain.evolves_to.map(rebuildChain),
      ...deets,
    };
  };

  return rebuildChain(result.chain);
};

const extractEvolutionIds = (chain: PokemonEvolutionChain): number[] => {
  // Walk the list and find out all the pokemon we need to look up
  const id = extractId(chain.species.url);

  if (chain.evolves_to.length === 0) return [id];

  const nextIds = chain.evolves_to.flatMap(extractEvolutionIds);

  return [id].concat(...nextIds);
};

const extractId = (url: string): number =>
  parseInt(url.match(/pokemon-species\/(\d+)/)![1], 10);

type ShortDetails = { name: string; id: number; img: string };
type DetailMap = Map<number, ShortDetails>;
const getPokemonDetailMap = async (ids: number[]): Promise<DetailMap> => {
  const deets = await Promise.all(ids.map(fetchShortDetails));

  const map = new Map<number, ShortDetails>();

  for (const d of deets) map.set(d.id, d);

  return map;
};

const fetchShortDetails = async (id: number): Promise<ShortDetails> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

  if (!response.ok) throw new Error("Oopsies");

  const parsed = (await response.json()) as Pokemon;

  return {
    name: parsed.name,
    id: parsed.id,
    img: constructImgUrl(parsed.id),
  };
};

const formatStats = (stats: PokemonStat[]) => {
  return stats.map((s) => ({ value: s.base_stat, name: s.stat.name }));
};

const typeMap = {
  1: { name: "Normal", id: 1, icon: "🔘" },
  2: { name: "Fighting", id: 2, icon: "🥊" },
  3: { name: "Flying", id: 3, icon: "🕊️" },
  4: { name: "Poison", id: 4, icon: "☠️" },
  5: { name: "Ground", id: 5, icon: "🌍" },
  6: { name: "Rock", id: 6, icon: "🪨" },
  7: { name: "Bug", id: 7, icon: "🐛" },
  8: { name: "Ghost", id: 8, icon: "👻" },
  9: { name: "Steel", id: 9, icon: "⚙️" },
  10: { name: "Fire", id: 10, icon: "🔥" },
  11: { name: "Water", id: 11, icon: "💧" },
  12: { name: "Grass", id: 12, icon: "🌿" },
  13: { name: "Electric", id: 13, icon: "⚡" },
  14: { name: "Psychic", id: 14, icon: "🔮" },
  15: { name: "Ice", id: 15, icon: "🧊" },
  16: { name: "Dragon", id: 16, icon: "🐉" },
  17: { name: "Dark", id: 17, icon: "🌑" },
  18: { name: "Fairy", id: 18, icon: "🧚" },
  19: { name: "Stellar", id: 19, icon: "🌟" },
  10001: { name: "Unknown", id: 10001, icon: "❓" },
};

const parseId = (url: string): number => {
  const matches = url.match(/type\/(\d+)/);
  return matches ? parseInt(matches[1]) : 10001;
};

export const pokemonDetails = async (c: Context) => {
  const id = parseInt(c.req.param("id"));

  // This isn't the right way to validate an int, but close enough
  if (isNaN(id)) {
    throw new HTTPException(400, {
      message: "id parameter must be an integer",
    });
  }

  const list = await cache.cachedValue(c, () => fetchPokemonDetails(id));

  return c.json(list);
};
