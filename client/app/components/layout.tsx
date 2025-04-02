import type { FC, PropsWithChildren } from "react";
import { Link } from "react-router";
import { Pokeball } from "./pokeball";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main>
      <nav className="bg-slate-100 h-16 p-4 mb-8 shadow flex justify-start gap-4 sticky top-0 z-10">
        <div>
          <Link to="/">
            <Pokeball className="h-8 " />
          </Link>
        </div>
        <Link to="/">
          <h1 className="text-3xl font-bold font-mono text-slate-900">
            Pokédex
          </h1>
        </Link>
      </nav>
      <div className="container mx-auto max-w-3xl">{children}</div>
    </main>
  );
};
