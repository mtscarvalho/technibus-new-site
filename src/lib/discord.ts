// lib/discord.ts
//import * as Sentry from "@sentry/nextjs";

export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  footer?: { text: string; icon_url?: string };
  timestamp?: string;
  url?: string;
  image?: { url: string };
}

export interface DiscordMessageOptions {
  username?: string;
  avatarUrl?: string;
  embeds?: DiscordEmbed[];
  webhookUrl?: string;

  // Controles de Menção
  mentionEveryone?: boolean;
  mentionUsers?: string[]; // Array de IDs de usuários (ex: ["123456789"])
  mentionRoles?: string[]; // Array de IDs de cargos (ex: ["987654321"])
}

// role dev jogajunto 779373996868108321

export class DiscordService {
  /**
   * Envia notificação diretamente (Método Estático)
   *
   *  Colors:
   *
   *  White             16777215
   *  Greyple	        10070709
   *  Black	            2303786
   *  DarkButNotBlack	2895667
   *  NotQuiteBlack	    2303786
   *  Blurple	        5793266
   *  Green	            5763719
   *  Yellow	        16705372
   *  Fuchsia	        15418782
   *  Red	            15548997
   *
   * @param content Texto principal da mensagem
   * @param options Opções adicionais (username, avatar, embeds, menções, etc)
   * @returns void
   */
  static async send(content: string, options: DiscordMessageOptions = {}): Promise<void> {
    const url = options.webhookUrl || process.env.DISCORD_WEBHOOK_URL;

    if (!url) {
      console.error("❌ Discord Webhook URL não configurada.");
      return;
    }

    const { username = "Payload Bot", avatarUrl, embeds, mentionEveryone = false, mentionUsers = [], mentionRoles = [] } = options;

    // Lógica para adicionar as menções ao texto final
    let finalContent = content;

    // Adiciona menções de Usuários ao final da mensagem
    if (mentionUsers.length > 0) {
      const userMentions = mentionUsers.map((id) => `<@${id}>`).join(" ");
      finalContent += `\n${userMentions}`;
    }

    // Adiciona menções de Cargos ao final da mensagem
    if (mentionRoles.length > 0) {
      const roleMentions = mentionRoles.map((id) => `<@&${id}>`).join(" ");
      finalContent += `\n${roleMentions}`;
    }

    // Case exists embeds, add timestamp in all embeds that don't have it
    const finalEmbeds = embeds?.map((embed) => {
      if (!embed.timestamp) {
        return { ...embed, timestamp: new Date().toISOString() };
      }
      // default footer
      if (!embed.footer) {
        return { ...embed, footer: { text: "Jogajunto GitHub Listener", icon_url: "https://jogajunto.co/apple-touch-icon.png" } };
      }
      return embed;
    });

    const payload = {
      content: finalContent,
      username: username,
      avatar_url: avatarUrl,
      embeds: finalEmbeds,
      allowed_mentions: {
        // "parse" diz ao Discord o que ele deve transformar em notificação
        // Sempre permitimos users e roles, mas everyone é opcional por segurança
        parse: mentionEveryone ? ["everyone", "users", "roles"] : ["users", "roles"],
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(`Erro Discord: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Falha na requisição ao Discord:", error);
      //Sentry.captureException(error);
    }
  }
}
