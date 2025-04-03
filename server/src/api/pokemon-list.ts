import type { ResultList } from "shared-types/poke-api.ts";
import type { PokemonListResult } from "shared-types/api-response.js";
import type { Context } from "hono";
import { ParamCache } from "../lib/param-cache.js";
import { constructImgUrl } from "./utils.js";

const PAGE_SIZE = 50;

const parseId = (url: string): number => {
  const matches = url.match(/pokemon\/(\d+)/);
  return matches ? parseInt(matches[1]) : -1;
};

const cache = new ParamCache<PokemonListResult[]>();

const pokemonList = async (page: number): Promise<PokemonListResult[]> => {
  const offset = (page - 1) * PAGE_SIZE;
  let url: string;
  const response = await fetch(
    (url = `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`),
  );

  if (!response.ok) throw new Error("Oopsies");

  const parsed = (await response.json()) as ResultList;

  return parsed.results.map(({ name, url }): PokemonListResult => {
    const id = parseId(url);
    return { name, id, url, img: constructImgUrl(id) };
  });
};

export const pokemon = async (c: Context) => {
  const page = parseInt(c.req.query().page);
  const list = await cache.cachedValue(c, () => pokemonList(page));

  return c.json(list);
};
