import type { Route } from "./+types/home";
import { PokemonDetails } from "../pokemon-details/pokemon-details";
import { Layout } from "../components/layout";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `${params.name ?? "Pokemon"} Details` }];
}

export default function Pokemon() {
  return (
    <Layout>
      <PokemonDetails />
    </Layout>
  );
}
