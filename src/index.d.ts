import http from "node:http";
import type { Document } from "mongoose";
//import Method from "./models/methods.model.js";

export type { Response, NextFunction } from "express";
import type { Express, RequestHandler, NextFunction } from "express";
import type {
  SchemaTypeOptions,
  SchemaOptions,
  Model as MongooseModel,
  SchemaDefinition,
  HydratedDocument,
} from "mongoose";
export declare class Method<T> {
  readonly model: MongooseModel<HydratedDocument<T>>;
}
export { Types } from "mongoose";
export interface Request {
  originalUrl: string;
  headers: Record<string, any>;
  method: string;
  url?: string;
  body?: any;
  params?: Record<string, any>;
  query?: Record<string, any>;
  [key: string]: any;
}

export declare function Model<T extends Record<string, any>>(
  name: string,
  schema: SchemaDefinition,
  options?: SchemaOptions
): Method<T>;

export type RouteMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
/**
 * Class decorator to associate a hooks class with a Mongoose model.
 *
 * This decorator marks the class as a collection of lifecycle hooks for the specified model.
 * The hooks will be registered on the model identified by `modelName`.
 *
 * @param modelName - The name of the Mongoose model to bind these hooks to.
 * @returns A class decorator function.
 *
 * @example
 * ```ts
 * @Hooks("users")
 * class UserHooks {
 *   // pre/post hooks here
 * }
 * ```
 */

export type MongooseHook =
  | "validate"
  | "save"
  | "updateOne"
  | "deleteOne"
  | "find"
  | "findOne"
  | "findOneAndUpdate"
  | "findOneAndDelete"
  | "updateMany"
  | "deleteMany"
  | "countDocuments"
  | "estimatedDocumentCount"
  | "replaceOne"
  | "findOneAndReplace";

export function Hooks(modelName: string, dbName?: string): ClassDecorator;

/**
 * Method decorator to define a pre-hook for a specific Mongoose operation.
 *
 * This hook runs before the specified Mongoose method is executed on the model.
 * The decorated method receives the request context and any other parameters you define.
 *
 * @param method - The Mongoose method name to hook into (e.g., "find", "save", "updateOne").
 * @returns A method decorator function.
 *
 * @example
 * ```ts
 * @PreHook("save")
 * static beforeSave(req: Request, ctx: any) {
 *   // logic before save
 * }
 * ```
 */
export function PreHook(
  ...methods: MongooseHook[]
): (target: any, context: ClassMethodDecoratorContext) => void;

/**
 * Method decorator to define a post-hook for a specific Mongoose operation.
 *
 * This hook runs after the specified Mongoose method has completed.
 * The decorated method receives the request context and the operation result.
 *
 * @param method - The Mongoose method name to hook into (e.g., "find", "save", "updateOne").
 * @returns A method decorator function.
 *
 * @example
 * ```ts
 * @PostHook("find")
 * static afterFind(req: Request, result: any[]) {
 *   // logic after find
 * }
 * ```
 */
export function PostHook(
  ...methods: MongooseHook[]
): (target: any, context: ClassMethodDecoratorContext) => void;

/**
 * Method decorator to transform the JSON output of Mongoose documents.
 *
 * Use this hook to modify the output returned by `.toJSON()` before it is sent in responses.
 * Typically used to remove sensitive or unwanted fields.
 *
 * The decorated method receives the request, the original document, and the JSON result object.
 *
 * @returns A method decorator function.
 *
 * @example
 * ```ts
 * @JsonHook()
 * static transformResponse(req: Request, doc: any, ret: any) {
 *   delete ret.password;
 *   return ret;
 * }
 * ```
 */
export function JsonHook(): (
  target: any,
  context: ClassMethodDecoratorContext
) => void;

export interface MethodDecoratorFactory {
  (path: string, ...middlewares: RequestHandler[]): MethodDecorator;
  (path: string, middlewares: RequestHandler[]): MethodDecorator;
}

/**
 * HTTP method decorator factory.
 *
 * @param path - Route path string appended to the Controller's base path.
 * @param middlewares - One or more middleware functions.
 *                      Passing multiple handlers appends them to global and controller middlewares.
 *                      Passing an array overwrites global dynamic and controller middlewares.
 *
 * Usage:
 * ```ts
 * @Get('/users', mw1, mw2)
 * async getUsers() {}
 *
 * @Get('/users', [mw1, mw2])
 * async createUser() {}
 * ```
 */

export declare function Get(
  path: string,
  ...middlewares: (RouteMiddleware | RouteMiddleware[])[]
): (target: object, context: ClassMethodDecoratorContext) => void;
/**
 * HTTP method decorator factory.
 *
 * @param path - Route path string appended to the Controller's base path.
 * @param middlewares - One or more middleware functions.
 *                      Passing multiple handlers appends them to global and controller middlewares.
 *                      Passing an array overwrites global dynamic and controller middlewares.
 *
 * Usage:
 * ```ts
 * @Post('/users', mw1, mw2)
 * async getUsers() {}
 *
 * @Post('/users', [mw1, mw2])
 * async createUser() {}
 * ```
 */
export declare function Post(
  path: string,
  ...middlewares: (RouteMiddleware | RouteMiddleware[])[]
): (target: object, context: ClassMethodDecoratorContext) => void;

/**
 * HTTP method decorator factory.
 *
 * @param path - Route path string appended to the Controller's base path.
 * @param middlewares - One or more middleware functions.
 *                      Passing multiple handlers appends them to global and controller middlewares.
 *                      Passing an array overwrites global dynamic and controller middlewares.
 *
 * Usage:
 * ```ts
 * @Patch('/users', mw1, mw2)
 * async getUsers() {}
 *
 * @Patch('/users', [mw1, mw2])
 * async createUser() {}
 * ```
 */
export declare function Patch(
  path: string,
  ...middlewares: (RouteMiddleware | RouteMiddleware[])[]
): (target: object, context: ClassMethodDecoratorContext) => void;

/**
 * HTTP method decorator factory.
 *
 * @param path - Route path string appended to the Controller's base path.
 * @param middlewares - One or more middleware functions.
 *                      Passing multiple handlers appends them to global and controller middlewares.
 *                      Passing an array overwrites global dynamic and controller middlewares.
 *
 * Usage:
 * ```ts
 * @Delete('/users', mw1, mw2)
 * async getUsers() {}
 *
 * @Delete('/users', [mw1, mw2])
 * async createUser() {}
 * ```
 */
export declare function Delete(
  path: string,
  ...middlewares: (RouteMiddleware | RouteMiddleware[])[]
): (target: object, context: ClassMethodDecoratorContext) => void;

/**
 * HTTP method decorator factory.
 *
 * @param path - Route path string appended to the Controller's base path.
 * @param middlewares - One or more middleware functions.
 *                      Passing multiple handlers appends them to global and controller middlewares.
 *                      Passing an array overwrites global dynamic and controller middlewares.
 *
 * Usage:
 * ```ts
 * @Put('/users', mw1, mw2)
 * async getUsers() {}
 *
 * @Put('/users', [mw1, mw2])
 * async createUser() {}
 * ```
 */
export declare function Put(
  path: string,
  ...middlewares: (RouteMiddleware | RouteMiddleware[])[]
): (target: object, context: ClassMethodDecoratorContext) => void;

export interface RouteDecorator {
  (path: string, ...handlers: RequestHandler[]): ClassDecorator;
  (path: string, handlers: RequestHandler[]): ClassDecorator;
}
export type ControllerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

/**
 * Route decorator factory.
 *
 * @param path - The starting route path (string).
 * @param middlewares - One or more middleware functions appended to dynamic middlewares.
 *                      If middlewares are passed as an array, they overwrite the dynamic global middlewares.
 *
 * Usage:
 * ```ts
 * @Route('/users', middleware1, middleware2)
 * class UserController {}
 *
 * @Route('/users', [middleware1, middleware2])
 * class UserController {}
 * ```
 */

export declare function Route(
  path: string,
  appOrMiddleware: string | ControllerMiddleware | ControllerMiddleware[],
  ...middlewares: (ControllerMiddleware | ControllerMiddleware[])[]
): ClassDecorator;
/**
 * Route decorator factory.
 *
 * @param path - The starting route path (string).
 * @param middlewares - One or more middleware functions appended to dynamic global middlewares.
 *                      If middlewares are passed as an array, they overwrite the dynamic middlewares.
 *
 * Usage:
 * ```ts
 * @Controller('/users', middleware1, middleware2)
 * class UserController {}
 *
 * @Controller('/users', [middleware1, middleware2])
 * class UserController {}
 * ```
 */
export declare function Controller(
  path: string,
  appOrMiddleware: string | ControllerMiddleware | ControllerMiddleware[],
  ...middlewares: (ControllerMiddleware | ControllerMiddleware[])[]
): ClassDecorator;

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

export interface Parser {
  json: (options?: any) => RequestHandler;
  urlencoded: (options?: any) => RequestHandler;
}

export const parser: Parser;
/**
 * App configuration interface for full typing and reuse.
 */
export interface AppConfig<T> {
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
    routes: {
      method: "get" | "post" | "patch" | "put" | "delete";
      path: string;
      ignore: string[];
      middleware?:
        | ((req: Request, res: Response, next: NextFunction) => void)
        | ((req: Request, res: Response, next: NextFunction) => void)[];
      response(this: RouteHandlerContext<T>, req: Request): Promise<any> | any;
    }[];
  };
}

export declare class App<T extends Document = Document> {
  private cfg: AppConfig<T>;
  private expressApp;
  private nodeServer;
  private name;

  /**
   * Creates an instance of the Noblex App.
   *
   * @param cfg - Configuration object for the app instance.
   *
   * @param cfg.host - The host address to bind the server to.
   * @param cfg.port - The port number to listen on.
   *
   * @param cfg.middlewares - Global middleware groups.
   * @param cfg.middlewares.static - Array of static global middlewares (cannot be overridden).
   * @param cfg.middlewares.dynamic - Array of dynamic global middlewares (cannot be overridden).
   *
   * @param cfg.handlers - Built-in handler groups.
   * @param cfg.handlers.response - Array of response handler middlewares executed before sending the response.
   * These handlers must send the final response using the data stored in `res.locals.data`.
   * @param cfg.handlers.notFound - Array of middlewares to handle 404 Not Found routes.
   * @param cfg.handlers.error - Array of error handler middlewares (executed on thrown errors).
   *
   * @param cfg.crud - Configuration for CRUD-enabled models and custom routes.
   * @param cfg.crud.models - Array of models to register for CRUD.
   * Each item can be:
   *  - A single model (e.g., `UserModel`) which maps to a route like `/users`
   *  - A tuple `[Model, customPath]` to override the route name
   *    Example: `[UserModel, [SuperClientModel, '/super-clients']]` will register `/users` and `/super-clients`.
   *
   * @param cfg.crud.routes - Array of additional custom CRUD-like routes.
   * Each route object can define:
   *  - `method`: HTTP method (e.g., "get", "post")
   *  - `path`: Route path that will be appended to the model's base path
   *    (e.g., "/" results in `/users`, or `/custom` for a custom route like `/users/custom`)
   *  - `ignore`: Array of model names to skip this route for
   *  - `middleware`: Array of route-specific middlewares
   *  - `response`: Async function that returns response data
   *
   * @param name - Optional. A unique name for this app instance.
   * Only needed if you are creating multiple app instances.
   * See the **Advanced** section in the docs for more details.
   */
  constructor(cfg: AppConfig<T>, name?: string);

  private middlewares;
  private response;
  private init;

  get app(): Express;
  get server(): http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;
}

/**
 * Configuration object for the database connection.
 */
export interface DBConfig<T> {
  /**
   * MongoDB connection URI.
   */
  uri: string;

  /**
   * Default schema fields automatically included in all models.
   */
  defaults?: Record<string, SchemaTypeOptions<any>>;

  /**
   * Default schema options (e.g., timestamps, versionKey).
   */
  options?: SchemaOptions;

  /**
   * Custom shared methods available on all models.
   */
  methods?: {
    [key: string]: CustomMethod<T>;
  };
}

/**
 * Initializes the default MongoDB connection using Mongoose and stores configuration metadata.
 *
 * - Connects to MongoDB using the provided URI.
 * - Stores configuration under the `"default"` namespace using `setCfg`.
 * - Supports default schema fields and shared model methods.
 *
 * @param cfg - Database configuration object.
 *
 * @param cfg.uri - MongoDB connection URI string.
 *
 * @param cfg.defaults - (Optional) Shared schema fields automatically applied to all models.
 * Example: audit fields like `createdBy`, `updatedBy`, `deleted`, etc.
 *
 * @param cfg.options - (Optional) Schema-level options to apply to all models.
 * Example: `{ timestamps: true }` for automatic createdAt/updatedAt fields.
 *
 * @param cfg.methods - (Optional) Shared instance or static methods to apply to all models.
 * Each method is added to the model prototype and can access the request context via `this.req`.
 *
 * @returns A promise that resolves when the connection is successfully established.
 *
 * @example
 * await defaultDB({
 *   uri: 'mongodb://localhost:27017/mydb',
 *   defaults: {
 *     createdBy: { type: String },
 *     deleted: { type: Boolean, default: false },
 *   },
 *   options: {
 *     timestamps: true,
 *   },
 *   methods: {
 *     finds: function(filter = {}, fields = {}, options = {}) {
 *       return this.model.find(filter, fields, options);
 *     }
 *   }
 * });
 */

export function defaultDB<T>(cfg: DBConfig<T>): Promise<void>;
