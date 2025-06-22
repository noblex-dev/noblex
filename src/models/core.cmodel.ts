import mongoose, {
  Schema,
  SchemaDefinition,
  SchemaOptions,
  HydratedDocument,
  Connection,
  Model,
} from "mongoose";
import { getCfg } from "../db/cfg.js";
import type { MongooseHook } from "./types.js";
import Methods from "./methods.model.js";
import { req } from "../storage.js";
import { hooksRegister } from "./hooks.model.js";

/**
 * Extend the Methods prototype with a new method from configuration.
 * Automatically binds the request context to `this.req`.
 *
 * @template T - The schema type of the model
 * @param name - The name of the method
 * @param fn - The method implementation function
 */
function extendMethods<T>(
  name: string,
  fn: (this: Methods<T>, ...args: unknown[]) => unknown
): void {
  (Methods.prototype as Record<string, any>)[name] = function (
    this: Methods<T>,
    ...args: unknown[]
  ) {
    (this as { req?: unknown }).req = req();
    return fn.apply(this, args);
  };
}

/**
 * Create a model bound to a custom Mongoose connection.
 * Includes default schema fields, hooks, and custom methods.
 *
 * @template T - The schema type for the model
 * @param db - The database object containing the Mongoose connection
 * @param name - The base model name (singular)
 * @param schema - The base schema definition
 * @param options - Optional schema configuration
 * @returns An instance of Methods<T> wrapping the compiled model
 */
function createModel<T extends Record<string, unknown>>(
  db: { connection: Connection },
  name: string,
  schema: SchemaDefinition,
  options?: SchemaOptions
): Methods<T> {
  const pluralizer = mongoose.pluralize();
  const pluralName = (pluralizer ? pluralizer(name) : name).toLowerCase();

  const dbCfg = getCfg(db.connection.name);

  const modelSchema = new Schema(
    {
      ...(dbCfg.defaults ?? {}),
      ...schema,
    },
    {
      collection: options?.collection || pluralName,
      timestamps: true,
      ...dbCfg.options,
      ...options,
    }
  );

  const colHooks =
    hooksRegister[db.connection.name]?.[options?.collection || pluralName] ??
    [];

  colHooks.forEach(
    (obj: { hook: string; target: Function; hooks?: MongooseHook[] }) => {
      if (obj.hook === "toJson") {
        modelSchema.set("toJSON", {
          transform(doc: unknown, ret: unknown) {
            return obj.target(req(), doc, ret);
          },
        });
      } else if (obj.hooks) {
        obj.hooks.forEach((hook: MongooseHook) => {
          if (obj.hook === "pre") {
            modelSchema.pre(hook, async function (this: unknown) {
              await obj.target(req(), this);
            });
          } else if (obj.hook === "post") {
            modelSchema.post(
              hook,
              async function (this: unknown, result: unknown) {
                await obj.target(req(), result);
              }
            );
          }
        });
      }
    }
  );

  const mongooseModel: Model<HydratedDocument<T>> = db.connection.model<
    HydratedDocument<T>
  >(name, modelSchema);

  for (const [methodName, methodFn] of Object.entries(dbCfg.methods ?? {})) {
    extendMethods(
      methodName,
      methodFn as (this: Methods<T>, ...args: unknown[]) => unknown
    );
  }

  class ExtendedModel extends Methods<T> {
    constructor() {
      super(mongooseModel);
    }
  }

  return new ExtendedModel();
}

export default createModel;
