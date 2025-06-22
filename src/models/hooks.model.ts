import { MongooseHook } from "./types.js";

/**
 * Registry for hooks organized by database name and collection name.
 * Structure: { [dbName: string]: { [collectionName: string]: HookMethod[] } }
 */
export const hooksRegister: Record<string, Record<string, HookMethod[]>> = {};

/** Temporary storage of hook methods during decorator application */
let methodsRegister: HookMethod[] = [];

/** Hook method metadata */
interface HookMethod {
  hooks?: MongooseHook[];
  target: Function;
  hook: "pre" | "post" | "toJson";
}

/**
 * Class decorator to register hooks for a given collection in a specific database.
 * @param collectionName - Name of the collection to associate hooks with.
 * @param db - Database name (default is "default").
 */
export function Hooks(collectionName: string, db: string = "default") {
  return function (target: Function, context: ClassDecoratorContext) {
    if (!hooksRegister[db]) {
      hooksRegister[db] = {};
    }
    hooksRegister[db][collectionName] = methodsRegister;
    methodsRegister = [];
  };
}

/**
 * Method decorator to register a pre-hook.
 * @param args - Names of the pre-hooks to register.
 */
export function PreHook(...args: MongooseHook[]) {
  return function (target: Function, context: ClassMethodDecoratorContext) {
    methodsRegister.push({ hooks: args, target, hook: "pre" });
  };
}

/**
 * Method decorator to register a post-hook.
 * @param args - Names of the post-hooks to register.
 */
export function PostHook(...args: MongooseHook[]) {
  return function (target: Function, context: ClassMethodDecoratorContext) {
    methodsRegister.push({ hooks: args, target, hook: "post" });
  };
}

/**
 * Method decorator to register a JSON transformation hook.
 */
export function JsonHook() {
  return function (target: Function, context: ClassMethodDecoratorContext) {
    methodsRegister.push({ target, hook: "toJson" });
  };
}
