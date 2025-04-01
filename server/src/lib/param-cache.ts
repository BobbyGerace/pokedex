import type { Context } from "hono";
import { logger } from "hono/logger";

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

    if (this.cache.hasOwnProperty(key)) {
      console.log(`Cache hit! ${c.req.url}`);
      return Promise.resolve(this.cache[key]);
    }
    console.log(`Cache miss! ${c.req.url}`);

    const value = await fn();

    this.cache[key] = value;

    return value;
  }
}
