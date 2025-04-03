import fs from "fs";
import type { PokemonListResult } from "shared-types/api-response.js";
import type { Context } from "hono";
import { ParamCache } from "../lib/param-cache.js";
import { constructImgUrl } from "./utils.js";

const jsonFilePath = new URL("../../pokemon.json", import.meta.url);

const POKEMON: { name: string; id: number }[] = JSON.parse(
  fs.readFileSync(jsonFilePath, { encoding: "utf8" }),
);
const REGULAR_POKEMON = POKEMON.filter((p) => p.id < 10_000);

const PAGE_SIZE = 50;

const cache = new ParamCache<PokemonListResult[]>();

const filteredList = (search?: string) => {
  if (!search) return REGULAR_POKEMON;

  return REGULAR_POKEMON.filter(
    ({ name, id }) =>
      name.toLowerCase().includes(search.toLowerCase()) ||
      id.toString() === search,
  );
};

const pokemonList = async (
  page: number,
  search?: string,
): Promise<PokemonListResult[]> => {
  const offset = (page - 1) * PAGE_SIZE;
  const result = filteredList(search).slice(offset, offset + PAGE_SIZE);

  return result.map(({ name, id }) => ({ name, id, img: constructImgUrl(id) }));
};

export const pokemon = async (c: Context) => {
  const queryParams = c.req.query();
  const page = parseInt(queryParams.page);
  const list = await cache.cachedValue(c, () =>
    pokemonList(page, queryParams.search),
  );

  return c.json(list);
};
