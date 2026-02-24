// scripts/import-wp-10-posts.ts
import "dotenv/config";

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { JSDOM } from "jsdom";
import { getPayload } from "payload";
import payloadConfig from "../src/payload.config"; // adjust if needed

/**
 * Imports (10 posts) WordPress -> Payload (Local API)
 *
 * Creates/updates:
 * - Users (authors) in `users` using the REAL WP email when available (requires `context=edit` + auth)
 *   - Fallback: wp-<id>@import.local
 * - Categories in `categories`
 * - Media in `media` (featured + body)
 * - Posts in `posts` (slug updates supported via map file)
 *
 * ENV:
 * - PAYLOAD_SECRET required
 * - WP_BASE="https://example.com"
 * - OPTIONAL (recommended to fetch WP user email):
 *    WP_USERNAME, WP_PASSWORD  (Basic Auth plugin / Application Password)
 *   OR WP_TOKEN (Bearer token)
 */

const WP_BASE = process.env.WP_BASE || "https://YOUR-WP-SITE.com";
const WP_API = `${WP_BASE.replace(/\/$/, "")}/wp-json/wp/v2`;

const TMP_DIR = path.join(process.cwd(), ".tmp-wp-import");
const POST_MAP_FILE = path.join(TMP_DIR, "wp-post-map.json");

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
  featured_media?: number;
  _embedded?: any;
};

type WPUser = {
  id: number;
  name?: string;
  description?: string;
  slug?: string;
  email?: string; // only available with context=edit + permissions
};

type WPCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

type WPMedia = {
  id: number;
  source_url?: string;
  alt_text?: string;
  caption?: { rendered?: string };
  guid?: { rendered?: string };
  media_details?: {
    sizes?: Record<string, { source_url?: string }>;
  };
};

async function ensureTmpDir() {
  await fs.mkdir(TMP_DIR, { recursive: true });
}

async function readPostMap(): Promise<Record<string, string>> {
  try {
    const raw = await fs.readFile(POST_MAP_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
    return {};
  } catch {
    return {};
  }
}

async function writePostMap(map: Record<string, string>) {
  await fs.writeFile(POST_MAP_FILE, JSON.stringify(map, null, 2), "utf-8");
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

/** ------------------ WP AUTH (for users?context=edit to include email) ------------------ */

function getWpAuthHeaders(): Record<string, string> {
  const token = process.env.WP_TOKEN?.trim();
  const username = process.env.WP_USERNAME?.trim();
  const password = process.env.WP_PASSWORD?.trim();

  if (token) return { Authorization: `Bearer ${token}` };
  if (username && password) {
    const basic = Buffer.from(`${username}:${password}`).toString("base64");
    return { Authorization: `Basic ${basic}` };
  }
  return {};
}

async function fetchJson<T>(url: string): Promise<T> {
  const headers = getWpAuthHeaders();
  const res = await fetch(url, { headers });
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

/** ------------------ CACHES ------------------ */
const userIdByWpId = new Map<number, string>();
const categoryIdByWpSlug = new Map<string, string>();
const mediaIdByUrl = new Map<string, string>();

/** ------------------ PAYLOAD UPSERTS ------------------ */

function fallbackEmailForWpUserId(id: number) {
  return `wp-${id}@import.local`;
}

async function fetchWpUserWithEmail(userId: number): Promise<WPUser> {
  // Try context=edit (email is usually only available there)
  try {
    return await fetchJson<WPUser>(`${WP_API}/users/${userId}?context=edit`);
  } catch {
    // Fallback to public view (no email)
    return await fetchJson<WPUser>(`${WP_API}/users/${userId}`);
  }
}

async function upsertUser(payload: any, wpAuthor: WPUser) {
  if (userIdByWpId.has(wpAuthor.id)) return userIdByWpId.get(wpAuthor.id)!;

  const email = (wpAuthor.email || "").trim() || fallbackEmailForWpUserId(wpAuthor.id);
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
      data: { name, role: "Author", bio },
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
      data: { title: wpCat.name, description },
    });
  } else {
    doc = await payload.create({
      collection: "categories",
      data: { title: wpCat.name, slug: wpCat.slug, description },
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

/** ------------------ FEATURED IMAGE RESOLUTION ------------------ */

function resolveUrlFromWpMediaObject(m: any): string | undefined {
  return (
    m?.source_url ||
    m?.media_details?.sizes?.full?.source_url ||
    m?.media_details?.sizes?.large?.source_url ||
    m?.media_details?.sizes?.medium_large?.source_url ||
    m?.guid?.rendered ||
    undefined
  );
}

async function resolveFeaturedMediaFromPost(wpPost: WPPost): Promise<{ url?: string; alt?: string; caption?: string }> {
  const embedded = wpPost._embedded?.["wp:featuredmedia"]?.[0];
  const embeddedUrl = resolveUrlFromWpMediaObject(embedded);
  if (embeddedUrl) {
    return {
      url: embeddedUrl,
      alt: embedded?.alt_text || "",
      caption: embedded?.caption?.rendered ? stripHtml(embedded.caption.rendered) : "",
    };
  }

  const featuredId = wpPost.featured_media;
  if (typeof featuredId === "number" && featuredId > 0) {
    const media = await fetchJson<WPMedia>(`${WP_API}/media/${featuredId}`);
    const url = resolveUrlFromWpMediaObject(media);
    return {
      url,
      alt: media.alt_text || "",
      caption: media.caption?.rendered ? stripHtml(media.caption.rendered) : "",
    };
  }

  return {};
}

/** ------------------ LEXICAL BUILDERS ------------------ */

type InlineCtx = { bold?: boolean; italic?: boolean };

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
  return { type: "paragraph", version: 1, direction: null, format: "", indent: 0, children: childrenInline };
}

function makeHeading(tag: string, childrenInline: any[]) {
  return { type: "heading", version: 1, tag, direction: null, format: "", indent: 0, children: childrenInline };
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
  return { type: "list", version: 1, listType, direction: null, format: "", indent: 0, children: items };
}

function makeListItem(childrenInline: any[]) {
  return {
    type: "listitem",
    version: 1,
    direction: null,
    format: "",
    indent: 0,
    children: [makeParagraph(childrenInline)],
  };
}

async function htmlToLexical(payload: any, html: string) {
  const dom = new JSDOM(`<body>${html || ""}</body>`);
  const document = dom.window.document;

  const rootChildren: any[] = [];

  for (const br of Array.from(document.body.querySelectorAll("br"))) {
    br.replaceWith(document.createTextNode("\n"));
  }

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

    if (tag.startsWith("h")) {
      const inline = parseInlineChildren(el);
      if (inline.length) rootChildren.push(makeHeading(tag, inline));
      continue;
    }

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

    if (tag === "figure") {
      const img = el.querySelector("img");
      const figcaption = el.querySelector("figcaption");

      if (img) {
        const src = getBestImageUrl(img);
        const alt = img.getAttribute("alt") || "";
        const caption = figcaption ? stripHtml(figcaption.innerHTML) : "";

        const mediaId = src ? await createOrReuseMedia(payload, src, alt, caption) : undefined;
        if (mediaId) rootChildren.push(makeUpload(mediaId));
      }
      continue;
    }

    if (tag === "img") {
      const src = getBestImageUrl(el);
      const alt = el.getAttribute("alt") || "";
      const mediaId = src ? await createOrReuseMedia(payload, src, alt, "") : undefined;
      if (mediaId) rootChildren.push(makeUpload(mediaId));
      continue;
    }

    if (tag === "p" || tag === "blockquote") {
      const imgs = Array.from(el.querySelectorAll("img"));

      if (!imgs.length) {
        const inline = parseInlineChildren(el);
        const parts = splitParagraphByNewlines(inline);
        for (const pChildren of parts) rootChildren.push(makeParagraph(pChildren));
        continue;
      }

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

      const inlineWithTokens = parseInlineChildren(clone);
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
        if (i < uploadedIds.length) rootChildren.push(makeUpload(uploadedIds[i]));
      }

      continue;
    }
  }

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
  const postMap = await readPostMap();

  console.log("Fetching 10 posts from WordPress...");
  const posts = await fetchJson<WPPost[]>(`${WP_API}/posts?per_page=10&_embed=1`);

  for (const wpPost of posts) {
    console.log("Importing:", wpPost.slug);

    const title = stripHtml(wpPost.title?.rendered || "");
    const excerpt = stripHtml(wpPost.excerpt?.rendered || "");

    // AUTHOR (try to fetch email with context=edit; fallback to synthetic)
    const wpAuthor = await fetchWpUserWithEmail(wpPost.author);
    const authorId = await upsertUser(payload, wpAuthor);

    // CATEGORIES
    const categoryIds: string[] = [];
    for (const catId of wpPost.categories || []) {
      const wpCat = await fetchJson<WPCategory>(`${WP_API}/categories/${catId}`);
      categoryIds.push(await upsertCategory(payload, wpCat));
    }

    // FEATURED IMAGE
    let featuredImageId: string | undefined;
    try {
      const featuredInfo = await resolveFeaturedMediaFromPost(wpPost);
      if (featuredInfo.url) {
        featuredImageId = await createOrReuseMedia(payload, featuredInfo.url, featuredInfo.alt, featuredInfo.caption);
      }
    } catch (e: any) {
      console.warn(`  ⚠ Featured media failed for ${wpPost.slug}:`, e?.message || e);
    }

    // CONTENT
    const lexicalContent = await htmlToLexical(payload, wpPost.content?.rendered || "");

    // SEO (required)
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

    // Slug update strategy (wpId -> payloadId map)
    const wpIdKey = String(wpPost.id);
    const mappedPayloadId = postMap[wpIdKey];

    if (mappedPayloadId) {
      await payload.update({ collection: "posts", id: mappedPayloadId, data: dataToSave });
    } else {
      const existingBySlug = await payload.find({
        collection: "posts",
        where: { slug: { equals: wpPost.slug } },
        limit: 1,
      });

      if (existingBySlug.docs.length) {
        const payloadId = existingBySlug.docs[0].id as string;
        await payload.update({ collection: "posts", id: payloadId, data: dataToSave });
        postMap[wpIdKey] = payloadId;
      } else {
        const created = await payload.create({ collection: "posts", data: dataToSave });
        postMap[wpIdKey] = created.id as string;
      }
    }

    await writePostMap(postMap);
  }

  console.log("IMPORT FINISHED");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
