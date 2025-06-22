import type { Model, HydratedDocument } from "mongoose";
/**
 * Base class for defining custom methods for a Mongoose model.
 *
 * This class ensures all instance methods are automatically bound
 * to the instance, so `this` always works correctly even if methods
 * are passed around.
 *
 * @template T - The shape of the model's schema.
 */
class Methods<T> {
  /**
   * Mongoose model instance.
   */
  public readonly model: Model<HydratedDocument<T>>;
  /**
   * Creates a new Methods wrapper around a Mongoose model.
   *
   * @param model - A compiled Mongoose model.
   */
  constructor(model: Model<HydratedDocument<T>>) {
    this.model = model;

    const proto = Object.getPrototypeOf(this);
    for (const key of Object.getOwnPropertyNames(proto)) {
      const descriptor = Object.getOwnPropertyDescriptor(proto, key);
      if (
        key !== "constructor" &&
        descriptor &&
        typeof descriptor.value === "function"
      ) {
        // Bind method to instance
        (this as any)[key] = (this as any)[key].bind(this);
      }
    }
  }
}

export default Methods;
