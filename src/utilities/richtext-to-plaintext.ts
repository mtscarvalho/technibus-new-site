/**
 * Extracts plain text from a Payload Lexical editor state.
 * - Removes formatting/marks
 * - Ignores links/inline formatting (keeps their children text)
 * - Keeps sensible spacing between blocks
 */

import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export function richTextToPlainText(
  data?: SerializedEditorState | null,
  opts?: {
    blockSeparator?: string;
    listItemSeparator?: string;
    normalizeWhitespace?: boolean;
  },
): string {
  const blockSep = opts?.blockSeparator ?? "\n";
  const liSep = opts?.listItemSeparator ?? "\n";
  const normalize = opts?.normalizeWhitespace ?? true;

  if (!data?.root) return "";

  const isTextNode = (node: any) => node?.type === "text" && typeof node?.text === "string";

  const extractFromNode = (node: any): string => {
    if (!node) return "";

    // Text nodes
    if (isTextNode(node)) return node.text;

    // If it has children, recurse into them
    const children: any[] = Array.isArray(node.children) ? node.children : [];
    const childText = children.map(extractFromNode).join("");

    // Block-ish nodes: add separators around them
    switch (node.type) {
      case "paragraph":
      case "heading":
      case "quote":
        return childText + blockSep;

      case "linebreak":
        return "\n";

      case "list":
        // children are listitem nodes
        return children.map(extractFromNode).join("") + blockSep;

      case "listitem":
        // listitem usually contains paragraph/text children
        return childText.trimEnd() + liSep;

      case "link":
        // ignore href/attrs, keep text
        return childText;

      default:
        // For custom blocks (e.g. YoutubeEmbed), Payload stores them as block nodes.
        // Usually they don't have meaningful text; if they do, we keep it.
        return childText;
    }
  };

  let out = extractFromNode(data.root);

  // Trim trailing separators
  out = out.replace(new RegExp(`${escapeRegExp(blockSep)}+$`), "");
  out = out.replace(new RegExp(`${escapeRegExp(liSep)}+$`), "");

  if (normalize) {
    // collapse spaces and remove excessive blank lines
    out = out
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  return out;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
