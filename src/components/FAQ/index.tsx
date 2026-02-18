import { Faq } from "@/payload-types";

import { fetchAllFaqs } from "@/collections/FAQ/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/Accordion";
import { RichText } from "@/components/RichText";

type FAQProps = {
  extra?: Faq[];
};

export async function FAQ({ extra }: FAQProps) {
  const faq = await fetchAllFaqs();

  return (
    <section className="bg-brand-tertiary overflow-hidden py-24">
      <div className="relative container max-w-3xl">
        <div className="space-y-6">
          <h2 className="heading text-on-brand-tertiary text-center">Dúvidas frequentes</h2>
          <div className="relative z-0 space-y-4">
            <Accordion>
              {extra &&
                extra.length > 0 &&
                extra.map((item) => (
                  <AccordionItem key={item.id} variant="light" value={item.title}>
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent>
                      <RichText data={item.content} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              {faq.map((item) => (
                <AccordionItem key={item.id} variant="light" value={item.title}>
                  <AccordionTrigger>{item.title}</AccordionTrigger>
                  <AccordionContent>
                    <RichText data={item.content} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
