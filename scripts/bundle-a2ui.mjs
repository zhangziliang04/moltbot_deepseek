import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

const HASH_FILE = path.join(ROOT_DIR, "src/canvas-host/a2ui/.bundle.hash");
const OUTPUT_FILE = path.join(ROOT_DIR, "src/canvas-host/a2ui/a2ui.bundle.js");
const A2UI_RENDERER_DIR = path.join(ROOT_DIR, "vendor/a2ui/renderers/lit");
const A2UI_APP_DIR = path.join(ROOT_DIR, "apps/shared/MoltbotKit/Tools/CanvasA2UI");

async function main() {
  if (!fsSync.existsSync(A2UI_RENDERER_DIR) || !fsSync.existsSync(A2UI_APP_DIR)) {
    console.log("A2UI sources missing; keeping prebuilt bundle.");
    process.exit(0);
  }

  const INPUT_PATHS = [
    path.join(ROOT_DIR, "package.json"),
    path.join(ROOT_DIR, "pnpm-lock.yaml"),
    A2UI_RENDERER_DIR,
    A2UI_APP_DIR,
  ];

  const currentHash = await computeHash(INPUT_PATHS);

  let previousHash = "";
  if (fsSync.existsSync(HASH_FILE)) {
    previousHash = (await fs.readFile(HASH_FILE, "utf8")).trim();
  }
  
  if (previousHash === currentHash && fsSync.existsSync(OUTPUT_FILE)) {
    console.log("A2UI bundle up to date; skipping.");
    process.exit(0);
  }

  try {
     // Compile renderer
     // console.log("Compiling A2UI renderer...");
     execSync(`pnpm exec tsc -p "${A2UI_RENDERER_DIR}/tsconfig.json"`, { stdio: 'inherit', cwd: ROOT_DIR });
     
     // Bundle app
     // console.log("Bundling A2UI app...");
     // In the shell script, 'rolldown' was called directly. 
     // We use 'pnpm exec rolldown' to ensure it's found in node_modules/.bin.
     execSync(`pnpm exec rolldown -c "${A2UI_APP_DIR}/rolldown.config.mjs"`, { stdio: 'inherit', cwd: ROOT_DIR });
     
     await fs.writeFile(HASH_FILE, currentHash);
  } catch (error) {
     console.error("A2UI bundling failed. Re-run with: pnpm canvas:a2ui:bundle");
     console.error("If this persists, verify pnpm deps and try again.");
     console.error(error);
     process.exit(1);
  }
}

async function computeHash(inputs) {
  const files = [];

  async function walk(entryPath) {
    const st = await fs.stat(entryPath);
    if (st.isDirectory()) {
      const entries = await fs.readdir(entryPath);
      for (const entry of entries) {
        await walk(path.join(entryPath, entry));
      }
      return;
    }
    files.push(entryPath);
  }

  for (const input of inputs) {
    await walk(input);
  }

  function normalize(p) {
    return p.split(path.sep).join("/");
  }

  files.sort((a, b) => normalize(a).localeCompare(normalize(b)));

  const hash = createHash("sha256");
  for (const filePath of files) {
    const rel = normalize(path.relative(ROOT_DIR, filePath));
    hash.update(rel);
    hash.update("\0");
    const content = await fs.readFile(filePath);
    hash.update(content);
    hash.update("\0");
  }

  return hash.digest("hex");
}

main();
