import { Request, Response, NextFunction } from "express";
import Method from "./models/methods.model.js";
import { Model as MongooseModel, HydratedDocument, Document } from "mongoose";
import type { CrudRoute } from "./controllers/crud.controller.js";


export interface MethodContext<T = any> {
  model: MongooseModel<HydratedDocument<T>>;
  req: Request;
  [key: string]: any;
}
export type CustomMethod<T = any> = (
  this: MethodContext<T>,
  ...args: any[]
) => Promise<any>;

export type MethodInstance<T = any, M = CustomMethod<T>> = MethodContext<T> & {
  [K in keyof M]: M[K];
};

export interface RouteHandlerContext<T = any> {
  method: MethodInstance<T>;
}

export interface AppConfig<T extends Document> {
  host: string;
  port: number;
  set?: [string, any][];
  middlewares?: {
    static: ((req: Request, res: Response, next: NextFunction) => void)[];
    dynamic: ((req: Request, res: Response, next: NextFunction) => void)[];
  };
  handlers: {
    response: (req: Request, res: Response, next: NextFunction) => void;
    notFound: (req: Request, res: Response, next: NextFunction) => void;
    error: (err: any, req: Request, res: Response, next: NextFunction) => void;
  };
  crud?: {
    models: (Method<any> | [Method<any>, string])[];
    routes: CrudRoute<T>[];
  };
}