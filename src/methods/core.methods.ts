import type {
  Model,
  FilterQuery,
  UpdateQuery,
  ProjectionType,
  QueryOptions,
  Types,
  HydratedDocument,
} from "mongoose";

class Methods<T> {
  public readonly model: Model<HydratedDocument<T>>;

  constructor(model: Model<HydratedDocument<T>>) {
    this.model = model;
  }

  find(
    filter: FilterQuery<HydratedDocument<T>> = {},
    fields: ProjectionType<HydratedDocument<T>> = {},
    options: QueryOptions = {}
  ) {
    return this.model.find(filter, { address: 1 }, options);
  }

  findById(_id: string | Types.ObjectId) {
    return this.model.findOne({ _id } as FilterQuery<HydratedDocument<T>>);
  }

  findOne(filter: FilterQuery<HydratedDocument<T>> = {}) {
    filter = { deleted: false, ...filter };
    return this.model.findOne(filter);
  }

  updateById(_id: string, data: UpdateQuery<HydratedDocument<T>>) {
    return this.model.updateOne(
      { _id } as FilterQuery<HydratedDocument<T>>,
      data
    );
  }

  updateOne(
    filter: FilterQuery<HydratedDocument<T>> = {},
    data: UpdateQuery<HydratedDocument<T>>
  ) {
    filter = { deleted: false, ...filter };
    return this.model.updateOne(filter, data);
  }

  create(data: Partial<T>) {
    return this.model.create(data);
  }

  count(filter: FilterQuery<HydratedDocument<T>> = {}) {
    return this.model.countDocuments(filter);
  }

  deleteById(_id: string) {
    return this.model.updateOne({ _id } as FilterQuery<HydratedDocument<T>>, {
      deleted: true,
    });
  }

  deleteMany(filterIds: string) {
    return this.model.updateMany(
      { _id: filterIds } as FilterQuery<HydratedDocument<T>>,
      {
        deleted: true,
      }
    );
  }
}

export default Methods;
