import type { Route } from "./+types/home";
import { PokemonList } from "../pokemon-list/pokemon-list";
import { Layout } from "../components/layout";
import { pokemonList } from "../lib/api";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Pokedex Home" }];
}

export async function loader() {
  return pokemonList(1);
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <Layout>
      <PokemonList data={loaderData as any} />
    </Layout>
  );
}
