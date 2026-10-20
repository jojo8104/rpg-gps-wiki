import { readFile, mkdir, writeFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { versionArticles } from "./wiki-history.mjs";
import { escapeHtml as esc, renderMarkdown, slug } from "./wiki-markdown.mjs";

export async function buildWiki({
  root = new URL("../", import.meta.url),
  note,
} = {}) {
  const json = async (path) =>
    JSON.parse(await readFile(new URL(path, root), "utf8"));
  const [content, classes, units, editorial] = await Promise.all([
    json("docs/wiki-content.json"),
    json("data/hero-classes.json"),
    json("data/units.json"),
    json("docs/wiki-articles.json"),
  ]);
  const guides = content.sections;
  const documents = new Map();
  const documentId = (file) => `article-${file.replace(/\.md$/, "")}`;
  const queue = [
    ...new Set([
      ...guides.flatMap((s) => (s.references ?? []).map((r) => r.file)),
      "wiki-maintenance.md",
    ]),
  ];
  for (let i = 0; i < queue.length; i++) {
    const file = queue[i];
    if (!/^[a-z0-9-]+\.md$/.test(file))
      throw new Error(`Document invalide : ${file}`);
    if (!editorial[file]?.summary || !editorial[file]?.explanation?.length)
      throw new Error(`Explication éditoriale manquante : ${file}`);
    const source = (
      await readFile(new URL(`docs/${file}`, root), "utf8")
    ).replace(/\r\n?/g, "\n");
    const title = /^# (.+)$/m.exec(source)?.[1] ?? editorial[file].summary;
    documents.set(file, {
      file,
      id: documentId(file),
      title,
      source,
      ...editorial[file],
    });
    for (const match of source.matchAll(
      /\[[^\]]+\]\(([^\s)]+\.md)(?:#[^)]*)?\)/g,
    )) {
      if (/^https?:/.test(match[1])) continue;
      const linked = match[1].split("/").at(-1);
      if (!queue.includes(linked)) queue.push(linked);
    }
  }
  const imageManifest = new Set();
  let previousAssets = {};
  try {
    previousAssets = (await json("wiki/build-manifest.json")).assets ?? {};
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const assets = {};
  async function image(asset, caption, size = "") {
    if (
      !/^[a-zA-Z0-9/_-]+\.(png|jpe?g|webp|svg)$/.test(asset) ||
      asset.includes("..")
    )
      throw new Error(`Image invalide : ${asset}`);
    let bytes;
    try {
      bytes = await readFile(new URL(`app/assets/${asset}`, root));
    } catch (error) {
      // Le dépôt dédié ne contient que les médias exportés, sans l’application.
      const exported = previousAssets[asset];
      if (
        error.code !== "ENOENT" ||
        !/^media\/[a-f0-9]{16}-[a-zA-Z0-9_-]+\.(png|jpe?g|webp|svg)$/.test(
          exported ?? "",
        )
      )
        throw error;
      bytes = await readFile(new URL(`wiki/${exported}`, root));
    }
    const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
    const file = `${hash}-${asset.split("/").at(-1)}`;
    const target = new URL(`wiki/media/${file}`, root);
    await mkdir(new URL("wiki/media/", root), { recursive: true });
    try {
      await access(target);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      await writeFile(target, bytes, { flag: "wx" });
    }
    imageManifest.add(`media/${file}`);
    assets[asset] = `media/${file}`;
    return `<figure class="illustration ${size}"><img src="media/${file}" alt="${esc(caption)}" loading="lazy" decoding="async"><figcaption>${esc(caption)}</figcaption></figure>`;
  }
  const guideArt = {
    "premiers-pas": [
      "welcome-landscape.png",
      "Illustration d’accueil du jeu RPG GPS.",
    ],
    "heros-armee": [
      "portraits/hero-wanderer.png",
      "Portrait d’aventurier utilisé pour le Guerrier.",
    ],
    lieux: [
      "markers/capital.png",
      "La capitale, un des lieux du monde de jeu.",
    ],
    quetes: [
      "characters/marshal-aldren.png",
      "Le maréchal Aldren, interlocuteur de quêtes à la capitale.",
    ],
    combats: [
      "units/heavy-cavalry-thumbnail.png",
      "Cavalerie lourde : illustration d’une unité du catalogue.",
    ],
  };
  const articles = [];
  const ids = new Set();
  function add(article) {
    if (!/^[a-z][a-z0-9-]*$/.test(article.id) || ids.has(article.id))
      throw new Error(`Identifiant invalide ou dupliqué : ${article.id}`);
    ids.add(article.id);
    articles.push(article);
  }
  const articleLinks = (items) =>
    `<ul class="related-links">${items.map((item) => `<li><a href="${item.id}.html">${esc(item.title)}</a></li>`).join("")}</ul>`;
  for (const guide of guides) {
    const related = (guide.references ?? []).map((r) => documents.get(r.file));
    const art = guideArt[guide.id];
    add({
      ...guide,
      category: "Guide",
      summary: guide.summary ?? guide.paragraphs[0],
      body: `${guide.summary ? `<p class="lead">${esc(guide.summary)}</p>` : ""}${art ? await image(...art, "guide-art") : ""}${guide.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}${related.length ? `<h2>Pour approfondir</h2>${articleLinks(related)}` : ""}`,
    });
  }
  for (const doc of documents.values()) {
    const resolveLink = (href) => {
      if (/^https?:\/\//.test(href)) return href;
      if (href.startsWith("#"))
        return `#ref-${slug(decodeURIComponent(href.slice(1)))}`;
      const [path, anchor] = href.split("#");
      const file = path.split("/").at(-1);
      if (documents.has(file))
        return `${documentId(file)}.html${anchor ? `#ref-${slug(decodeURIComponent(anchor))}` : ""}`;
      return null;
    };
    const rendered = renderMarkdown(doc.source.replace(/^# [^\n]+\n/, ""), {
      resolveLink,
    });
    const illustrations = await Promise.all(
      (doc.images ?? []).map((a) => image(a.path, a.caption)),
    );
    const parents = guides.filter((g) =>
      g.references?.some((r) => r.file === doc.file),
    );
    const toc = rendered.headings.filter((h) => h.level <= 3);
    add({
      id: doc.id,
      title: doc.title,
      summary: doc.summary,
      category: doc.status ?? "Règles et fonctionnement",
      sourceFile: doc.file,
      body: `<p class="lead">${esc(doc.summary)}</p><section class="explanation"><h2>Comprendre ce que cela implique</h2>${doc.explanation.map((p) => `<p>${esc(p)}</p>`).join("")}</section>${illustrations.length ? `<div class="illustrations">${illustrations.join("")}</div>` : ""}${toc.length ? `<details class="article-toc"><summary>Dans cet article</summary><ul>${toc.map((h) => `<li><a href="#${h.id}">${esc(h.title)}</a></li>`).join("")}</ul></details>` : ""}<h2>Détails de référence</h2><p class="source-note">Texte de référence mis en forme et conservé dans l’historique de cet article. Les paragraphes datés peuvent décrire une évolution ou une étape antérieure.</p><div class="reference-body">${rendered.html}</div>${parents.length ? `<h2>Revenir au guide</h2>${articleLinks(parents)}` : ""}`,
    });
  }
  const classCards = await Promise.all(
    classes.map(async (hero) => {
      const portrait = {
        warrior: "hero-wanderer.png",
        ranger: "hero-ranger.png",
        mage: "hero-mage.png",
      }[hero.id];
      return `<div class="catalog-card">${portrait ? await image(`portraits/${portrait}`, `Portrait : ${hero.name}`, "portrait") : ""}<h2>${esc(hero.name)}</h2><p>${esc(hero.advantage)}</p><dl>${Object.entries(
        {
          Attaque: hero.baseStats.attack,
          Défense: hero.baseStats.defense,
          Moral: hero.baseStats.morale,
          Mobilité: hero.baseStats.mobility,
          Commandement: hero.baseStats.command,
          PV: hero.baseStats.health,
        },
      )
        .map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`)
        .join("")}</dl></div>`;
    }),
  );
  add({
    id: "classes",
    title: "Classes de héros",
    category: "Catalogue",
    summary:
      "Comparer les caractéristiques de départ du Guerrier, de l’Éclaireur et du Mage.",
    body: `<p class="lead">Les classes orientent les caractéristiques et les capacités du héros.</p><p>Ces valeurs proviennent du catalogue du jeu, avant progression et équipement. Elles ne prédisent pas à elles seules le résultat d’un combat.</p><div class="cards">${classCards.join("")}</div>`,
  });
  const unitRows = await Promise.all(
    units.map(async (u) => {
      const supported = [
        "militia",
        "archer",
        "mounted-archer",
        "spearman",
        "swordsman",
        "heavy-infantry",
        "light-cavalry",
        "heavy-cavalry",
      ];
      const art = supported.includes(u.id)
        ? await image(`units/${u.id}-thumbnail.png`, u.name, "unit-thumbnail")
        : "";
      return `<tr><th scope="row">${art}${esc(u.name)}</th>${[u.faction, u.maxQuantity, u.authorityCost, u.stats.attack, u.stats.defense, u.stats.healthPerSoldier, u.stats.speed, u.stats.range].map((v) => `<td>${esc(v)}</td>`).join("")}</tr>`;
    }),
  );
  add({
    id: "unites",
    title: "Catalogue des unités",
    category: "Catalogue",
    summary:
      "Comparer les effectifs maximaux, l’autorité et les statistiques de base des unités.",
    body: `<p class="lead">Les valeurs du catalogue décrivent un type d’unité, avant les bonus du héros, du terrain et de la bataille.</p><p>L’effectif maximal concerne une unité ; le coût d’autorité sert à composer l’armée. Une illustration ne révèle pas l’effectif actuel d’une troupe.</p><div class="table-scroll" tabindex="0" role="region" aria-label="Catalogue des unités"><table><caption>Statistiques de base des types d’unités</caption><thead><tr>${["Unité", "Faction", "Effectif max.", "Coût d’autorité", "Attaque", "Défense", "PV / soldat", "Vitesse", "Portée"].map((s) => `<th scope="col">${s}</th>`).join("")}</tr></thead><tbody>${unitRows.join("")}</tbody></table></div>`,
  });
  const history = await versionArticles({
    root,
    note,
    articles: articles.map((a) => ({
      ...a,
      currentHref: `${a.id}.html`,
      snapshot: a.body.replace(
        /(href|src)="(?!https?:|#)([^"]+)"/g,
        '$1="../../$2"',
      ),
    })),
  });
  const navigation = [
    ...guides.map((g) => ({ id: g.id, title: g.title })),
    { id: "classes", title: "Classes de héros" },
    { id: "unites", title: "Unités" },
  ];
  function shell(title, main, active) {
    return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(title)} — Wiki RPG GPS"><title>${esc(title)} — Wiki RPG GPS</title><link rel="stylesheet" href="wiki.css"></head><body><a class="skip" href="#contenu">Aller au contenu</a><header class="site-header"><a class="brand" href="index.html">RPG GPS <span>Le wiki</span></a><a href="https://jojo8104.github.io/rpg-gps/app/">Ouvrir le jeu ↗</a></header><div class="layout"><nav aria-label="Navigation du wiki"><a href="index.html"${active ? "" : ' aria-current="page"'}>Tous les articles</a>${navigation.map((item) => `<a href="${item.id}.html"${active === item.id ? ' aria-current="page"' : ""}>${esc(item.title)}</a>`).join("")}<a href="article-wiki-maintenance.html">Maintenir le wiki</a></nav><main id="contenu">${main}</main></div><footer>RPG GPS · Guide du prototype · Les règles prévues et les systèmes historiques sont signalés dans leurs articles.</footer></body></html>\n`;
  }
  for (const article of articles) {
    await writeFile(
      new URL(`wiki/${article.id}.html`, root),
      shell(
        article.title,
        `<div class="breadcrumb"><a href="index.html">Wiki</a> / ${esc(article.category)}</div><article class="wiki-article"><p class="eyebrow">${esc(article.category)}</p><h1>${esc(article.title)}</h1>${article.body}${history.get(article.id)}</article>`,
        article.id,
      ),
    );
  }
  const card = (a) =>
    `<div class="index-card" id="${a.id}"><p class="eyebrow">${esc(a.category)}</p><h3><a href="${a.id}.html">${esc(a.title)}</a></h3><p>${esc(a.summary.length > 210 ? a.summary.slice(0, 207) + "…" : a.summary)}</p></div>`;
  const guideArticles = articles.filter(
    (a) => !a.sourceFile && !a.id.startsWith("article-"),
  );
  const referenceArticles = articles.filter((a) => a.id.startsWith("article-"));
  await writeFile(
    new URL("wiki/index.html", root),
    shell(
      content.title,
      `<p class="eyebrow">Explorer · Comprendre · Retrouver</p><h1>${esc(content.title)}</h1><p class="lead">${esc(content.intro)}</p><p>Un sujet, une page. Les articles expliquent les règles, leurs conséquences et les fonctionnalités encore prévues. Leur historique se trouve en bas de page.</p><h2>Le guide du jeu</h2><div class="cards index-cards">${guideArticles.map(card).join("")}</div><h2>Règles, outils et fonctionnement</h2><div class="cards index-cards">${referenceArticles.map(card).join("")}</div>`,
    ),
  );
  await writeFile(
    new URL("wiki/build-manifest.json", root),
    JSON.stringify(
      {
        pages: ["index.html", ...articles.map((a) => `${a.id}.html`)],
        media: [...imageManifest].sort(),
        assets,
        documents: [...documents.keys()].sort(),
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `Wiki généré : ${articles.length} articles, ${documents.size} documents expliqués, ${imageManifest.size} illustrations.`,
  );
  return articles;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const index = process.argv.indexOf("--note");
  if (index !== -1 && !process.argv[index + 1]?.trim())
    throw new Error("La note de changement est vide.");
  await buildWiki({ note: index === -1 ? undefined : process.argv[index + 1] });
}
