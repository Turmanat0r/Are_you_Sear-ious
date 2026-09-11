import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const excluded = new Set(["node_modules", "verification", ".vercel"]);

async function walk(directory) {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...(await walk(absolute)));
    else if (entry.isFile() && entry.name !== "SHA256SUMS.txt")
      paths.push(absolute);
  }
  return paths;
}

const lines = [];
for (const absolute of (await walk(root)).sort()) {
  const hash = createHash("sha256")
    .update(await readFile(absolute))
    .digest("hex");
  lines.push(
    hash + "  " + path.relative(root, absolute).split(path.sep).join("/"),
  );
}
await writeFile(path.join(root, "SHA256SUMS.txt"), lines.join("\n") + "\n");
console.log(
  "Package manifest generated for " + lines.length + " source and asset files.",
);
