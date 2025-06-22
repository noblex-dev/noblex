import type { Request, Response, NextFunction } from "express";

/**
 * Routes wrapper helper for async request handlers.
 *
 * @template T - The expected shape of the response data.
 * @param method Async function that receives `req` and returns data of type `T`.
 * @returns Express middleware function.
 */
export const controller = <T extends Record<string, any> = {}>(
  method: (req: Request) => Promise<T>
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await method(req);
      // Merge data into res.locals without overwriting the entire object
      Object.assign(res.locals, { _noblex: true, data });
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default controller;
