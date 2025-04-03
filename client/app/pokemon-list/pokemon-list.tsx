import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { PokemonCard } from "./pokemon-card";
import type { PokemonListResult } from "shared-types/api-response";

type PokemonListProps = {
  data: PokemonListResult[];
};

export const PokemonList: FC<PokemonListProps> = ({ data }) => {
  const [pokemonList, setData] = useState<PokemonListResult[]>(data);
  const loadingRef = useRef(false);
  const [nextPageNum, setNextPageNum] = useState<number>(2);

  const getNextPage = useCallback(async () => {
    loadingRef.current = true;
    try {
      const res = await fetch(`/pokemon-list?page=${nextPageNum}`);
      const json = await res.json();
      setData((d) => d.concat(json));
      setNextPageNum((p) => p + 1);
    } finally {
      loadingRef.current = false;
    }
  }, [nextPageNum]);

  const handleScroll = useCallback(() => {
    const scrollThreshold = 200;
    const scrollPosition =
      window.innerHeight + document.documentElement.scrollTop;
    const bottomPosition = document.documentElement.offsetHeight;

    if (
      scrollPosition >= bottomPosition - scrollThreshold &&
      !loadingRef.current
    ) {
      getNextPage();
    }
  }, [getNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
      {pokemonList.map((p) => (
        <PokemonCard key={p.id} {...p} />
      ))}
    </div>
  );
};
