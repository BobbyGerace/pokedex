import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route(":id/:name", "routes/pokemon.tsx"),
] satisfies RouteConfig;
