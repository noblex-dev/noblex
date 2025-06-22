import type { RequestHandler, Express, Request } from "express";
import { controller } from "./core.controller.js";

type ApiMethod =
  | "get"
  | "post"
  | "patch"
  | "put"
  | "delete"
  | "head"
  | "options";
type Constructor<T = any> = new (...args: any[]) => T;
interface RouteEntry {
  appName: string;
  target: Function;
  path: string;
  context: ClassDecoratorContext;
  middlewares: RequestHandler[];
  routes: ControllerEntry[];
}

interface ControllerEntry {
  control: Function;
  methodName: string | symbol;
  httpMethod: ApiMethod;
  subPath: string;
  middlewares: RequestHandler[];
}

/**
 * Combines middlewares from config, controller, and method, flattening and filtering out falsy values.
 */
function getMiddlewares(
  cfgMiddlewares: RequestHandler[] = [],
  controllerMiddlewares: RequestHandler[] = [],
  methodMiddlewares: RequestHandler[] = []
): RequestHandler[] {
  if (Array.isArray(methodMiddlewares[0])) {
    return methodMiddlewares.flat(Infinity).filter(Boolean);
  }
  if (Array.isArray(controllerMiddlewares[0])) {
    return [...controllerMiddlewares, ...methodMiddlewares]
      .flat(Infinity)
      .filter(Boolean);
  }
  return [...cfgMiddlewares, ...controllerMiddlewares, ...methodMiddlewares]
    .flat(Infinity)
    .filter(Boolean);
}

/** Registry of all routes, keyed by appName */
export const routesRegistry: Record<string, RouteEntry[]> = {};
/** Temporary storage for controller route definitions */
export let controllerRegistry: ControllerEntry[] = [];

/**
 * Decorator to register routes for a specific app and path.
 */
export function Route(
  arg1: string,
  arg2?: string | RequestHandler,
  ...rest: RequestHandler[]
) {
  let appName = "default";
  let path = "";
  let middlewares: RequestHandler[] = [];

  if (typeof arg2 === "string") {
    path = arg1;
    appName = arg2;
    middlewares = rest;
  } else {
    path = arg1;
    middlewares = [arg2, ...rest].filter(Boolean) as RequestHandler[];
  }

  return function (target: Function, context: ClassDecoratorContext) {
    if (!routesRegistry[appName]) {
      routesRegistry[appName] = [];
    }
    routesRegistry[appName].push({
      appName,
      target,
      path,
      context,
      middlewares,
      routes: controllerRegistry,
    });
    controllerRegistry = [];
  };
}

/**
 * Decorator factory to create HTTP method decorators like Get, Post, etc.
 */
export function createHttpApi(
  method: ApiMethod,
  arg1: string,
  ...rest: RequestHandler[]
) {
  let path = arg1;
  let middlewares: RequestHandler[] = rest;

  return function (target: Function, context: ClassMethodDecoratorContext) {
    const control = target.constructor;
    controllerRegistry.push({
      control,
      methodName: context.name,
      httpMethod: method,
      subPath: path,
      middlewares,
    });
  };
}

// Exporting method decorators
export const Get = (path: string, ...middlewares: RequestHandler[]) =>
  createHttpApi("get", path, ...middlewares);
export const Post = (path: string, ...middlewares: RequestHandler[]) =>
  createHttpApi("post", path, ...middlewares);
export const Patch = (path: string, ...middlewares: RequestHandler[]) =>
  createHttpApi("patch", path, ...middlewares);
export const Put = (path: string, ...middlewares: RequestHandler[]) =>
  createHttpApi("put", path, ...middlewares);
export const Delete = (path: string, ...middlewares: RequestHandler[]) =>
  createHttpApi("delete", path, ...middlewares);
export const Head = (path: string, ...middlewares: RequestHandler[]) =>
  createHttpApi("head", path, ...middlewares);
export const Options = (path: string, ...middlewares: RequestHandler[]) =>
  createHttpApi("options", path, ...middlewares);

/**
 * Attach all routes from registry to an Express app instance.
 */
export const createRoutes = async (
  app: Express,
  cfg: { middlewares?: { dynamic?: RequestHandler[] } }, // Temporary guess of AppConfig shape
  appName: string = "default"
) => {
  routesRegistry[appName]?.forEach((ctl) => {
    ctl.routes.forEach((obj) => {
      const fullPath = ((ctl.path || "") + (obj.subPath || "")).replace(
        /\/{2,}/g,
        "/"
      );
      const httpMethod = obj.httpMethod.toLowerCase() as keyof Express;

      app[httpMethod](
        fullPath,
        ...getMiddlewares(
          cfg.middlewares?.dynamic,
          ctl.middlewares || [],
          obj.middlewares || []
        ),
        controller(async (req: Request) => {
          const instance = new (ctl.target as Constructor)();
          const methodName = obj.methodName;
          if (
            typeof methodName !== "string" &&
            typeof methodName !== "symbol"
          ) {
            return;
          }
          const handler = instance[methodName].bind(instance);
          return handler(req);
        })
      );
    });
  });
};
