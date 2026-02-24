// scripts/import-wp-10-posts.ts
import "dotenv/config";

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { JSDOM } from "jsdom";
import { getPayload } from "payload";
import payloadConfig from "../src/payload.config"; // adjust if needed

/**
 * Imports (10 posts):
 * - Posts: title, excerpt, categories, author (relationship), featured image, content (Lexical), SEO meta
 * - Users: creates/updates authors in `users` (auth collection -> needs password)
 * - Media: uploads featured image + ALL body images (supports lazy-load attrs + nested images)
 *
 * REQUIREMENTS IN YOUR PAYLOAD SCHEMA
 * - Posts must have: `author` relationship field -> relationTo: "users"
 *   { name: "author", type: "relationship", relationTo: "users" }
 *
 * ENV
 * - PAYLOAD_SECRET set (required)
 * - WP_BASE="https://example.com" (optional, else edit constant)
 */

const WP_BASE = process.env.WP_BASE || "https://technibus.com.br";
const WP_API = `${WP_BASE.replace(/\/$/, "")}/wp-json/wp/v2`;

const TMP_DIR = path.join(process.cwd(), ".tmp-wp-import");

// Lexical text format bits
const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 2;

type WPPost = {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  author: number;
  categories: number[];
  _embedded?: any;
};

type WPUser = {
  id: number;
  name?: string;
  description?: string;
  slug?: string;
};

type WPCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

async function ensureTmpDir() {
  await fs.mkdir(TMP_DIR, { recursive: true });
}

function decodeEntities(str: string) {
  return (str || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeSpaces(str: string) {
  return decodeEntities(str)
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n");
}

function stripHtml(html: string) {
  return normalizeSpaces((html || "").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function clampText(input: string, max = 160) {
  const text = (input || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

function getMetaDescription(excerptHtml: string, contentHtml: string) {
  const ex = clampText(stripHtml(excerptHtml), 160);
  if (ex) return ex;

  const ct = clampText(stripHtml(contentHtml), 160);
  return ct || "Importado do WordPress";
}

function randomPassword(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText} (${url})`);
  return (await res.json()) as T;
}

function guessExtFromUrl(url: string) {
  const last = (url.split("?")[0] || "").split("#")[0];
  const ext = last.includes(".") ? last.split(".").pop() : "";
  const cleaned = (ext || "jpg").toLowerCase();
  if (cleaned.length > 5) return "jpg";
  return cleaned;
}

async function downloadToTmp(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image download failed: ${res.status} ${res.statusText} (${url})`);

  const buffer = Buffer.from(await res.arrayBuffer());
  const ext = guessExtFromUrl(url);
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = path.join(TMP_DIR, fileName);

  await fs.writeFile(filePath, buffer);
  return filePath;
}

/** ------------------ IMAGE URL RESOLVER (lazyload + srcset) ------------------ */

function pickFromSrcset(srcset: string) {
  const items = (srcset || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [url, size] = chunk.split(/\s+/);
      const n = size?.endsWith("w") ? Number(size.replace("w", "")) : Number.NaN;
      return { url, w: Number.isFinite(n) ? n : 0 };
    })
    .filter((x) => x.url);

  if (!items.length) return "";
  items.sort((a, b) => b.w - a.w);
  return items[0].url;
}

function getBestImageUrl(img: Element) {
  const candidates = [
    img.getAttribute("data-src"),
    img.getAttribute("data-lazy-src"),
    img.getAttribute("data-original"),
    img.getAttribute("data-orig-file"),
    img.getAttribute("data-full-url"),
    img.getAttribute("src"),
  ].filter(Boolean) as string[];

  const srcset = img.getAttribute("data-srcset") || img.getAttribute("data-lazy-srcset") || img.getAttribute("srcset") || "";
  const bestFromSrcset = pickFromSrcset(srcset);

  const src = img.getAttribute("src") || "";
  const isPlaceholder = !src || src.includes("data:image") || src.includes("1x1") || src.includes("pixel") || src.includes("placeholder");

  if (bestFromSrcset) return bestFromSrcset;

  if (candidates.length) {
    if (isPlaceholder) {
      const nonData = candidates.find((u) => !u.startsWith("data:"));
      return nonData || candidates[0];
    }
    return candidates[0];
  }

  return "";
}

/** ------------------ CACHES (avoid duplicates) ------------------ */
const userIdByWpId = new Map<number, string>();
const categoryIdByWpSlug = new Map<string, string>();
const mediaIdByUrl = new Map<string, string>();

/** ------------------ PAYLOAD UPSERTS ------------------ */

async function upsertUser(payload: any, wpAuthor: WPUser) {
  if (userIdByWpId.has(wpAuthor.id)) return userIdByWpId.get(wpAuthor.id)!;

  const email = `wp-${wpAuthor.id}@import.local`;
  const name = wpAuthor.name || wpAuthor.slug || `WP User ${wpAuthor.id}`;
  const bio = wpAuthor.description || "";

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
  });

  let doc;
  if (existing.docs.length) {
    doc = await payload.update({
      collection: "users",
      id: existing.docs[0].id,
      data: {
        name,
        role: "Author",
        bio,
      },
    });
  } else {
    doc = await payload.create({
      collection: "users",
      data: {
        email,
        password: randomPassword(),
        name,
        role: "Author",
        bio,
      },
    });
  }

  userIdByWpId.set(wpAuthor.id, doc.id);
  return doc.id as string;
}

async function upsertCategory(payload: any, wpCat: WPCategory) {
  if (categoryIdByWpSlug.has(wpCat.slug)) return categoryIdByWpSlug.get(wpCat.slug)!;

  const existing = await payload.find({
    collection: "categories",
    where: { slug: { equals: wpCat.slug } },
    limit: 1,
  });

  const description = (wpCat.description || "").trim() || "Importado do WordPress";

  let doc;
  if (existing.docs.length) {
    doc = await payload.update({
      collection: "categories",
      id: existing.docs[0].id,
      data: {
        title: wpCat.name,
        description,
      },
    });
  } else {
    doc = await payload.create({
      collection: "categories",
      data: {
        title: wpCat.name,
        slug: wpCat.slug,
        description,
      },
    });
  }

  categoryIdByWpSlug.set(wpCat.slug, doc.id);
  return doc.id as string;
}

async function createOrReuseMedia(payload: any, url: string, alt?: string, caption?: string) {
  const normalizedUrl = (url || "").trim();
  if (!normalizedUrl) return undefined;

  if (mediaIdByUrl.has(normalizedUrl)) return mediaIdByUrl.get(normalizedUrl)!;

  const filePath = await downloadToTmp(normalizedUrl);

  const doc = await payload.create({
    collection: "media",
    data: {
      alt: alt || "",
      caption: caption || "",
    },
    filePath,
  });

  mediaIdByUrl.set(normalizedUrl, doc.id);
  return doc.id as string;
}

/** ------------------ LEXICAL BUILDERS ------------------ */

type InlineCtx = {
  bold?: boolean;
  italic?: boolean;
};

function pushTextNode(target: any[], text: string, ctx: InlineCtx) {
  const t = normalizeSpaces(text);
  if (!t) return;

  let format = 0;
  if (ctx.bold) format |= FORMAT_BOLD;
  if (ctx.italic) format |= FORMAT_ITALIC;

  target.push({
    type: "text",
    version: 1,
    text: t,
    format,
    detail: 0,
    mode: "normal",
    style: "",
  });
}

function mergeAdjacentText(nodes: any[]) {
  const merged: any[] = [];
  for (const n of nodes) {
    const prev = merged[merged.length - 1];
    if (prev && n.type === "text" && prev.type === "text" && prev.format === n.format) {
      prev.text += n.text;
    } else {
      merged.push(n);
    }
  }
  return merged;
}

function parseInlineChildren(node: Node, ctx: InlineCtx = {}): any[] {
  const out: any[] = [];

  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === 3) {
      pushTextNode(out, child.textContent || "", ctx);
      continue;
    }

    if (child.nodeType !== 1) continue;
    const el = child as Element;
    const tag = el.tagName.toLowerCase();

    if (tag === "br") {
      pushTextNode(out, "\n", ctx);
      continue;
    }

    if (tag === "strong" || tag === "b") {
      out.push(...parseInlineChildren(el, { ...ctx, bold: true }));
      continue;
    }

    if (tag === "em" || tag === "i") {
      out.push(...parseInlineChildren(el, { ...ctx, italic: true }));
      continue;
    }

    if (tag === "a") {
      const href = el.getAttribute("href") || "";
      const linkChildren = mergeAdjacentText(parseInlineChildren(el, ctx));

      if (!href || !linkChildren.length) {
        out.push(...linkChildren);
        continue;
      }

      out.push({
        type: "link",
        version: 2,
        direction: "ltr",
        format: "",
        indent: 0,
        fields: {
          linkType: "custom",
          url: href,
          newTab: false,
        },
        children: linkChildren,
      });

      continue;
    }

    // IMPORTANT: ignore img in inline parsing (handled as block uploads)
    if (tag === "img") continue;

    out.push(...parseInlineChildren(el, ctx));
  }

  return mergeAdjacentText(out);
}

function splitParagraphByNewlines(inlineNodes: any[]) {
  const paragraphs: any[][] = [[]];

  for (const node of inlineNodes) {
    if (node.type !== "text") {
      paragraphs[paragraphs.length - 1].push(node);
      continue;
    }

    const parts = (node.text || "").split("\n");
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part) paragraphs[paragraphs.length - 1].push({ ...node, text: part });
      if (i < parts.length - 1) paragraphs.push([]);
    }
  }

  return paragraphs.map((p) => p.filter(Boolean)).filter((p) => p.length > 0);
}

function makeParagraph(childrenInline: any[]) {
  return {
    type: "paragraph",
    version: 1,
    direction: null,
    format: "",
    indent: 0,
    children: childrenInline,
  };
}

function makeHeading(tag: string, childrenInline: any[]) {
  return {
    type: "heading",
    version: 1,
    tag,
    direction: null,
    format: "",
    indent: 0,
    children: childrenInline,
  };
}

function makeUpload(mediaId: string) {
  return {
    type: "upload",
    version: 1,
    relationTo: "media",
    value: { id: mediaId },
    direction: null,
    format: "",
    indent: 0,
  };
}

function makeList(listType: "bullet" | "number", items: any[]) {
  return {
    type: "list",
    version: 1,
    listType,
    direction: null,
    format: "",
    indent: 0,
    children: items,
  };
}

function makeListItem(childrenInline: any[]) {
  return {
    type: "listitem",
    version: 1,
    direction: null,
    format: "",
    indent: 0,
    children: [
      {
        type: "paragraph",
        version: 1,
        direction: null,
        format: "",
        indent: 0,
        children: childrenInline,
      },
    ],
  };
}

/**
 * Convert WP HTML -> Payload Lexical JSON
 * - Preserves paragraphs/headings/lists
 * - Preserves strong/em and <a>
 * - Imports ALL images:
 *   - standalone <img>
 *   - <figure><img> + <figcaption> (caption stored in media doc)
 *   - nested images anywhere inside paragraphs (including <a><img/></a>, wrappers, lazy-load attrs)
 */
async function htmlToLexical(payload: any, html: string) {
  const dom = new JSDOM(`<body>${html || ""}</body>`);
  const document = dom.window.document;

  const rootChildren: any[] = [];

  // Turn <br> into newline text nodes for text processing
  for (const br of Array.from(document.body.querySelectorAll("br"))) {
    br.replaceWith(document.createTextNode("\n"));
  }

  // Walk block-ish nodes in DOM order (Gutenberg wrappers included)
  function* walk(node: Element): Generator<Element> {
    for (const child of Array.from(node.children)) {
      const tag = child.tagName.toLowerCase();

      if (
        tag === "p" ||
        tag === "blockquote" ||
        tag === "ul" ||
        tag === "ol" ||
        tag === "figure" ||
        tag === "img" ||
        tag === "h1" ||
        tag === "h2" ||
        tag === "h3" ||
        tag === "h4" ||
        tag === "h5" ||
        tag === "h6"
      ) {
        yield child;
        continue;
      }

      yield* walk(child);
    }
  }

  for (const el of walk(document.body)) {
    const tag = el.tagName.toLowerCase();

    // Headings
    if (tag.startsWith("h")) {
      const inline = parseInlineChildren(el);
      if (inline.length) rootChildren.push(makeHeading(tag, inline));
      continue;
    }

    // Lists
    if (tag === "ul" || tag === "ol") {
      const listType = tag === "ol" ? "number" : "bullet";
      const items = Array.from(el.querySelectorAll(":scope > li"))
        .map((li) => {
          const inline = parseInlineChildren(li);
          return inline.length ? makeListItem(inline) : null;
        })
        .filter(Boolean) as any[];

      if (items.length) rootChildren.push(makeList(listType, items));
      continue;
    }

    // Figure: image + caption
    if (tag === "figure") {
      const img = el.querySelector("img");
      const figcaption = el.querySelector("figcaption");

      if (img) {
        const src = getBestImageUrl(img);
        const alt = img.getAttribute("alt") || "";
        const caption = figcaption ? stripHtml(figcaption.innerHTML) : "";

        const mediaId = src ? await createOrReuseMedia(payload, src, alt, caption) : undefined;
        if (mediaId) rootChildren.push(makeUpload(mediaId));

        // Optional: show caption as paragraph too (remove if you don't want visible captions)
        if (caption) {
          rootChildren.push(makeParagraph([{ type: "text", version: 1, text: caption, format: 0, detail: 0, mode: "normal", style: "" }]));
        }
      }

      continue;
    }

    // Standalone image
    if (tag === "img") {
      const src = getBestImageUrl(el);
      const alt = el.getAttribute("alt") || "";
      const mediaId = src ? await createOrReuseMedia(payload, src, alt, "") : undefined;
      if (mediaId) rootChildren.push(makeUpload(mediaId));
      continue;
    }

    // Paragraph-like (also handles nested images anywhere inside)
    if (tag === "p" || tag === "blockquote") {
      const imgs = Array.from(el.querySelectorAll("img"));

      // No images: normal paragraph conversion
      if (!imgs.length) {
        const inline = parseInlineChildren(el);
        const parts = splitParagraphByNewlines(inline);
        for (const pChildren of parts) rootChildren.push(makeParagraph(pChildren));
        continue;
      }

      // With images:
      // Replace each <img> with token so we can split paragraph around them (works for nested <a><img/></a>, etc.)
      const tokenPrefix = "__IMG_TOKEN__";
      const clone = el.cloneNode(true) as Element;

      const clonedImgs = Array.from(clone.querySelectorAll("img"));
      const uploadedIds: string[] = [];

      for (let i = 0; i < clonedImgs.length; i++) {
        const img = clonedImgs[i];

        const src = getBestImageUrl(img);
        const alt = img.getAttribute("alt") || "";

        const mediaId = src ? await createOrReuseMedia(payload, src, alt, "") : undefined;
        if (mediaId) uploadedIds.push(mediaId);

        img.replaceWith(clone.ownerDocument!.createTextNode(`${tokenPrefix}${i}__`));
      }

      // Get the remaining visible text from clone, preserving bold/italic/link for plain text segments
      const inlineWithTokens = parseInlineChildren(clone);

      // We'll split by tokens only using the TEXT stream to decide boundaries.
      // For simplicity + reliability, we render plain text per segment (keeps images order correct).
      const textStream = inlineWithTokens
        .filter((n) => n.type === "text")
        .map((n) => n.text)
        .join("");

      const segments = textStream.split(new RegExp(`${tokenPrefix}\\d+__`, "g"));

      for (let i = 0; i < segments.length; i++) {
        const seg = (segments[i] || "").trim();
        if (seg) {
          rootChildren.push(makeParagraph([{ type: "text", version: 1, text: seg, format: 0, detail: 0, mode: "normal", style: "" }]));
        }
        if (i < uploadedIds.length) {
          rootChildren.push(makeUpload(uploadedIds[i]));
        }
      }

      continue;
    }
  }

  // Fallback if nothing was captured
  if (!rootChildren.length) {
    const text = stripHtml(html);
    rootChildren.push(makeParagraph([{ type: "text", version: 1, text, format: 0, detail: 0, mode: "normal", style: "" }]));
  }

  return {
    root: {
      type: "root",
      version: 1,
      children: rootChildren,
      direction: "ltr",
      format: "",
      indent: 0,
    },
  };
}

/** ------------------ MAIN ------------------ */

async function run() {
  await ensureTmpDir();

  const payload = await getPayload({ config: payloadConfig });

  console.log("Fetching 10 posts from WordPress...");

  const posts = await fetchJson<WPPost[]>(`${WP_API}/posts?_embed&per_page=10`);

  for (const wpPost of posts) {
    console.log("Importing:", wpPost.slug);

    const title = stripHtml(wpPost.title?.rendered || "");
    const excerpt = stripHtml(wpPost.excerpt?.rendered || "");

    // --- AUTHOR (create/upsert + RELATE) ---
    const wpAuthor = await fetchJson<WPUser>(`${WP_API}/users/${wpPost.author}`);
    const authorId = await upsertUser(payload, wpAuthor);

    // --- CATEGORIES (create/upsert + RELATE) ---
    const categoryIds: string[] = [];
    for (const catId of wpPost.categories || []) {
      const wpCat = await fetchJson<WPCategory>(`${WP_API}/categories/${catId}`);
      const payloadCatId = await upsertCategory(payload, wpCat);
      categoryIds.push(payloadCatId);
    }

    // --- FEATURED IMAGE (create media + RELATE in posts.image) ---
    let featuredImageId: string | undefined;
    const featured = wpPost._embedded?.["wp:featuredmedia"]?.[0];

    if (featured?.source_url) {
      const caption = featured?.caption?.rendered ? stripHtml(featured.caption.rendered) : "";
      featuredImageId = await createOrReuseMedia(payload, featured.source_url, featured.alt_text || "", caption);
    }

    // --- CONTENT (create media for body images + RELATE via upload nodes) ---
    const lexicalContent = await htmlToLexical(payload, wpPost.content?.rendered || "");

    // --- SEO (required) ---
    const metaTitle = clampText(title, 60) || title || `Post ${wpPost.id}`;
    const metaDescription = getMetaDescription(wpPost.excerpt?.rendered || "", wpPost.content?.rendered || "");

    const dataToSave: any = {
      slug: wpPost.slug,
      title: title || `Post ${wpPost.id}`,
      excerpt: excerpt || title || "",
      category: categoryIds,
      image: featuredImageId,
      publishedDate: wpPost.date,
      content: lexicalContent,
      meta: {
        title: metaTitle,
        description: metaDescription,
      },
      author: authorId,
    };

    // Upsert by slug so you can rerun safely
    const existing = await payload.find({
      collection: "posts",
      where: { slug: { equals: wpPost.slug } },
      limit: 1,
    });

    if (existing.docs.length) {
      await payload.update({
        collection: "posts",
        id: existing.docs[0].id,
        data: dataToSave,
      });
      console.log("✓ Updated:", wpPost.slug);
    } else {
      await payload.create({
        collection: "posts",
        data: dataToSave,
      });
      console.log("✓ Created:", wpPost.slug);
    }
  }

  console.log("IMPORT FINISHED");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
