import fs from "fs";

const OUTPUT = "./pokemon.json";

const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");

const json = await res.json();

console.log(`Fetched ${json.results.length} pokemon`);

const formatted = json.results.map((p) => ({
  name: p.name,
  id: parseInt(p.url.match(/pokemon\/(\d+)/)[1]),
}));

fs.writeFileSync(OUTPUT, JSON.stringify(formatted));

console.log(`Saved to ${OUTPUT}`);
