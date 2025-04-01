import type { Context } from "hono";

export class ParamCache<T> {
  private cache: Record<string, T> = {};

  // This is horrible for a number of reasons, but hey, it's not
  // like we're gonna ship it to prod
  private createKey(c: Context): string {
    const queryParams = c.req.param();
    const sortedStrings = Object.entries(queryParams)
      .map(([k, v]) => `${k}=${v}`)
      .sort();

    return sortedStrings.join("&");
  }

  async cachedValue(c: Context, fn: () => Promise<T>) {
    const key = this.createKey(c);

    if (this.cache.hasOwnProperty(key)) return Promise.resolve(this.cache[key]);

    const value = await fn();

    this.cache[key] = value;

    return value;
  }
}
