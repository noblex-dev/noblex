import type { Request, NextFunction, Response } from "express";

export type Middleware = ((
  req: Request,
  res: Response,
  next: NextFunction
) => void)[];

export type TMiddleware = {
  read?: Middleware;
  create?: Middleware;
  update?: Middleware;
  delete?: Middleware;
};
