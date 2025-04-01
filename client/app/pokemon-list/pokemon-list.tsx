import { useEffect, useState } from "react";
import { PokemonCard } from "./pokemon-card";
import type { PokemonListResult } from "shared-types/api-response";
import * as api from "../lib/api";

export function PokemonList() {
  const [pokemonList, setPokemonList] = useState<null | PokemonListResult[]>(
    null
  );

  useEffect(() => {
    api.pokemonList().then(setPokemonList);
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
