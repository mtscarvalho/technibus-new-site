import Image from "next/image";
import Link from "next/link";

import { fetchPostsByCategorySlug } from "@/collections/Posts/data";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export async function SectionLatbus() {
  const posts = await fetchPostsByCategorySlug("latbus", 3);

  return (
    <section className="bg-secondary border-secondary border-y py-24">
      <div className="container space-y-6">
        <div className="border-secondary relative flex flex-wrap items-end gap-6 border-b pb-3">
          <h2 className="text-brand-primary subheading">Lat.bus</h2>
          <Button size="sm" asChild>
            <Link href="https://acervodigitalotm.com.br/" target="_blank" rel="noopener">
              Ver todas publicações
            </Link>
          </Button>
        </div>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex">
            <Image className="h-auto w-full rounded" src="/latbus-banner.svg" alt="" width={236} height={351} />
          </div>
          {posts.map((post) => (
            <Card disable={{ excerpt: true }} {...post} key={post.id} size="sm" />
          ))}
        </div>
      </div>
    </section>
  );
}
