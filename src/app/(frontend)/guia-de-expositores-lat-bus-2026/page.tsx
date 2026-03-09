import { fetchAllLatBusCategories } from "@/collections/LatBusCategories/data";
import { fetchExibithors } from "@/collections/LatBusExibithors/data";
import { FilterExibithors } from "@/components/FilterExibithors";
import { PayloadImage } from "@/components/Payload/Image";
import { WhatsApp } from "@/components/SocialIcon";
import { SectionHeading, SectionHeadingTitle } from "@/components/TitleWithDivider";
import { LatBusCategory, Media } from "@/payload-types";
import { createMetadata } from "@/utilities/create-metadata";
import { Mail } from "lucide-react";

type PageArgs = {
  searchParams: Promise<{
    s?: string;
    categoria?: string;
  }>;
};

export async function generateMetadata({ searchParams }: PageArgs) {
  const { s } = await searchParams;

  return createMetadata({
    path: "/guia-de-expositores-lat-bus-2026",
    title: "Guia dos expositores Lat.Bus 2026",
    description:
      "Explore o Guia dos Expositores da Lat.Bus 2026 e descubra as empresas e marcas que estarão presentes no evento. Encontre informações sobre os expositores, suas ofertas e como entrar em contato.",
  });
}

export default async function Exibithors({ searchParams }: PageArgs) {
  const { s: searchTerm, categoria } = await searchParams;

  const categories = await fetchAllLatBusCategories();

  const query: any = { and: [] };

  if (searchTerm) {
    query.and.push({
      or: [{ title: { like: searchTerm } }, { description: { like: searchTerm } }],
    });
  }

  if (categoria) {
    const selectedCategory = categories.find((c: any) => c.title === categoria);
    if (selectedCategory) {
      query.and.push({ category: { in: [selectedCategory.id] } });
    }
  }

  const where = query.and.length > 0 ? query : undefined;

  const { docs: exibithors } = await fetchExibithors(where);

  return (
    <main className="pt-4 pb-24">
      <div className="container">
        <div className="space-y-6">
          <SectionHeading>
            <SectionHeadingTitle size="lg" asChild>
              <h1>Guia dos expositores Lat.Bus 2026</h1>
            </SectionHeadingTitle>
          </SectionHeading>

          <FilterExibithors categories={categories as LatBusCategory[]} initialCategory={categoria} initialSearch={searchTerm} />
        </div>

        {exibithors.length === 0 ? (
          <div className="mx-auto max-w-2xl space-y-3 p-12 text-center">
            <p className="subheading text-brand-primary text-2xl">Nenhum expositor encontrado</p>
            <p className="text-secondary">
              Não encontramos algo que corresponda aos seus critérios de busca. <br /> Tente ajustar os filtros ou a palavra-chave para encontrar o que procura.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {exibithors.map((exibithor) => {
              const firstCategory = exibithor.category?.[0];
              const categoryTitle = typeof firstCategory === "object" && firstCategory !== null ? firstCategory.title : "Sem Categoria";

              return (
                <div key={exibithor.id} className="flex h-full flex-col gap-4 rounded-xl duration-200">
                  <div className="bg-secondary flex aspect-[4/3] items-center justify-center rounded-lg p-6">
                    {exibithor.logo ? (
                      <PayloadImage image={exibithor.logo as Media} alt={exibithor.title} width={180} height={80} className="max-h-full w-full object-contain" />
                    ) : (
                      <span className="text-center text-lg font-semibold text-balance text-[#0a1e3f]">{exibithor.title}</span>
                    )}
                  </div>

                  {/* Informações Principais */}
                  <div className="flex-1">
                    <span className="uppertitle">{categoryTitle}</span>
                    <h2 className="text-brand-primary mb-2 line-clamp-1 text-lg font-semibold">{exibithor.title}</h2>
                    <p className="mb-2 line-clamp-5 text-sm leading-relaxed text-gray-500">{exibithor.description}</p>
                    {exibithor.website && (
                      <a href={exibithor.website} target="_blank" rel="noopener noreferrer" className="link block truncate text-sm">
                        {exibithor.website.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>

                  <hr className="border-secondary max-w-16" />

                  <div className="mt-auto space-y-2">
                    {exibithor.contact?.name && <p className="truncate text-sm font-semibold text-gray-800">{exibithor.contact.name}</p>}

                    {exibithor.contact?.whatsapp && (
                      <div className="link flex items-center gap-2 text-sm">
                        <WhatsApp className="size-4" />
                        {exibithor.contact.whatsapp}
                      </div>
                    )}

                    {exibithor.contact?.email && (
                      <div className="link flex items-center gap-2 text-sm">
                        <Mail className="size-4" />
                        <a href={`mailto:${exibithor.contact.email}`} className="truncate hover:text-blue-600">
                          {exibithor.contact.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
