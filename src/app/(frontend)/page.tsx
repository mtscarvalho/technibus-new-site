import { createMetadata } from "@/utilities/create-metadata";

import { fetchLatestPosts, fetchPostsByCategorySlug, fetchPostsByTagSlug } from "@/collections/Posts/data";
import Ads from "@/components/Ads";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { FeaturedPosts } from "@/components/FeaturedPosts";
import { MostRead } from "@/components/MostRead";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SectionLatbus } from "@/sections/Latbus";
import { getPostIds } from "@/utilities/get-post-ids";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function generateMetadata() {
  return createMetadata({
    path: "/",
    title: "Technibus | Transporte coletivo e mobilidade urbana",
    description: "A mais tradicional revista brasileira dedicada ao transporte de passageiros por ônibus.",
  });
}

const REVISTAS = [
  { thumb: "/images/thumb-maiores-e-melhores.webp", url: "/", title: "", edition: "38º Edição", date: "Nov/2025" },
  { thumb: "/images/thumb-transporte-moderno.webp", url: "/", title: "", edition: "30º Edição", date: "Ago/2025" },
  { thumb: "/images/thumb-anuario-do-onibus.webp", url: "/", title: "", edition: "33º Edição", date: "Mai/2025" },
  { thumb: "/images/thumb-global.webp", url: "/", title: "", edition: "7º Edição", date: "Abr/2025" },
  { thumb: "/images/thumb-especial.webp", url: "/", title: "", edition: "1º Edição", date: "Nov/2024" },
];

export default async function Page() {
  const featuredPosts = await fetchPostsByTagSlug("destaque", 3);
  const secondaryFeaturedPosts = await fetchPostsByTagSlug("subdestaque", 2, getPostIds(featuredPosts));
  const technibusHistoryPosts = await fetchPostsByCategorySlug("technibus-na-historia", 1);
  const interviewAndOpinionPosts = await fetchPostsByCategorySlug("entrevista-e-opiniao", 1);
  const latbusPosts = await fetchPostsByCategorySlug("latbus", 3);

  const latestPosts = await fetchLatestPosts({
    excludeIds: [
      ...getPostIds(featuredPosts),
      ...getPostIds(secondaryFeaturedPosts),
      ...getPostIds(technibusHistoryPosts),
      ...getPostIds(interviewAndOpinionPosts),
      ...getPostIds(latbusPosts),
    ],
  });

  return (
    <main>
      <section className="relative z-0 min-w-0 pt-4 pb-24">
        <h1 className="sr-only">A mais tradicional revista brasileira dedicada ao transporte de passageiros por ônibus.</h1>
        <div className="container space-y-10">
          <Ads className="mx-auto max-w-5xl" position="main" />
          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            <div className="space-y-10">
              <div className="space-y-3">
                <h2 className="subheading border-secondary text-brand-primary sr-only border-b pb-3">Destaques</h2>
                <div className="mb-8 grid gap-6 lg:grid-cols-12">
                  <div className="min-w-0 lg:col-span-8">
                    <FeaturedPosts posts={featuredPosts} />
                  </div>
                  <div className="grid gap-6 max-lg:grid-cols-2 max-md:grid-cols-1 lg:col-span-4">
                    {secondaryFeaturedPosts.map((post) => (
                      <Card disable={{ excerpt: true }} {...post} key={post.id} size="sm" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid items-start gap-x-6 gap-y-10 md:grid-cols-2">
                <div className="space-y-6">
                  <h2 className="text-brand-primary border-secondary max-md:subheading border-b pb-3 text-xl font-medium">Technibus na história</h2>
                  {technibusHistoryPosts.map((post) => (
                    <Card {...post} key={post.id} size="lg" />
                  ))}
                </div>
                <div className="space-y-6">
                  <h2 className="text-brand-primary border-secondary max-md:subheading border-b pb-3 text-xl font-medium">Entrevista & Opinião</h2>
                  {interviewAndOpinionPosts.map((post) => (
                    <Card {...post} key={post.id} size="lg" />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-brand-primary border-secondary subheading border-b pb-3">Últimas publicações</h2>
                <div className="grid auto-rows-min gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {latestPosts.map((post) => (
                    <Card disable={{ excerpt: true }} {...post} key={post.id} size="sm" />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Ads position="sidebar-top" />
              <MostRead />
              <Ads position="sidebar-middle" />
              <Ads position="sidebar-bottom-premium" />
            </div>
          </div>
        </div>
      </section>

      <SectionLatbus />

      <section className="bg-primary relative py-24 max-md:pb-16">
        <div className="container flex flex-col gap-8 px-0">
          <div className="border-secondary relative mx-6 flex items-end gap-6 border-b pb-3">
            <h2 className="text-brand-primary subheading">Revistas mais recentes</h2>
            <Button size="sm" asChild>
              <Link href="https://acervodigitalotm.com.br/" target="_blank" rel="noopener">
                Ver todas edições
              </Link>
            </Button>
          </div>
          <ScrollArea className="max-w-full rounded-md pb-3">
            <div className="flex min-w-max grid-cols-5 gap-6 px-6 pb-5">
              {REVISTAS.map((magazine, index) => (
                <Link
                  key={index}
                  href={magazine.url}
                  className="group hover:bg-primary max-sm:bg-primary relative flex w-[80vw] min-w-0 flex-col gap-2 rounded-lg p-2 transition-all duration-300 hover:shadow-lg max-sm:shadow-lg sm:w-[250px]"
                >
                  <div className="relative">
                    <Image className="bg-tertiary-hover aspect-3/4 w-full rounded-sm object-cover" src={magazine.thumb} alt={magazine.title} width={858} height={977} />
                  </div>
                  <div className="flex flex-1 flex-col gap-6">
                    <div className="text-secondary flex justify-between text-xs">
                      <p>{magazine.edition}</p>
                      <p>{magazine.date}</p>
                    </div>
                  </div>
                  <div className="flex justify-end opacity-0 transition-opacity group-hover:opacity-100 max-sm:hidden">
                    <Button variant="subtle" size="sm" asChild>
                      <span>
                        <BookOpen />
                        Ler agora
                      </span>
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="text-center md:hidden">
            <Button asChild>
              <Link href="https://acervodigitalotm.com.br/" target="_blank" rel="noopener">
                Ver todas edições
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
