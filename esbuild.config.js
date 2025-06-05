import esbuild from 'esbuild';
import fs from 'fs/promises';

const envFile = await fs.readFile('./.env.production', 'utf-8');
const envLines = envFile
  .split('\n')
  .filter((line) => line.trim() && !line.trim().startsWith('#'));

const define = {};
for (const line of envLines) {
  const [keyRaw, ...rest] = line.split('=');
  const key = keyRaw.trim();
  const valueRaw = rest.join('=').trim();
  define[`process.env.${key}`] = JSON.stringify(valueRaw);
}

async function build() {
  console.log('Build App');
  try {
    await esbuild.build({
      entryPoints: ['./index.ts'],
      bundle: true,
      platform: 'node',
      format: 'cjs',
      outfile: './dist/index.cjs',
      target: ['node22'],
      legalComments: 'none',
      define,
      sourcemap: false,
      metafile: true,
      external: [],
      loader: {
        '.json': 'json',
      },
      minify: true,
      //  drop: ['console'],
    });
    const stats = await fs.stat('./dist/index.cjs');
    const sizeMB = stats.size / (1024 * 1024);
    console.log(
      `✅ Build successful. Output file size: ${sizeMB.toFixed(2)} MB`
    );
  } catch (err) {
    console.error('❌ Build failed:', err);
    process.exit(1);
  }
}

build();
