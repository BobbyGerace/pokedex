import type { FC } from "react";
import { Link } from "react-router";
import { capitalize, leftPad0 } from "../utils";

type PokemonCardProps = {
  name: string;
  id: number;
  img: string;
};

export const PokemonCard: FC<PokemonCardProps> = ({ name, id, img }) => {
  const capsName = capitalize(name);

  return (
    <Link
      to={`${id}/${capsName}`}
      className="block rounded-lg shadow overflow-hidden min-h-48 bg-slate-100"
    >
      <div className="relative bg-blue-900 w-full h-28 p-4 flex justify-center">
        <div className="absolute top-0 left-0 p-2 text-xs text-slate-200">
          #{leftPad0(id.toString(), 4)}
        </div>
        <div className="bg-white rounded-full p-4 w-32 h-32 border-1 border-slate-500 z-1">
          <img src={img} />
        </div>
      </div>
      <div className="text-center pt-10 pb-4 bg-slate-100">
        <span className="font-bold">{capsName}</span>
      </div>
    </Link>
  );
};
