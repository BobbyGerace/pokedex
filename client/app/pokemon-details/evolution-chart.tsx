import type { FC } from "react";
import type { EvolutionChain } from "shared-types/api-response";
import { capitalize } from "../utils";
import { Link } from "react-router";

type EvolutionChartProps = {
  chain: EvolutionChain;
};

type ChartNodeProps =
  | { type: "pokemon"; name: string; image: string; id: number }
  | { type: "empty" }
  | { type: "lineage-i" }
  | { type: "lineage-l" }
  | { type: "lineage-t" }
  | { type: "continuation" };

export const EvolutionChart: FC<EvolutionChartProps> = ({ chain }) => {
  const rows = displayTree(chain);
  return (
    <table className="evolution">
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <ChartNode key={j} {...c} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ChartNode: FC<ChartNodeProps> = (props) => {
  switch (props.type) {
    case "pokemon":
      return <Pokemon name={props.name} image={props.image} id={props.id} />;
    case "empty":
      return <td></td>;
    case "lineage-i":
      return <LineageI />;
    case "lineage-t":
      return <LineageT />;
    case "lineage-l":
      return <LineageL />;
    case "continuation":
      return <Continuation />;
  }
};

const Pokemon: FC<{ name: string; image: string; id: number }> = (props) => {
  const link = `/${props.id}/${capitalize(props.name)}`;
  return (
    <td className="h-32 w-32 p-4 flex flex-col items-center justify-center">
      <Link to={link}>
        <img src={props.image} />
      </Link>
      <Link to={link}>{capitalize(props.name)}</Link>
    </td>
  );
};

const LineageT: FC = () => {
  const classes = [
    "relative", // base
    "before:content-[''] before:border-1 before:absolute before:border-slate-400", // vertical base
    "before:left-1/2 before:top-0 before:bottom-0", // vertical pos
    "after:content-[''] after:border-1 after:absolute after:border-slate-400", // horizontal base
    "after:top-1/2 after:right-0 after:left-1/2", // horizontal pos
  ];

  return <td className={classes.join(" ")}></td>;
};

const LineageI: FC = () => {
  const classes = [
    "relative", // base
    "before:content-[''] before:border-1 before:absolute before:border-slate-400", // vertical base
    "before:left-1/2 before:top-0 before:bottom-0", // vertical pos
  ];

  return <td className={classes.join(" ")}></td>;
};

const LineageL: FC = () => {
  const classes = [
    "relative", // base
    "before:content-[''] before:border-1 before:absolute before:border-slate-400", // vertical base
    "before:left-1/2 before:top-0 before:bottom-1/2", // vertical pos
    "after:content-[''] after:border-1 after:absolute after:border-slate-400", // horizontal base
    "after:top-1/2 after:right-0 after:left-1/2", // horizontal pos
  ];

  return <td className={classes.join(" ")}></td>;
};

const Continuation: FC = () => {
  const classes = [
    "relative w-16", // base
    "after:content-[''] after:border-1 after:absolute after:border-slate-400", // horizontal base
    "after:top-1/2 after:right-0 after:left-0", // horizontal pos
  ];

  return <td className={classes.join(" ")}></td>;
};

// Recursively generate an evolution tree similar to a file structure
const displayTree = (chain: EvolutionChain): ChartNodeProps[][] => {
  const tree: ChartNodeProps[][] = [
    [{ type: "pokemon", name: chain.name, image: chain.img, id: chain.id }],
  ];

  if (chain.evolvesTo.length === 0) return tree;

  chain.evolvesTo.forEach((next, i) => {
    const isLast = chain.evolvesTo.length - 1 === i;
    const nextTree = displayTree(next);
    if (isLast && i !== 0) {
      tree.push([{ type: "lineage-l" }]);
    } else if (i !== 0) {
      tree.push([{ type: "lineage-t" }]);
    }
    nextTree.forEach((row, j) => {
      if (isLast && j !== 0) {
        tree.push([{ type: "empty" }, { type: "empty" }]);
      } else if (j !== 0) {
        tree.push([{ type: "lineage-i" }, { type: "empty" }]);
      } else {
        tree[tree.length - 1].push({ type: "continuation" });
      }
      tree[tree.length - 1].push(...row);
    });
  });

  return tree;
};
