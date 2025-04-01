import type { ResultList } from "shared-types/poke-api.ts";
import type { PokemonListResult } from "shared-types/api-response.js";
import type { Context } from "hono";
import { ParamCache } from "../lib/param-cache.js";
import { constructImgUrl } from "./utils.js";

const parseId = (url: string): number => {
  const matches = url.match(/pokemon\/(\d+)/);
  return matches ? parseInt(matches[1]) : -1;
};

const cache = new ParamCache<PokemonListResult[]>();

const pokemonList = async (): Promise<PokemonListResult[]> => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");

  if (!response.ok) throw new Error("Oopsies");

  const parsed = (await response.json()) as ResultList;

  return parsed.results.map(({ name, url }): PokemonListResult => {
    const id = parseId(url);
    return { name, id, url, img: constructImgUrl(id) };
  });
};

export const pokemon = async (c: Context) => {
  const list = await cache.cachedValue(c, pokemonList);

  return c.json(list);
};
