import type { SchemaDefinition, SchemaOptions, ConnectOptions } from "mongoose";
import type { Request } from "express";

/**
 * A function that extends a Mongoose model with custom logic.
 *
 * @template TModel - The type of the model this method is attached to.
 * @template TResult - The return type of the method.
 * @template TArgs - Tuple of argument types passed to the method.
 */
export interface DBMethod<
  TModel = any,
  TResult = any,
  TArgs extends any[] = any[]
> {
  (this: { model: TModel; req?: Request }, ...args: TArgs):
    | Promise<TResult>
    | TResult;
}

/**
 * Defines the structure for DB configuration, including connection URI,
 * default schema fields, Mongoose options, and custom methods.
 */
export interface DBConfig {
  /** MongoDB connection URI */
  uri: string;

  /** Default schema fields applied to all models (e.g., auditing fields) */
  defaults?: SchemaDefinition;

  /** Mongoose schema and connection options */
  options?: SchemaOptions & ConnectOptions;

  /** Custom shared instance methods for all models */
  methods?: Record<string, DBMethod>;
}
