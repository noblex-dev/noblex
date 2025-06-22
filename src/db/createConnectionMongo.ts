import mongoose, { Connection } from "mongoose";
import { setCfg } from "./cfg.js";
import type { DBConfig } from "./types.ts";

/**
 * Class for managing an isolated Mongoose connection.
 * Useful for multi-tenant or multi-database setups.
 */
export class DB {
  /** The Mongoose connection instance */
  public connection: Connection;

  /** Internal DB config options (uri, schema defaults, methods, etc.) */
  private options: DBConfig;

  /**
   * Initializes a new database connection using `mongoose.createConnection()`.
   *
   * @param options - The database configuration.
   */
  constructor(options: DBConfig) {
    this.options = options;
    this.connection = mongoose.createConnection(options.uri);
  }

  /**
   * Opens the MongoDB connection and stores the config via `setCfg`.
   *
   * @returns A Promise that resolves with the open connection.
   */
  async connect(): Promise<Connection> {
    return new Promise((resolve, reject) => {
      this.connection.once("open", () => {
        setCfg(this.connection.name, this.options);
        console.log(
          `Mongoose connected to ${this.connection.name} successfully`
        );
        resolve(this.connection);
      });
      this.connection.on("error", reject);
    });
  }

  /**
   * Closes the MongoDB connection.
   *
   * @returns A Promise that resolves when the connection is closed.
   */
  async close(): Promise<void> {
    await this.connection.close();
  }
}

export default DB;
