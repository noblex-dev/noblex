import { AsyncLocalStorage } from "async_hooks";
import type { Request } from "express";

/**
 * Keys used to access specific data in the async local store.
 */
export const STORE_KEYS = {
  REQUEST: "request",
} as const;

/**
 * An AsyncLocalStorage instance scoped to a `Map` that stores per-request context data.
 */
export const asyncLocalStorage = new AsyncLocalStorage<Map<string, Request>>();

/**
 * Retrieves the current Express `Request` object from async local storage, if available.
 *
 * @returns The current request object or `undefined` if none is set.
 */
export function req(): Request | undefined {
  const store = asyncLocalStorage.getStore();
  return store?.get(STORE_KEYS.REQUEST);
}
