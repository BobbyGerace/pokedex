export const capitalize = (str: string) => {
  const words = str.split(" ");
  return words.map((w) => w[0].toUpperCase() + w.slice(1)).join("");
};

export const leftPad0 = (str: string, n: number): string => {
  while (str.length < n) str = "0" + str;
  return str;
};
