import type { Route } from "./+types/home";
import { PokemonList } from "../pokemon-list/pokemon-list";
import { Layout } from "../components/layout";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Pokedex Home" }];
}

export default function Home() {
  return (
    <Layout>
      <PokemonList />
    </Layout>
  );
}
