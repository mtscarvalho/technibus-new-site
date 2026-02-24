// scripts/import-wp-10-posts.ts
import "dotenv/config";

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { JSDOM } from "jsdom";
import { getPayload } from "payload";
import payloadConfig from "../src/payload.config"; // adjust if needed

/**
 * IMPORTANT
 * - This script imports:
 *   - Posts (title, excerpt, categories, featured image, content richText, SEO meta)
 *   - Users (authors) and relates to posts via `author` field (relationship to "users")
 *   - Media (featured + inline body <img>/<figure>) and relates in richText via upload nodes
 *
 * REQUIREMENTS IN YOUR PAYLOAD SCHEMA
 * - Posts must have: `author` relationship field -> relationTo: "users"
 *   Example:
 *     { name: "author", type: "relationship", relationTo: "users" }
 */

const WP_BASE = process.env.WP_BASE || "https://technibus.com.br"; // <-- set env or replace
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
  // avoid weird ext values
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

/** ------------------ CACHES (avoid duplicates) ------------------ */
const userIdByWpId = new Map<number, string>();
const categoryIdByWpSlug = new Map<string, string>();
const mediaIdByUrl = new Map<string, string>();

/** ------------------ PAYLOAD UPSERTS ------------------ */

async function upsertUser(payload: any, wpAuthor: WPUser) {
  if (userIdByWpId.has(wpAuthor.id)) return userIdByWpId.get(wpAuthor.id)!;

  // WP often doesn't expose email publicly; we use a stable synthetic email
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
    // Keep data updated (name/bio may change)
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
        password: randomPassword(), // required because users is auth collection
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

  let doc;
  if (existing.docs.length) {
    doc = await payload.update({
      collection: "categories",
      id: existing.docs[0].id,
      data: {
        title: wpCat.name,
        description: (wpCat.description || "").trim() || "Importado do WordPress",
      },
    });
  } else {
    doc = await payload.create({
      collection: "categories",
      data: {
        title: wpCat.name,
        slug: wpCat.slug,
        description: (wpCat.description || "").trim() || "Importado do WordPress",
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

/**
 * Parse inline children, preserving:
 * - strong/b/em/i formatting (text.format bitmask)
 * - links (Payload link node with `fields`)
 *
 * NOTE: We DO NOT handle <img> here because images are block-level in our output.
 * Images are handled in the block walker (p/figure/img).
 */
function parseInlineChildren(node: Node, ctx: InlineCtx = {}): any[] {
  const out: any[] = [];

  for (const child of Array.from(node.childNodes)) {
    // text node
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

    // fallback: recurse
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
 * - Imports inline images (<img>) and figure images (<figure><img> + <figcaption>)
 * - Outputs upload nodes related to "media"
 */
async function htmlToLexical(payload: any, html: string) {
  const dom = new JSDOM(`<body>${html || ""}</body>`);
  const document = dom.window.document;

  const rootChildren: any[] = [];

  // Ensure <br> becomes real newline text
  for (const br of Array.from(document.body.querySelectorAll("br"))) {
    br.replaceWith(document.createTextNode("\n"));
  }

  /**
   * Walk blocks in DOM order.
   * We don't rely only on querySelectorAll("p,...") because we need <img> placement too.
   */
  function* walk(node: Element): Generator<Element> {
    for (const child of Array.from(node.children)) {
      const tag = child.tagName.toLowerCase();

      // treat these as blocks
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

      // Gutenberg wrappers often use div/section/article
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

    // Paragraph-like
    if (tag === "p" || tag === "blockquote") {
      // If a paragraph contains images, split into:
      // paragraph -> upload -> paragraph ...
      const segments: any[] = [];
      let buffer: any[] = [];

      for (const child of Array.from(el.childNodes)) {
        if (child.nodeType === 1 && (child as Element).tagName.toLowerCase() === "img") {
          // flush buffer as paragraph(s)
          const parts = splitParagraphByNewlines(mergeAdjacentText(buffer));
          for (const part of parts) {
            if (part.length) segments.push(makeParagraph(part));
          }
          buffer = [];

          const img = child as Element;
          const src = img.getAttribute("src") || "";
          const alt = img.getAttribute("alt") || "";
          const mediaId = await createOrReuseMedia(payload, src, alt, "");
          if (mediaId) segments.push(makeUpload(mediaId));
          continue;
        }

        // otherwise keep inline parsing
        buffer.push(...parseInlineChildren(child, {}));
      }

      // flush remaining buffer
      const parts = splitParagraphByNewlines(mergeAdjacentText(buffer));
      for (const part of parts) {
        if (part.length) segments.push(makeParagraph(part));
      }

      // Add segments to root
      for (const seg of segments) rootChildren.push(seg);

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

    // Figure: upload image + optional caption as paragraph
    if (tag === "figure") {
      const img = el.querySelector("img");
      const figcaption = el.querySelector("figcaption");

      if (img) {
        const src = img.getAttribute("src") || "";
        const alt = img.getAttribute("alt") || "";
        const caption = figcaption ? stripHtml(figcaption.innerHTML) : "";

        const mediaId = await createOrReuseMedia(payload, src, alt, caption);
        if (mediaId) rootChildren.push(makeUpload(mediaId));

        if (caption) {
          rootChildren.push(
            makeParagraph([
              {
                type: "text",
                version: 1,
                text: caption,
                format: 0,
                detail: 0,
                mode: "normal",
                style: "",
              },
            ]),
          );
        }
      }
      continue;
    }

    // Standalone image
    if (tag === "img") {
      const src = el.getAttribute("src") || "";
      const alt = el.getAttribute("alt") || "";
      const mediaId = await createOrReuseMedia(payload, src, alt, "");
      if (mediaId) rootChildren.push(makeUpload(mediaId));
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
      author: authorId, // ✅ relates post -> users
    };

    // Upsert by slug (safe to re-run)
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
