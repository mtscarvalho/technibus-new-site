import Head from "next/head";

import { createMetadata } from "@/utilities/create-metadata";

import { fetchCategoryBySlug } from "@/collections/Categories/data";
import { fetchPaginatedPostsByCategory } from "@/collections/Posts/data";

import { Pagination } from "@/components/Pagination";
import { PaginationRange } from "@/components/PostRange";
import { PostArchive } from "@/components/PostsArchive";

type PageArgs = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageArgs) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);

  return createMetadata({
    path: `/editoria/${slug}`,
    title: `Editoria: ${category.title}`,
    description: category.description || "",
  });
}

export default async function Page({ params }: PageArgs) {
  const { slug } = await params;

  const category = await fetchCategoryBySlug(slug);
  const posts = await fetchPaginatedPostsByCategory(category.id);

  return (
    <>
      <Head>
        {posts.page && posts.page > 1 && <link rel="prev" href={`${process.env.SITE_URL}/editoria/${slug}/pagina/${posts.page - 1}`} />}
        {posts.page && posts.totalPages > 1 && <link rel="next" href={`${process.env.SITE_URL}/editoria/${slug}/pagina/${posts.page + 1}`} />}
      </Head>

      <main>
        <section className="py-24">
          <div className="container space-y-10">
            <h1 className="text-center text-4xl font-bold">Posts</h1>
            <PaginationRange currentPage={posts.page || 1} totalPages={posts.totalPages} totalDocs={posts.totalDocs} />
            <PostArchive posts={posts.docs} />
            <Pagination page={posts.page} totalPages={posts.totalPages} path={`/editoria/${slug}`} />
          </div>
        </section>
      </main>
    </>
  );
}
