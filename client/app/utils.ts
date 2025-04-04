export const capitalize = (str: string) =>
  str.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1));

export const leftPad0 = (str: string, n: number): string => {
  while (str.length < n) str = "0" + str;
  return str;
};
