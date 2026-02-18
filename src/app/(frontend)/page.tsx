import { createMetadata } from "@/utilities/create-metadata";

import { Card } from "@/components/Card";

export function generateMetadata() {
  return createMetadata({
    path: "/",
    title: "Minha empresa | Slogan",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  });
}

export default function Page() {
  return (
    <main>
      <section className="pt-10 pb-24">
        <div className="container grid grid-cols-12 gap-10">
          <div className="col-span-9">
            <h2 className="text-primary border-secondary mb-8 border-b pb-3 text-2xl font-medium">Destaques</h2>
            <div className="mb-8 grid grid-cols-12 gap-x-6 gap-y-8">
              <div className="col-span-8">
                <Card
                  url="/post/volvo"
                  category="Transporte"
                  title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus"
                  description="Neste episódio do Podcast do Transporte a empresária Niege Chaves, da MobiBrasil, revela as experiências da empresa com diferentes matrizes energéticas, do etanol ao gás, até chegar à eletrificação em São Paulo."
                  image={{ url: "/placeholder.jpg", alt: "Volvo", width: 1000, height: 1000 }}
                  size="sm"
                />
              </div>
              <div className="col-span-4 grid gap-8">
                <Card
                  url="/post/volvo"
                  category="Transporte"
                  title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus"
                  image={{ url: "/placeholder.jpg", alt: "Volvo", width: 1000, height: 1000 }}
                  size="sm"
                />
                <Card
                  url="/post/volvo"
                  category="Transporte"
                  title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus"
                  image={{ url: "/placeholder.jpg", alt: "Volvo", width: 1000, height: 1000 }}
                  size="sm"
                />
              </div>
            </div>
            <h2 className="text-primary border-secondary mb-8 border-b pb-3 text-2xl font-medium">Últimas publicações</h2>
            <div className="grid auto-rows-min gap-x-6 gap-y-8 md:grid-cols-3">
              <Card
                url="/post/volvo"
                category="Transporte"
                title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus"
                image={{ url: "/placeholder.jpg", alt: "Volvo", width: 1000, height: 1000 }}
                size="sm"
              />
              <Card
                url="/post/volvo"
                category="Transporte"
                title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus"
                image={{ url: "/placeholder.jpg", alt: "Volvo", width: 1000, height: 1000 }}
                size="sm"
              />
              <Card
                url="/post/volvo"
                category="Transporte"
                title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus"
                image={{ url: "/placeholder.jpg", alt: "Volvo", width: 1000, height: 1000 }}
                size="sm"
              />
              <Card url="/post/volvo" category="Transporte" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
              <Card url="/post/volvo" category="Transporte" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
              <Card url="/post/volvo" category="Transporte" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
              <Card url="/post/volvo" category="Transporte" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
              <Card url="/post/volvo" category="Transporte" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
              <Card url="/post/volvo" category="Transporte" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
            </div>
          </div>
          <div className="col-span-3 space-y-8">
            <h2 className="text-primary border-secondary mb-8 border-b pb-3 text-2xl font-medium">Mais lidos</h2>
            <ol className="space-y-2">
              <li>
                <Card category="Transporte" url="/post/volvo" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
              </li>
              <li>
                <Card category="Transporte" url="/post/volvo" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
              </li>
              <li>
                <Card category="Transporte" url="/post/volvo" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
              </li>
              <li>
                <Card category="Transporte" url="/post/volvo" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
              </li>
              <li>
                <Card category="Transporte" url="/post/volvo" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
              </li>
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
