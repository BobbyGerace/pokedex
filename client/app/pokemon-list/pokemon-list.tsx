import { useEffect, useReducer, useRef, type FC } from "react";
import { PokemonCard } from "./pokemon-card";
import type { PokemonListResult } from "shared-types/api-response";

type PokemonListProps = {
  data: PokemonListResult[];
};

type ReducerState = {
  data: PokemonListResult[];
  loading: boolean;
  page: number;
  search: string;
};

type ReducerActions =
  | { type: "load-more" }
  | { type: "search-change"; value: string }
  | { type: "new-search" }
  | { type: "data-received"; data: PokemonListResult[] };

const reducer = (prev: ReducerState, action: ReducerActions): ReducerState => {
  switch (action.type) {
    case "load-more":
      return { ...prev, loading: true, page: prev.page + 1 };
    case "search-change":
      return {
        ...prev,
        search: action.value,
      };
    case "new-search":
      return {
        ...prev,
        loading: true,
        page: 1,
        data: [],
      };
    case "data-received":
      return {
        ...prev,
        loading: false,
        data: prev.page === 1 ? action.data : prev.data.concat(action.data),
      };
  }
};

export const PokemonList: FC<PokemonListProps> = ({ data }) => {
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [state, dispatch] = useReducer(reducer, {
    data,
    loading: false,
    page: 1,
    search: "",
  });

  const fetchPokemon = async (page: number, search: string) => {
    clearTimeout(debounceTimeoutRef.current);
    const searchStr = encodeURIComponent(search.trim());
    const res = await fetch(`/pokemon-list?page=${page}&search=${searchStr}`);
    const json = await res.json();
    dispatch({ type: "data-received", data: json });
  };

  const handleScroll = () => {
    const scrollThreshold = 200;
    const scrollPosition =
      window.innerHeight + document.documentElement.scrollTop;
    const bottomPosition = document.documentElement.offsetHeight;

    if (scrollPosition >= bottomPosition - scrollThreshold && !state.loading) {
      dispatch({ type: "load-more" });
      fetchPokemon(state.page + 1, state.search);
    }
  };

  const handleSearchChange = (value: string) => {
    clearTimeout(debounceTimeoutRef.current);
    dispatch({ type: "search-change", value });
    debounceTimeoutRef.current = setTimeout(() => {
      fetchPokemon(1, value);
    }, 750);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="text-center">
      <input
        className="rounded-full py-2 px-4 mb-8 border-1 border-slate-400"
        type="text"
        placeholder="Search by name or id"
        value={state.search}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {state.data.map((p) => (
          <PokemonCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
};
