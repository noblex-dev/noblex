import { CookieOptions } from "express";

export type Result<T = unknown> = {
  status?: number;
  data: T | null;
  cookies?: [string, string, CookieOptions][];
};
