import mongoose, {
  Schema,
  SchemaDefinition,
  SchemaOptions,
  HydratedDocument,
} from "mongoose";
import { getCfg } from "../db/cfg.js";
import type { MongooseHook } from "./types.js";
import Methods from "./methods.model.js";
import { req } from "../storage.js";
import { hooksRegister } from "./hooks.model.js";

/**
 * Extends the Methods prototype with a new method.
 * Binds the current request context to `this.req` inside the method.
 *
 * @template T - The schema type of the model
 * @param name - The method name to extend
 * @param fn - The method function to assign, bound to `Methods<T>`
 */
function extendMethods<T>(
  name: string,
  fn: (this: Methods<T>, ...args: unknown[]) => unknown
): void {
  (Methods.prototype as Record<string, any>)[name] = function (
    this: Methods<T>,
    ...args: unknown[]
  ) {
    // Attach current request context for usage inside method
    (this as { req?: unknown }).req = req();
    return fn.apply(this, args);
  };
}

/**
 * Creates and returns an extended Mongoose model with default schema, hooks, and methods applied.
 *
 * @template T - The schema interface/type
 * @param name - The base name of the model (singular)
 * @param schema - The schema definition for the model
 * @param options - Optional Mongoose schema options
 * @returns An instance of Methods<T> wrapping the mongoose model
 */
function createModel<T extends Record<string, any>>(
  name: string,
  schema: SchemaDefinition,
  options?: SchemaOptions
): Methods<T> {
  // Pluralize and lowercase model name for collection name
  const pluralizer = mongoose.pluralize();
  const pluralName = (pluralizer ? pluralizer(name) : name).toLowerCase();

  // Get DB configuration for defaults, options, and methods
  const dbCfg = getCfg("default");

  // Build final schema with defaults and options applied
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

  // Apply registered hooks for this collection, if any
  const hooks =
    hooksRegister["default"]?.[options?.collection || pluralName] ?? [];
  hooks.forEach(
    (obj: {
      hook: "pre" | "post" | "toJson";
      target: Function;
      hooks?: MongooseHook[];
    }) => {
      if (obj.hook === "toJson") {
        modelSchema.set("toJSON", {
          transform(doc: any, ret: any) {
            return obj.target(req(), doc, ret);
          },
        });
      } else if (obj.hooks) {
        obj.hooks.forEach((hook: MongooseHook) => {
          if (obj.hook === "pre") {
            modelSchema.pre(hook, async function (this: any) {
              const request = req();
              await obj.target(request, this);
            });
          } else if (obj.hook === "post") {
            modelSchema.post(hook, async function (this: any, result: any) {
              const request = req();
              await obj.target(request, result);
            });
          }
        });
      }
    }
  );

  // Create the mongoose model typed with HydratedDocument<T>
  const mongooseModel = mongoose.model<HydratedDocument<T>>(name, modelSchema);

  // Extend Methods prototype with DB config methods, binding request context
  for (const [methodName, methodFn] of Object.entries(dbCfg.methods ?? {})) {
    extendMethods(
      methodName,
      methodFn as (this: Methods<T>, ...args: unknown[]) => unknown
    );
  }

  // Extend Methods class to wrap the mongoose model instance
  class ExtendedModel extends Methods<T> {
    constructor() {
      super(mongooseModel);
    }
  }

  // Return an instance of the extended model with methods
  return new ExtendedModel();
}

export default createModel;
