import type { FC } from "react";
import { useParams } from "react-router";

export const PokemonDetails: FC = () => {
  const { id, name } = useParams();
  return <span>Hello {name}!</span>;
};
