import { DiscordService } from "@/lib/discord";
import { Media } from "@/payload-types";
import { PayloadHandler, PayloadRequest } from "payload";

export const sendToSocial: PayloadHandler = async (req: PayloadRequest) => {
  const { id } = req.routeParams || {};
  let post;

  try {
    // 1. Buscar a URL do Zapier no Global
    const settings = await req.payload.findGlobal({
      slug: "social-media-settings",
    });

    if (!settings.zapierEndpointUrl) {
      return Response.json({ error: "Endpoint do Zapier não configurado." }, { status: 400 });
    }

    // 2. Buscar os dados do Post
    post = await req.payload.findByID({
      collection: "posts",
      id: id as string,
    });

    const siteUrl = process.env.SITE_URL || "http://localhost:3000";
    const originalImageUrl = (post.image as Media)?.url || "";

    // Constrói a URL que o Zapier vai chamar para pegar a imagem convertida
    const convertedImageUrl = originalImageUrl ? `${siteUrl}/api/posts/convert-image?url=${encodeURIComponent(originalImageUrl)}&w=1080&h=1080` : "";

    // Formatar os dados conforme sua imagem enviada
    const payloadData = {
      title: post.title,
      excerpt: post.excerpt,
      url: `${process.env.SITE_URL}${post.relPermalink}`,
      featured_image_url: convertedImageUrl,
    };

    // 3. Enviar para o Zapier
    const zapierResponse = await fetch(settings.zapierEndpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadData),
    });

    if (!zapierResponse.ok) throw new Error("Falha ao enviar para o Zapier");

    // 4. Atualizar o post marcando como enviado
    await req.payload.update({
      collection: "posts",
      id: id as string,
      data: {
        socialPublished: true,
      },
    });

    return Response.json({ success: true, message: "Enviado com sucesso!" });
  } catch (error: any) {
    const message = error?.message || error;
    await DiscordService.send("", {
      mentionRoles: ["779373996868108321"],
      embeds: [
        {
          title: `[${process.env.SITE_TITLE}] Erro ao enviar post para rede social`,
          description: `Houve um erro ao enviar post **${post?.title || "desconhecido"}** para rede social.`,
          color: 16711680, // Red
          fields: [{ name: "Erro", value: String(message) }],
        },
      ],
    });
    return Response.json({ error: message }, { status: 500 });
  }
};
