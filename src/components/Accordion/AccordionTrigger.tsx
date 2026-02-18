import { ReactNode } from "react";

import { Minus, Plus } from "lucide-react";

import { useEscapeKey } from "@/hooks/useEscapeKey";
import { cn } from "@/utilities/cn";

import { useAccordionContext } from "@/components/Accordion";

type Props = {
  value?: string;
  variant?: string;
  isOpen?: boolean;
  children: ReactNode;
};

export const AccordionTrigger = ({ value, variant, isOpen, children }: Props) => {
  const { toggleItem } = useAccordionContext();

  const handleClick = () => {
    if (value) {
      toggleItem(value);
    }
  };

  useEscapeKey(() => {
    if (isOpen && value) {
      toggleItem(value);
    }
  });

  return (
    <button className="flex w-full cursor-pointer items-center gap-4 rounded-lg px-4 py-3 text-left text-lg font-semibold" id={`accordion-btn-${value}`} aria-controls={`accordion-content-${value}`} type="button" onClick={handleClick} {...(isOpen ? { "aria-expanded": "true" } : { "aria-expanded": "false" })}>
      {children}
      <span className={cn(variant == "light" ? "text-secondary-dark" : "text-primary", "ml-auto")}>{isOpen ? <Minus /> : <Plus />}</span>
    </button>
  );
};
