import mongoose from "mongoose";
import { setCfg } from "./cfg.js";
import type { DBConfig } from "./types.ts";

/**
 * Initializes the default MongoDB connection using the provided config.
 *
 * - Stores the config under the key `"default"` via `setCfg`.
 * - Establishes a connection using Mongoose.
 *
 * @param cfg - The database configuration including URI and options.
 * @returns A promise that resolves when the connection is established.
 */
const defaultDB = async (cfg: DBConfig): Promise<void> => {
  setCfg("default", cfg);
  await mongoose.connect(cfg.uri);
  console.log("Default DB connected:", mongoose.connection.name);
};

export default defaultDB;
