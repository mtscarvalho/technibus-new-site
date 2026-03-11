import { PayloadHandler, PayloadRequest } from "payload";
import sharp from "sharp";

export const convertImage: PayloadHandler = async (req: PayloadRequest) => {
  try {
    if (!req.url) {
      return Response.json({ error: "URL da requisição não encontrada." }, { status: 400 });
    }

    // 1. Extrair os parâmetros da URL
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");
    const width = parseInt(searchParams.get("w") || "1080", 10);
    const height = parseInt(searchParams.get("h") || "1080", 10);

    if (!imageUrl) {
      return Response.json({ error: 'O parâmetro "url" é obrigatório.' }, { status: 400 });
    }

    // 2. Lidar com URLs relativas (caso o Payload retorne /media/imagem.webp)
    const siteUrl = process.env.SITE_URL || "http://localhost:3000";
    const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : `${siteUrl}${imageUrl}`;

    // 3. Buscar a imagem original
    const imageRes = await fetch(fullImageUrl);

    if (!imageRes.ok) {
      return Response.json({ error: "Falha ao buscar a imagem de origem." }, { status: 404 });
    }

    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Processar com o Sharp (WebP para JPG redimensionado)
    const processedImage = await sharp(buffer).resize(width, height, { fit: "cover", position: "center" }).jpeg({ quality: 90, mozjpeg: true }).toBuffer();

    // 5. Retornar a imagem como buffer puro e cabeçalho correto
    return new Response(processedImage as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Erro na conversão de imagem:", error);
    return Response.json({ error: "Erro interno no processamento da imagem." }, { status: 500 });
  }
};
