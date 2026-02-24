import { DefaultNodeTypes, SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { RichText as ConvertRichText, JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";

import { SpotifyEmbed, SpotifyEmbedProps } from "@/components/SpotifyEmbed";
import { YouTubeEmbed, YouTubeEmbedProps } from "@/components/YoutubeEmbed";

type RichTextProps = {
  data: SerializedEditorState;
};

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<YouTubeEmbedProps> | SerializedBlockNode<SpotifyEmbedProps>;

export function RichText({ data }: RichTextProps) {
  const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
    ...defaultConverters,
    blocks: {
      youtubeEmbed: ({ node }: { node: SerializedBlockNode<YouTubeEmbedProps> }) => <YouTubeEmbed {...node.fields} />,
      spotifyEmbed: ({ node }: { node: SerializedBlockNode<SpotifyEmbedProps> }) => <SpotifyEmbed {...node.fields} />,
    },
  });

  return <ConvertRichText converters={jsxConverters} data={data} />;
}
