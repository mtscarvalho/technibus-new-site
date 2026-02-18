type AccordionContentProps = {
  value?: string;
  isOpen?: boolean;
  children?: React.ReactNode;
};

export const AccordionContent = ({ value, isOpen, children }: AccordionContentProps) => {
  return (
    <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`} role="region" aria-labelledby={`accordion-btn-${value}`} id={`accordion-content-${value}`}>
      <div className={`-mt-2 overflow-hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
        <div className="justify mx-4 mb-6">{children}</div>
      </div>
    </div>
  );
};
