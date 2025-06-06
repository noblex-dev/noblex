export interface CookieOptions {
  domain?: string;
  encode?: (val: string) => string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: boolean | "lax" | "strict" | "none";
  secure?: boolean;
  signed?: boolean;
}

export type Result<T = unknown> = {
  status?: number;
  data: T | null;
  cookies?: [string, string, CookieOptions][];
};
