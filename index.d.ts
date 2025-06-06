

// index.d.ts

declare module "noblex" {
  export interface Request {
    body?: any;
    params?: Record<string, string>;
    query?: Record<string, string | string[]>;
    headers: Record<string, string | string[] | undefined>;
    method?: string;
    url?: string;
    path?: string;
    originalUrl?: string;
    cookies?: Record<string, string>;
    signedCookies?: Record<string, string>;
    get: (header: string) => string | undefined;

   // [key: string]: any;
  }
  export interface Response {
    status: (code: number) => this;
    json: (data: any) => this;
    cookie: (name: string, value: string, options?: CookieOptions) => this;
    clearCookie?: (name: string, options?: CookieOptions) => this;
    setHeader?: (key: string, value: string) => void;

    [key: string]: any;
  }

  export interface NextFunction {
    (err?: any): void;
  }
  export  class App {
    constructor(config: {
      env: string;
      host: string;
      port: number ;
      allowOrigin: string[];
      db: {
        host: string;
        name: string;
        port: number;
        user: string;
        pass: string;
      };
      crud: {
        middleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
      };
    });
  }
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
  
  export interface Result<T = unknown> {
    status?: number;
    data: T;
    cookies?: [string, string, CookieOptions][];
  }
  export const app: any;

  export const controller: (
    method: (req: Request) => Promise<Result>
  ) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
}


export declare function Model<T>(name: string, schema: any, options?:any, crud?:any ): any;
