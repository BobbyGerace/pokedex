import type { FC } from "react";
import { Link } from "react-router";

type PokemonCardProps = {
  name: string;
  id: number;
  img: string;
};

const capitalize = (str: string) => {
  const words = str.split(" ");
  return words.map((w) => w[0].toUpperCase() + w.slice(1)).join("");
};

const leftPad0 = (str: string, n: number): string => {
  while (str.length < n) str = "0" + str;
  return str;
};

export const PokemonCard: FC<PokemonCardProps> = ({ name, id, img }) => {
  const capsName = capitalize(name);

  return (
    <Link
      to={`${id}/${capsName}`}
      className="block rounded-lg shadow overflow-hidden h-48"
    >
      <div className="bg-blue-900 w-full h-28 p-4 flex justify-center">
        <div className="bg-white rounded-full p-4 w-32 h-32 border-1 border-slate-500 z-1">
          <img src={img} />
        </div>
      </div>
      <div className="relative text-center pt-10 h-20 bg-slate-100">
        <div className="absolute top-0 left-0 p-1 text-xs text-slate-800">
          #{leftPad0(id.toString(), 4)}
        </div>
        <span className="font-bold">{capsName}</span>
      </div>
    </Link>
  );
};
