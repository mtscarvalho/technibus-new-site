import { DefaultNodeTypes, SerializedBlockNode } from "@payloadcms/richtext-lexical";

import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { RichText as ConvertRichText, JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";

import { YouTubeEmbed, YouTubeEmbedProps } from "@/components/YoutubeEmbed";

type RichTextProps = {
  data: SerializedEditorState;
};

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<YouTubeEmbedProps>;

export function RichText({ data }: RichTextProps) {
  const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
    ...defaultConverters,
    blocks: {
      YoutubeEmbed: ({ node }: { node: SerializedBlockNode<YouTubeEmbedProps> }) => <YouTubeEmbed {...node.fields} />,
    },
  });

  return <ConvertRichText converters={jsxConverters} data={data} />;
}
