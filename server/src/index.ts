import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { pokemon } from "./api/pokemon-list.js";
import { pokemonDetails } from "./api/pokemon-details.js";

const app = new Hono().basePath("/api");

app.get("/pokemon", pokemon);
app.get("/pokemon/:id", pokemonDetails);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
