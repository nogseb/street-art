import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist/public");
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else files.push(target);
  }
  return files;
}
const files = await walk(root);
for (const file of files) {
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  assert.ok(
    relative === "index.html" || relative === ".htaccess" ||
    /^(assets|images)\/[^/]+\.(js|css|png|webp|jpe?g|woff2?|svg)$/.test(relative),
    `Unexpected deployment file: ${relative}`,
  );
  if (/\.(html|js|css)$/.test(file)) {
    const content = await readFile(file, "utf8");
    for (const forbidden of ["manus-storage", "forge.butterfly-effect", "__manus__", "VITE_ANALYTICS", "debug-collector"]) {
      assert.ok(!content.includes(forbidden), `${relative} depends on ${forbidden}`);
    }
  }
}
const html = await readFile(path.join(root, "index.html"), "utf8");
for (const match of html.matchAll(/(?:src|href)="(\/[^\"]+)"/g)) {
  assert.ok(match[1].startsWith("/street-art/"), `Wrong base path: ${match[1]}`);
  await readFile(path.join(root, match[1].slice("/street-art/".length)));
}
assert.ok(html.includes("https://nogues.app/street-art/"));
assert.ok(!html.includes("http://"));
await readFile(path.join(root, "images/tatie-monique.webp"));
await readFile(path.join(root, "images/favicon.png"));
const htaccess = await readFile(path.join(root, ".htaccess"), "utf8");
assert.ok(htaccess.includes("RewriteBase /street-art/"));
assert.ok(htaccess.includes("RewriteRule . /street-art/index.html [L]"));
console.log(`Static build verified: ${files.length} files; correct base path, local images, no Manus runtime or source files.`);
