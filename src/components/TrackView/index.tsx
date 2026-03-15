"use client";

import { useEffect, useRef } from "react";

type TrackViewProps = {
  postId: string | number;
};

export function TrackView({ postId }: TrackViewProps) {
  // useRef evita que o useEffect dispare duas vezes em Strict Mode no desenvolvimento
  const hasTracked = useRef(false);

  useEffect(() => {
    // 1. Previne execuções duplicadas (Strict Mode) e no lado do servidor (caso vaze)
    if (typeof window === "undefined" || hasTracked.current) return;

    // 2. Verifica se esta sessão já contou uma view para este post específico
    //const sessionKey = `viewed_post_${postId}`;
    //if (sessionStorage.getItem(sessionKey)) return;

    // 3. Marca como rastreado para esta renderização
    hasTracked.current = true;

    // 4. Dispara a requisição silenciosa em background (fire and forget)
    // O endpoint precisa bater com o caminho que você configurou no Payload
    fetch("/api/daily-views/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
      // keepalive: true garante que o fetch termine mesmo se o usuário fechar a aba rápido
      keepalive: true,
    })
      .then((res) => {
        if (res.ok) {
          // Salva no sessionStorage para evitar que F5 inflem os números
          //sessionStorage.setItem(sessionKey, 'true');
        }
      })
      .catch((error) => {
        // Apenas um log silencioso em caso de erro, não queremos travar a UI
        console.error("Erro ao registrar visualização:", error);
      });
  }, [postId]);

  // Este componente não renderiza nada na tela
  return null;
}
