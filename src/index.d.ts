import { CookieOptions } from "express";

declare global {
  type Result<T = unknown> = {
    status?: number;
    data: T | null;
    cookies?: [string, string, CookieOptions][];
  };
}

export {};
