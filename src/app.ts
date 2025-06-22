import express, { RequestHandler } from "express";
import http from "node:http";
import type { Document } from "mongoose";
import { createRoutes } from "./controllers/routes.controller.js";
import { Crud } from "./controllers/crud.controller.js";
import { asyncLocalStorage, STORE_KEYS } from "./storage.js";
import { AppConfig } from "./types.js";
import Method from "./models/methods.model.js";

class App<T extends Document>{
  cfg: AppConfig<T>;
  expressApp: express.Express;
  nodeServer: http.Server;
  name: string;

  constructor(cfg: AppConfig<T>, name = "default") {
    this.cfg = cfg;
    this.name = name;
    this.expressApp = express();
    this.middlewares();
    this.response();
    this.nodeServer = http.createServer(this.expressApp);
    this.init();
  }

  middlewares() {
    this.cfg.set?.forEach((item: [string, any]) => {
      if (Array.isArray(item)) {
          this.expressApp.set(item[0], item[1]);
      }
    });

    this.expressApp.use((req, res, next) => {
      const store = new Map();
      store.set(STORE_KEYS.REQUEST, req);
      asyncLocalStorage.run(store, () => {
        next();
      });
    });

    this.cfg.middlewares?.static.forEach((middleware: RequestHandler) => {
      this.expressApp.use(middleware);
    });
  }

  response() {
    createRoutes(this.expressApp, this.cfg, this.name);

    if (this.cfg.crud && this.cfg.crud.routes) {
      this.cfg.crud.models.forEach(
        (model: Method<T> | [Method<T>, string]) => {
          Crud(this.expressApp, model, {
            routes: this.cfg.crud?.routes || [],
            dynamicMiddlewares: this.cfg.middlewares?.dynamic || [],
          });
        }
      );
    }

    this.expressApp.use((req, res, next) => {
      if (res.locals._noblex) {
        this.cfg.handlers.response(req, res, next);
      } else {
        next();
      }
    });

    this.expressApp.all("/*splat", this.cfg.handlers.notFound);
    this.expressApp.use(this.cfg.handlers.error);
  }

  init() {
    this.server.listen(Number(this.cfg.port), async () => {
      try {
        console.log(`Ready on port: ${this.cfg.host}:${this.cfg.port}`);
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    });
  }

  get app() {
    return this.expressApp;
  }

  get server() {
    return this.nodeServer;
  }
}

const parser = { json: express.json, urlencoded: express.urlencoded };

export default App;
export { parser };
