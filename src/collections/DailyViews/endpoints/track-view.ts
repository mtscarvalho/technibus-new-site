import { PayloadHandler, PayloadRequest } from "payload";

type TrackViewRequestBody = {
  postId: number;
};

export const trackView: PayloadHandler = async (req: PayloadRequest) => {
  try {
    // 1. Extrair o body da requisição (como é um POST, usamos req.json())
    let postId: number | undefined = undefined;
    if (typeof req.json === "function") {
      const body: TrackViewRequestBody = await req.json();
      postId = Number(body?.postId);
    }

    if (!postId) {
      return Response.json({ error: "O parâmetro 'postId' é obrigatório no corpo da requisição." }, { status: 400 });
    }

    // A instância do payload já está embutida no request nativo do CMS
    const { payload } = req;

    // 2. Zerar as horas, minutos e segundos para garantir o agrupamento (Meia-noite UTC)
    const now = new Date();
    const todayAtMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();

    // 3. Buscar se já existe um registro para este post exatamente neste dia
    const existingRecord = await payload.find({
      collection: "daily-views",
      where: {
        and: [{ post: { equals: postId } }, { date: { equals: todayAtMidnight } }],
      },
      limit: 1,
    });

    // 4. Atualizar ou Criar o registro
    if (existingRecord.docs.length > 0) {
      // Já teve view hoje, então apenas atualizamos somando +1
      const doc = existingRecord.docs[0];
      await payload.update({
        collection: "daily-views",
        id: doc.id,
        data: { views: doc.views + 1 },
      });
    } else {
      // Primeira view do dia, criamos o registro inicial
      await payload.create({
        collection: "daily-views",
        data: {
          post: postId,
          date: todayAtMidnight,
          views: 1,
        },
      });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao registrar visualização:", error);
    return Response.json({ error: "Erro interno ao processar a visualização." }, { status: 500 });
  }
};
