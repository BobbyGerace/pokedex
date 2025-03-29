import { useEffect, useState } from "react";
import { PokemonCard } from "./pokemon-card";

type PokeApiList = {
  count: number;
  next: string;
  previous: string;
  results: Array<Result>;
};

type Result = {
  name: string;
  url: string;
};

type Pokemon = {
  name: string;
  id: number;
  img: string;
};

const parseId = (url: string): number => {
  const matches = url.match(/pokemon\/(\d+)/);
  return matches ? parseInt(matches[1]) : -1;
};

const constructImgUrl = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const resultToPokemon = ({ name, url }: Result): Pokemon => {
  const id = parseId(url);
  return { name, id, img: constructImgUrl(id) };
};

const fetchPokemon = async (): Promise<PokeApiList> => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon");

  if (!response.ok) throw new Error("Oopsies");

  return await response.json();
};

export function PokemonList() {
  const [pokemonList, setPokemonList] = useState<null | Pokemon[]>(null);

  useEffect(() => {
    fetchPokemon().then((res) => {
      setPokemonList(res.results.map(resultToPokemon));
    });
  }, []);

  if (pokemonList == null) return [];

  return (
    <main className="container mx-auto pt-4">
      <h1 className="text-center text-6xl mb-4">Pokédex</h1>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {pokemonList.map((p) => (
          <PokemonCard key={p.id} {...p} />
        ))}
      </div>
    </main>
  );
}
