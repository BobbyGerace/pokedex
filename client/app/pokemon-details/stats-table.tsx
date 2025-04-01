import type { FC } from "react";
import type { Stat } from "shared-types/api-response";

type StatsTableProps = {
  stats: Stat[];
};

export const StatsTable: FC<StatsTableProps> = ({ stats }) => {
  return stats.map((stat) => (
    <div>
      <span>
        {stat.name}: {stat.value}
      </span>
      <div className="bg-gray-300 h-2">
        <div
          className="bg-blue-300 h-2"
          style={{ width: Math.floor((100 * stat.value) / 225) + "%" }}
        ></div>
      </div>
    </div>
  ));
};
