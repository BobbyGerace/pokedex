import type { Route } from "./+types/home";
import { PokemonDetails } from "../pokemon-details/pokemon-details";
import { Layout } from "../components/layout";
import { pokemonDetails } from "../lib/api";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `${params.name ?? "Pokemon"} Details` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const id = parseInt(params.id ?? "0");
  return await pokemonDetails(id);
}

export default function Pokemon({ loaderData }: Route.ComponentProps) {
  return (
    <Layout>
      <PokemonDetails details={loaderData as any} />
    </Layout>
  );
}
