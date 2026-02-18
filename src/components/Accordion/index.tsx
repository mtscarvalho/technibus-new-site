"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type ContextType = {
  activeItem: string[];
  toggleItem: (value: string) => void;
};

type AccordionProps = {
  defaultValue?: string;
  children: ReactNode;
};

const AccordionContext = createContext<ContextType | undefined>(undefined);

export const Accordion = ({ defaultValue, children }: AccordionProps) => {
  const [activeItem, setActiveItem] = useState<string[]>([defaultValue as string]);

  const toggleItem = (value: string) => {
    setActiveItem((prevActiveItem) => {
      return prevActiveItem.includes(value) ? [] : [value];
    });
  };

  return <AccordionContext.Provider value={{ activeItem, toggleItem }}>{children}</AccordionContext.Provider>;
};

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionContext must be used within an Accordion");
  }
  return context;
};

export { AccordionContent } from "@/components/Accordion/AccordionContent";
export { AccordionItem } from "@/components/Accordion/AccordionItem";
export { AccordionTrigger } from "@/components/Accordion/AccordionTrigger";
