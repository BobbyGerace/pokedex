import { pokemonList } from "../lib/api";
import type { Route } from "./+types/home";

export async function loader({ request }: Route.LoaderArgs) {
  // There's got to be a better built-in way to do this, right?
  const search = new URLSearchParams(new URL(request.url).search);
  const page = parseInt(search.get("page") ?? "1");
  return pokemonList(page, search.get("search") ?? "");
}
