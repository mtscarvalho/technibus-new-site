import { createMetadata } from "@/utilities/create-metadata";

import { fetchPaginatedPosts } from "@/collections/Posts/data";
import { Pagination } from "@/components/Pagination";
import { PaginationRange } from "@/components/PostRange";
import { PostArchive } from "@/components/PostsArchive";
import Head from "next/head";

export function generateMetadata() {
  return createMetadata({
    path: "/blog",
    title: "Blog",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  });
}

export default async function Page() {
  const posts = await fetchPaginatedPosts();

  return (
    <>
      <Head>
        {posts.page && posts.page > 1 && <link rel="prev" href={`${process.env.SITE_URL}/blog/pagina/${posts.page - 1}`} />}
        {posts.page && posts.totalPages > 1 && <link rel="next" href={`${process.env.SITE_URL}/blog/pagina/${posts.page + 1}`} />}
      </Head>

      <main>
        <section className="py-24">
          <div className="container space-y-10">
            <h1 className="text-center text-4xl font-bold">Posts</h1>
            <PaginationRange currentPage={posts.page || 1} totalPages={posts.totalPages} totalDocs={posts.totalDocs} />
            <PostArchive posts={posts.docs} />
            <Pagination page={posts.page} totalPages={posts.totalPages} path="/blog/" />
          </div>
        </section>
      </main>
    </>
  );
}
