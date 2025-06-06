import { Request, Response, NextFunction } from "express";

interface ResponseError {
  status: number;
  code: string;
  title: string;
  message: string;
}

function getValidStatus(status: any): number {
  return typeof status === "number" && status >= 100 && status < 600
    ? status
    : 500;
}

export const errorHandler = (
  err: ResponseError,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const status = getValidStatus(err.status);
  const data: ResponseError =
    status === 500
      ? {
          status: status,
          code: "INTERNAL_SERVER_ERROR",
          title: "Internal Server Error",
          message: "Internal Server Error",
        }
      : {
          status,
          code: err.code || "ERROR",
          title: err.title || "Error",
          message: err.message || err.title || "Error",
        };

  res.json(data);
};
