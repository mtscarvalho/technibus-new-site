import { Children, cloneElement, isValidElement, ReactNode } from "react";

import { tv, VariantProps } from "tailwind-variants";

import { useAccordionContext } from "@/components/Accordion";

const accordionVariants = tv({
  base: "rounded-lg border",
  variants: {
    variant: {
      dark: "bg-secondary-darkest text-grey-lighter",
      light: "bg-default border-default text-primary",
    },
  },
});

type AccordionItemProps = {
  value: string;
  children: ReactNode;
} & VariantProps<typeof accordionVariants>;

type AccordionItemChildProps = {
  value: string;
  isOpen: boolean;
  children: ReactNode;
} & VariantProps<typeof accordionVariants>;

export const AccordionItem = ({ value, variant, children }: AccordionItemProps) => {
  const { activeItem } = useAccordionContext();
  const isOpen = activeItem.includes(value);
  const classes = accordionVariants({ variant });

  return (
    <div className={classes} id={`accordion-${value}`}>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, { isOpen, value, variant } as AccordionItemChildProps);
        }
        return child;
      })}
    </div>
  );
};
