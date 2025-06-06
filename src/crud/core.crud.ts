import { Request, Router } from "express";
import { app } from "../app.ts";
import controller from "../controller/core.controller.ts";
import path from "path";
import Method from "../methods/core.methods.ts";
import { Document, FilterQuery, QueryOptions } from "mongoose";
import { TMiddleware } from "../middleware/types.ts";
import findFiles from "src/utils/findFiles.ts";

const middleware: Record<string, TMiddleware> = {};
const middlewareFiles = findFiles(
  `${process.cwd()}/src/modules/`,
  /middleware/
);
middlewareFiles.forEach(async (file: string) => {
  const parentFolder = path.basename(path.dirname(file));
  middleware[parentFolder] = await import(file);
});

const getMiddleware = (
  type: keyof TMiddleware,
  collection: string,
  crudMiddleware = []
) => {
  const mcfg = middleware[collection]?.[type];
  return Array.isArray(mcfg) ? mcfg : crudMiddleware;
};

class CRUD<T extends Document> {
  protected method: Method<T>;

  constructor(method: Method<T>, arg: any) {
    this.method = method;
    const collection: string = method.model.collection.name;
    const route = Router();
    app.use(`/${collection}`, route);
    route.get(
      "/",
      getMiddleware("read", collection, arg.middleware),
      controller(this.find)
    );
    route.get(
      "/options",
      getMiddleware("read", collection, arg.middleware),
      controller(this.options)
    );
    route.get(
      "/:id",
      getMiddleware("read", collection, arg.middleware),
      controller(this.findById)
    );
    route.post(
      "/",
      getMiddleware("create", collection, arg.middleware),
      controller(this.create)
    );
    route.post(
      "/count",
      getMiddleware("read", collection, arg.middleware),
      controller(this.count)
    );
    route.post(
      "/filter",
      getMiddleware("read", collection, arg.middleware),
      controller(this.filter)
    );
    route.patch(
      "/",
      getMiddleware("update", collection, arg.middleware),
      controller(this.updateById)
    );
    route.patch(
      "/:id",
      getMiddleware("update", collection, arg.middleware),
      controller(this.updateById)
    );
    route.delete(
      "/",
      getMiddleware("delete", collection, arg.middleware),
      controller(this.deleteMany)
    );
    route.delete(
      "/:id",
      getMiddleware("delete", collection, arg.middleware),
      controller(this.deleteById)
    );
  }

  create = async (req: Request) => {
    const data = await this.method.create(req.body);
    return { data };
  };

  findById = async (req: Request) => {
    const query = this.method.findById(req.params.id);
    if (req.query.populate) {
      query.populate(req.query.populate as string[]);
    }
    const data = await query;
    return { data };
  };

  find = async (req: Request) => {
    const { populate, ...filter } = req.query;
    const query = this.method.find(req.query as FilterQuery<T>);
    // if (populate) {
    //   query.populate(populate);
    // }
    const data = await query;
    return { data };
  };

  options = async (req: Request) => {
    const data = await this.method.find(req.body as FilterQuery<T>, {
      name: 1,
    });
    return { data };
  };
  count = async (req: Request) => {
    const data = await this.method.count(req.body);
    return { data };
  };

  filter = async (req: Request) => {
    const filter: FilterQuery<T> = req.body.filter;
    const options: QueryOptions = req.body.options;
    const sort: Record<string, 1 | -1> = options?.sort || {};
    const fields: Record<string, 1 | 0> = options?.fields || {};
    const limit: number = Number(options?.pageSize) || 10;
    const skip: number = Number(options?.pageIndex - 1) * limit;
    const data = await this.method.find(filter, fields, { limit, skip, sort });
    return { data };
  };

  updateById = async (req: Request) => {
    const data = await this.method.updateById(req.params.id, req.body);
    return { data };
  };

  deleteById = async (req: Request) => {
    const data = await this.method.updateById(req.params.id, req.body);
    return { data };
  };
  deleteMany = async (req: Request) => {
    const data = await this.method.deleteMany(req.body);
    return { data };
  };
}

export const Crud = <T extends Document>(
  methodsInstance: Method<T>,
  arg: { middleware: any[] }
) => {
  return new CRUD<T>(methodsInstance, arg);
};

export default CRUD;
