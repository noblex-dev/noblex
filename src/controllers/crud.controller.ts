import { Request, Router, Express, RequestHandler } from "express";
import { Document } from "mongoose";
import controller from "./core.controller.js";
import Method from "../models/methods.model.js";
type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "options"
  | "head";

/**
 * Defines a CRUD route configuration.
 *
 * @template T - The Mongoose Document type this route operates on.
 */
export interface CrudRoute<T extends Document> {
  /** HTTP method to use for the route */
  method: HttpMethod;
  /** Route path relative to collection base path */
  path: string;
  /** Optional list of collection names to ignore this route */
  ignore?: string[];
  /** Middleware(s) to apply on this route */
  middleware?: RequestHandler | RequestHandler[];
  /**
   * Async handler function for this route.
   * The function's `this` is bound to the CRUD instance.
   *
   * @param req - Express request object
   * @returns Promise resolving to response data of type T
   */
  response: (this: CRUD<T>, req: Request) => Promise<T>;
}

/**
 * Configuration object for CRUD controller.
 *
 * @template T - The Mongoose Document type the CRUD operates on.
 */
type Config<T extends Document> = {
  /** Array of CRUD route configurations */
  routes: CrudRoute<T>[];
  /** Array of dynamic middlewares to apply to all routes */
  dynamicMiddlewares: RequestHandler[];
};

/**
 * Generic CRUD controller class.
 *
 * Manages Express routes for a Mongoose model with configurable
 * routes, middleware, and response handlers.
 *
 * @template T - The Mongoose Document type this CRUD controller manages.
 */
class CRUD<T extends Document> {
  protected method: Method<T>;
  protected router = Router();
  protected api?: string;
  protected app: Express;

  /**
   * Create a new CRUD controller.
   *
   * @param app - Express application instance
   * @param method - Method instance wrapping the Mongoose model
   * @param cfg - CRUD configuration object with routes and middlewares
   */
  constructor(app: Express, method: Method<T>, cfg: Config<T>, api?: string) {
    this.method = method;
    this.app = app;
    this.api = api;
    const collectionName = method.model.collection.name;
    this.app.use(
      `/${this.api ?? collectionName}`.replace(/\/{2,}/g, "/"),
      this.router
    );

    const crudRoutes: CrudRoute<T>[] = cfg.routes || [];
    for (const routeDef of crudRoutes) {
      if (routeDef?.ignore?.includes(collectionName)) {
        continue;
      }
      this.router[routeDef.method](
        routeDef.path,
        ...((Array.isArray(routeDef.middleware)
          ? routeDef.middleware
          : [...cfg.dynamicMiddlewares, routeDef.middleware]
        ).filter(Boolean) as RequestHandler[]),
        controller(routeDef.response.bind(this))
      );
    }
  }
}

/**
 * Helper factory function to create a CRUD controller instance.
 *
 * @template T - The Mongoose Document type this CRUD controller manages.
 * @param app - Express application instance
 * @param methodInstance - Instance of Method wrapping Mongoose model
 * @param cfg - CRUD configuration object with routes and middlewares
 * @returns A new CRUD controller instance
 */
export const Crud = <T extends Document>(
  app: Express,
  methodInstance: Method<T> | [Method<T>, string],
  cfg: Config<T>
) => {
  if (Array.isArray(methodInstance)) {
    return new CRUD<T>(app, methodInstance[0], cfg, methodInstance[1]);
  } else {
    return new CRUD<T>(app, methodInstance, cfg);
  }
};

export default CRUD;
