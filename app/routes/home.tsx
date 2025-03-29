import type { Route } from "./+types/home";
import { PokemonList } from "../pokemon-list/pokemon-list";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Pokedex Home" }];
}

export default function Home() {
  return <PokemonList />;
}
