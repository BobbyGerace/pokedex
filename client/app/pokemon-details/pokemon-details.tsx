import { useEffect, useState, type FC } from "react";
import { useParams } from "react-router";
import { LoadingSpinner } from "../components/loading-spinner";
import { capitalize, leftPad0 } from "../utils";
import * as api from "../lib/api";
import type { PokemonDetailResult } from "shared-types/api-response";

const CIRCLE_SIZE = 64;
const START_ANGLE = (Math.PI * 7) / 4;
const SPACING_ANGLE = Math.PI / 5;

export const PokemonDetails: FC = () => {
  const [details, setDetails] = useState<PokemonDetailResult | null>(null);
  const { id: idStr, name } = useParams();

  if (typeof idStr !== "string" || typeof name !== "string") {
    throw new Error("We done goofed. You may now panic.");
  }

  const id = parseInt(idStr, 10);

  useEffect(() => {
    api.pokemonDetails(id).then(setDetails);
  }, []);

  if (details == null) return <LoadingSpinner />;

  const startAngle =
    START_ANGLE - (SPACING_ANGLE * (details.types.length - 1)) / 2;
  const offsetRadius = CIRCLE_SIZE - 24;
  const typeCircles = details.types
    .map((type, i) => {
      const offsetAngle = startAngle + SPACING_ANGLE * i;
      return (
        <div
          key={type.id}
          title={type.name}
          className="rounded-full bg-white border-1 absolute w-8 h-8 flex justify-center items-center text-center cursor-default"
          style={{
            top: CIRCLE_SIZE - offsetRadius * Math.sin(offsetAngle) + "px",
            left: CIRCLE_SIZE + offsetRadius * Math.cos(offsetAngle) + "px",
          }}
        >
          {type.icon}
        </div>
      );
    })
    // Make sure they overlap correctly
    .reverse();

  return (
    <div className="container mx-auto">
      <div className="block rounded-lg shadow overflow-hidden">
        <div className="bg-blue-900 w-full p-4 relative text-center">
          <h1 className="font-mono text-5xl text-white mb-2">
            {capitalize(details.name)}{" "}
            <span className="text-2xl text-slate-400">
              #{leftPad0(id.toString(), 4)}
            </span>
          </h1>
          <div className="bg-white rounded-full h-32 p-4 border-1 border-slate-500 absolute z-1 left-4 top-2">
            <img src={details.img} />
            {typeCircles}
          </div>
        </div>
        <div className="relative pt-10 bg-slate-100 p-8 pt-16">
          <h2 className="text-2xl">Stats</h2>
          <table>
            <tbody>
              {details.stats.map((stat) => (
                <tr>
                  <td className="p-4 border-1">{stat.name}</td>
                  <td className="p-4 border-1">{stat.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
