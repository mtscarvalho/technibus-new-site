"use client";

import { Button, ButtonProps } from "@/components/Button";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createContext, useContext, useState, type ReactNode } from "react";

type WhatsAppDialogContextType = {
  openDialog: () => void;
  closeDialog: () => void;
};

const WhatsAppDialogContext = createContext<WhatsAppDialogContextType | undefined>(undefined);

export function NewsletterDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <WhatsAppDialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-brand-primary border-secondary max-md:subheading border-b pb-3 text-xl font-medium">Newsletter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              <strong className="font-semibold">Receba as principais notícias, análises e tendências</strong> do transporte moderno diretamente no seu e-mail e acompanhe
              atualizações em tempo real pelo nosso canal oficial.
            </p>
            <NewsletterForm />
          </div>
        </DialogContent>
      </Dialog>
    </WhatsAppDialogContext.Provider>
  );
}

export function useNewsletterDialog() {
  const ctx = useContext(WhatsAppDialogContext);
  if (!ctx) {
    throw new Error("useWhatsAppDialog must be used inside <GlobalDialogProvider>.");
  }
  return ctx;
}

export function NewsletterDialogButton(props: ButtonProps) {
  const { openDialog } = useNewsletterDialog();

  return (
    <Button
      {...props}
      data-ga4-tracking="newsletter-button"
      onClick={(e) => {
        props.onClick?.(e);
        openDialog();
      }}
    />
  );
}
