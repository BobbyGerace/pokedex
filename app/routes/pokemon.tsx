import type { Route } from "./+types/home";
import { PokemonDetails } from "../pokemon-details/pokemon-details";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `${params.name ?? "Pokemon"} Details` }];
}

export default function Pokemon() {
  return <PokemonDetails />;
}
