import type { FC } from "react";
import type { EvolutionChain } from "shared-types/api-response";

type EvolutionChartProps = {
  chain: EvolutionChain;
};

export const EvolutionChart: FC<EvolutionChartProps> = ({ chain }) => {
  const rows = rotateTree(chain);
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
      return (
        <td className="p-4">
          <img src={props.image} />
          {props.name}
        </td>
      );
    case "empty":
      return <td></td>;
    case "newLineage":
      const className = props.last ? "new-lineage" : "new-lineage-cont";
      return <td className={className}></td>;
    case "continuation":
      return <td className="continuation w-16"></td>;
  }
};

type ChartNodeProps =
  | { type: "pokemon"; name: string; image: string }
  | { type: "empty" }
  | { type: "newLineage"; last: boolean }
  | { type: "continuation" };

// Flip this baby on its side so we can display it in a LTR table
const rotateTree = (chain: EvolutionChain) => {
  const rows: ChartNodeProps[][] = [[]];
  const addRows = (ch: EvolutionChain, depth = 0) => {
    const lastRow = rows[rows.length - 1];
    lastRow.push({
      type: "pokemon",
      name: ch.name,
      image: ch.img,
    });

    ch.evolvesTo.forEach((next, i) => {
      if (i !== 0) {
        rows.push(new Array(depth).fill({ type: "empty" }));
        rows[rows.length - 1].push({
          type: "newLineage",
          last: ch.evolvesTo.length - 1 == i,
        });
        rows[rows.length - 1].push({ type: "continuation" });
      } else {
        rows[rows.length - 1].push({ type: "continuation" });
      }
      addRows(next, depth + 1);
    });
  };

  addRows(chain);

  return rows;
};
