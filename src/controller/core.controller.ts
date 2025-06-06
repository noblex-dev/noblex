import type { Request, Response, NextFunction, CookieOptions } from "express";

export const controller = (method: (req: Request) => Promise<Result>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { status = 200, data, cookies = [] } = await method(req);
      cookies.forEach((cookie: [string, string, CookieOptions]) => {
        res.cookie(...cookie);
      });
      res.status(status).json(data);
    } catch (err) {
      next(err);
    }
  };
};

export default controller;
