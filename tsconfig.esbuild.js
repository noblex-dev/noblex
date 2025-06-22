import esbuild from "esbuild";
import findFiles from "./src/utils/findeFilesJS.js";

async function build() {
  try {
    console.log("🚧 Building...");

    // const envFile = await fs.readFile("./.env.production", "utf-8");
    // const envLines = envFile
    //   .split("\n")
    //   .filter((line) => line.trim() && !line.trim().startsWith("#"));

    const define = {};
    // for (const line of envLines) {
    //   const [keyRaw, ...rest] = line.split("=");
    //   const key = keyRaw.trim();
    //   const valueRaw = rest.join("=").trim();
    //   define[`process.env.${key}`] = JSON.stringify(valueRaw);
    // }

    const entryPoints = findFiles("src", [/\.ts$/], [/\.d\.ts$/]);
    // const entryPoints = ["index.ts", ...srcFiles];

    await esbuild.build({
      entryPoints,
      bundle: false,
      platform: "node",
      format: "esm",
      outdir: "./dist",
      target: ["node22"],
      legalComments: "none",
      define: {},
      sourcemap: false,
      metafile: true,
      loader: {
        ".ts": "ts",
        ".json": "json",
      },
      //external: ["express", "mongoose"],
      minify: false,
    });
    // await esbuild.build({
    //   entryPoints: ["./src/index.ts"],
    //   bundle: true,
    //   platform: "node",
    //   format: "esm",
    //   outfile: "./dist/index.js",
    //   target: ["node22"],
    //   legalComments: "none",
    //   define: {},
    //   sourcemap: false,
    //   metafile: true,
    //   external: ["express", "mongoose"],
    //   loader: {
    //     ".json": "json",
    //   },
    //   minify: true,
    //   // drop: ["console"],
    // });
    // const stats = await fs.stat("./dist/index.js");
    // const sizeMB = stats.size / (1024 * 1024);
    console.log(`✅ Build successful.`);
  } catch (err) {
    console.error("❌ Build failed:", err);
    process.exit(1);
  }
}

build();
