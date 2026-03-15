// TODO: Remover após rodar uma vez no banco em produção para popular a collection de DailyViews com dados históricos
import { PayloadHandler, PayloadRequest } from "payload";

export const seedDailyViews: PayloadHandler = async (req: PayloadRequest) => {
  try {
    const { payload } = req;
    let totalRecordsCreated = 0;
    let postsProcessed = 0;

    const today = new Date();

    // 1. Busca APENAS os 30 posts com MAIOR viewCount
    const topPosts = await payload.find({
      collection: "posts", // Ajuste para o slug da sua collection se for diferente
      limit: 30,
      sort: "-viewCount", // O sinal de menos (-) faz a ordenação decrescente (do maior pro menor)
      where: {
        viewCount: { greater_than: 0 },
      },
    });

    // 2. Loop apenas nestes 30 posts
    for (const post of topPosts.docs) {
      const totalViews = post.viewCount || 0;

      const daysToDistribute = 30;
      const baseViewsPerDay = Math.floor(totalViews / daysToDistribute);
      const remainder = totalViews % daysToDistribute;

      // 3. Distribui as views nos últimos 30 dias
      for (let i = 0; i < daysToDistribute; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Converte para a meia-noite UTC para manter o padrão
        const dateAtMidnight = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString();

        let viewsForThisDay = baseViewsPerDay;

        // Joga a "sobra" da divisão no dia de hoje
        if (i === 0) {
          viewsForThisDay += remainder;
        }

        if (viewsForThisDay > 0) {
          await payload.create({
            collection: "daily-views",
            data: {
              post: post.id,
              date: dateAtMidnight,
              views: viewsForThisDay,
            },
          });
          totalRecordsCreated++;
        }
      }
      postsProcessed++;
    }

    return Response.json(
      {
        success: true,
        message: "Seed dos Top 100 finalizado com sucesso!",
        postsProcessed,
        totalRecordsCreated,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Erro no Seed de Visualizações:", error);
    return Response.json({ error: "Erro interno durante o processamento do Seed." }, { status: 500 });
  }
};
