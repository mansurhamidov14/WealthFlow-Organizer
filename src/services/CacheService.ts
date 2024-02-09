
import { getInitialCacheData } from ".";
import { CachedData } from "./types";

class CacheService {
  data: CachedData;
  private localStorageAccessKey = "wfoAppCache";

  constructor() {
    const cached = localStorage.getItem(this.localStorageAccessKey);
    this.data = (cached ? JSON.parse(cached) : getInitialCacheData()) as CachedData;
  }

  clear() {
    this.write(getInitialCacheData());
  }

  write(data: CachedData) {
    console.log("new Data", data);
    this.data = data;
    localStorage.setItem(this.localStorageAccessKey, JSON.stringify(data))
  }

  writeToSection<S extends keyof CachedData, D extends CachedData[S]>(section: S, data: D) {
    this.data[section] = data;
    this.write(this.data);
  }

  getCacheData<K extends keyof CachedData>(key: K, defaultValue: CachedData[K]): CachedData[K] {
    return this.data[key] ?? defaultValue;
  }
}

export const cacheService = new CacheService();
