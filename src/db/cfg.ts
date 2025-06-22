import type { DBConfig } from "./types.ts";

const cfg: Record<string, DBConfig> = {};

/**
 * Stores a named DB configuration object.
 *
 * @param key - A unique name for the DB config.
 * @param value - The DB configuration to store.
 */
export function setCfg(key: string, value: DBConfig): void {
  cfg[key] = value;
}

/**
 * Retrieves a DB configuration by key.
 *
 * @typeParam T - An optional extension of `DBConfig` to infer custom properties.
 * @param key - The name of the config to retrieve.
 * @returns The requested DB config, typed as `T`.
 */
export function getCfg<T extends DBConfig = DBConfig>(key: string): T {
  return cfg[key] as T;
}

/**
 * Returns a shallow clone of all registered DB configs.
 *
 * @returns A record of all stored DB configs.
 */
export function getAllCfg(): Record<string, DBConfig> {
  return { ...cfg };
}
