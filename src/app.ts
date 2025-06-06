import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import db from "./db/index.ts";
import http from "node:http";
import findFiles from "./utils/findFiles.ts";
import middleware from "./middleware/init.middleware.ts";
import { Crud } from "./crud/core.crud.ts";
import { errorHandler } from "./middleware/error-handler.ts";
export const app: Express = express();
export const server = http.createServer(app);
const root = process.cwd();
class App {
  private cfg;
  constructor(cfg: any) {
    this.cfg = cfg;
    // process.stdout.write(`Node Environment: ${this.cfg.env} \n`);
    this.init();
  }

  private async init() {
    await db.mongo(process.cwd(), this.cfg.db);
    middleware(this.cfg.allowOrigin);
    await this.routes();
    this.response();
    this.runApp();
  }
  private async routes() {
    const routeFiles = findFiles(`${root}/src/modules`, /route/);
    await Promise.all(routeFiles.map((file) => import(file)));
    const modelFiles = findFiles(`${root}/src/modules`, /model/);
    const models = await Promise.all(modelFiles.map((file) => import(file)));
    models.forEach((model) => Crud(model.default, this.cfg.crud));
  }

  private response() {
    app.all("/*splat", (req: Request, res: Response, next: NextFunction) => {
      next({ status: 404, code: "NOT_FOUND", message: "Not Found" });
    });
    app.use(errorHandler);
  }
  private runApp() {
    server.listen(Number(this.cfg.port), async () => {
      try {
        process.stdout.write(
          `Ready on port: ${this.cfg.host}:${this.cfg.port}\n`
        );
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    });
  }
}

export default App;
