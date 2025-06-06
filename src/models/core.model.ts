import mongoose, {
  Schema,
  SchemaDefinition,
  SchemaOptions,
  HydratedDocument,
  Model,
} from "mongoose";
import Methods from "../methods/core.methods.ts";

function createModel<T extends Record<string, any>>(
  name: string,
  schema: SchemaDefinition,
  options?: SchemaOptions,
  crud?: { api?: string }
) {
  if (mongoose.models[name]) {
    return new (class extends Methods<T> {
      api = name;
      constructor() {
        super(mongoose.models[name] as Model<HydratedDocument<T>>);
      }
    })();
  }

  const modelSchema = new Schema(
    {
      // name: { type: String },
      // deleted: { type: Boolean, default: false },
      ...schema,
    },
    { timestamps: true, ...options }
  );

  const model = mongoose.model<HydratedDocument<T>>(name, modelSchema);

  return new (class extends Methods<T> {
    api = model.collection.name;
    constructor() {
      super(model);
    }
  })();
}

export default createModel;
