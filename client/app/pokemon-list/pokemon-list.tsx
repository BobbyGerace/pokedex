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
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
      {pokemonList.map((p) => (
        <PokemonCard key={p.id} {...p} />
      ))}
    </div>
  );
}
