import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { renderMarkdown } from "../scripts/wiki-markdown.mjs";

test("le rendu transforme les tableaux, listes, exemples et renvois en HTML sûr", () => {
  const source =
    '# Terrain\n\n**Défense** et `attack < 5`.\n\n| Case | Effet |\n| --- | --- |\n| Forêt | ×1,25 |\n\n1. Premier choix\n   suite du choix\n   - Détail\n2. Deuxième choix\n\n> Une citation\n\n```json\n{"x":"<script>"}\n```\n\n[Lire](terrain.md) [Interdit](javascript:alert)\n\n<script>alert(1)</script>\n\n## Terrain';
  const rendered = renderMarkdown(source, {
    resolveLink: (href) =>
      href === "terrain.md" ? "article-terrain.html" : href,
  });
  assert.match(rendered.html, /<table>/);
  assert.match(rendered.html, /<strong>Défense<\/strong>/);
  assert.match(rendered.html, /<code>attack &lt; 5<\/code>/);
  assert.match(
    rendered.html,
    /<ol><li><p>Premier choix suite du choix<\/p><ul>/,
  );
  assert.match(rendered.html, /<blockquote>/);
  assert.match(rendered.html, /class="language-json"/);
  assert.match(rendered.html, /href="article-terrain.html"/);
  assert.doesNotMatch(rendered.html, /<script>|href="javascript:/);
  assert.deepEqual(
    rendered.headings.map((h) => h.id),
    ["ref-terrain", "ref-terrain-1"],
  );
});

test("chaque article généré a sa page, une histoire et des ressources locales accessibles", async () => {
  const root = new URL("../", import.meta.url);
  const manifest = JSON.parse(
    await readFile(new URL("wiki/build-manifest.json", root), "utf8"),
  );
  assert.ok(manifest.documents.length >= 30);
  assert.ok(manifest.media.length > 0);
  for (const page of manifest.pages) {
    const path = new URL(`wiki/${page}`, root);
    const html = await readFile(path, "utf8");
    assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, page);
    if (page !== "index.html") assert.match(html, /article-history/, page);
    if (page.startsWith("article-"))
      assert.match(html, /Comprendre ce que cela implique/, page);
    for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^https?:/.test(url)) continue;
      assert.doesNotMatch(url, /\.md(?:#|$)/, `${page}: lien Markdown brut`);
      const target = new URL(url, path);
      const anchor = target.hash.slice(1);
      target.hash = "";
      await access(target);
      if (anchor) {
        const targetHtml = await readFile(target, "utf8");
        assert.ok(
          targetHtml.includes(`id="${anchor}"`),
          `${page}: ancre ${url}`,
        );
      }
    }
  }
});
