import { useEffect, useState, type FC } from "react";
import { useParams } from "react-router";
import { LoadingSpinner } from "../components/loading-spinner";
import { capitalize, leftPad0 } from "../utils";
import * as api from "../lib/api";
import type { PokemonDetailResult } from "shared-types/api-response";
import { StatsTable } from "./stats-table";
import { EvolutionChart } from "./evolution-chart";

const CIRCLE_SIZE = 64;
const START_ANGLE = (Math.PI * 7) / 4;
const SPACING_ANGLE = Math.PI / 5;

export const PokemonDetails: FC = () => {
  const [details, setDetails] = useState<PokemonDetailResult | null>(null);
  const [flavorTextIdx, setFlavorTextIdx] = useState<number>(0);
  const { id: idStr, name } = useParams();

  if (typeof idStr !== "string" || typeof name !== "string") {
    throw new Error("We done goofed. You may now panic.");
  }

  const id = parseInt(idStr, 10);

  useEffect(() => {
    setDetails(null);
    api.pokemonDetails(id).then((details) => {
      setDetails(details);
      setFlavorTextIdx(Math.floor(Math.random() * details.flavorTexts.length));
    });
  }, [id]);

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

  const flavorText = details.flavorTexts[flavorTextIdx];

  return (
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
        <pre className="border-l-4 p-4 mb-8 border-slate-300 whitespace-pre-wrap">
          {flavorText}
        </pre>
        <div className="my-8 flex justify-between gap-8">
          <div className="flex-1">
            <div className="mb-8">
              <p>
                <strong>Height:</strong> {details.height}
              </p>
              <p>
                <strong>Weight:</strong> {details.weight}
              </p>
            </div>
            <div className="flex gap-2 justify-start">
              {details.types.map((t) => (
                <img
                  key={t.id}
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/${t.id}.png`}
                  className="w-24"
                />
              ))}
            </div>
          </div>
          <StatsTable stats={details.stats} />
        </div>
        <h2 className="text-2xl">Evolution</h2>
        <EvolutionChart chain={details.evolutionChain} />
      </div>
    </div>
  );
};
