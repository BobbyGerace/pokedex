import type {
  PokemonDetailResult,
  PokemonListResult,
} from "shared-types/api-response";

const BASE_URL = "http://localhost:3000/api";

export const pokemonList = async (
  page: number
): Promise<PokemonListResult[]> => {
  const response = await fetch(`${BASE_URL}/pokemon?page=${page}`);

  if (!response.ok) throw new Error("Oopsies");

  return (await response.json()) as PokemonListResult[];
};

export const pokemonDetails = async (
  id: number
): Promise<PokemonDetailResult> => {
  const response = await fetch(`${BASE_URL}/pokemon/${id}`);

  if (!response.ok) throw new Error("Oopsies");

  return await response.json();
};
