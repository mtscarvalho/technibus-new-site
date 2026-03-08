import { Fragment, ReactNode } from "react";

import { Card, CardProps } from "@/components/Card";
import { Pagination } from "@/components/Pagination";
import { PostGrid } from "@/components/PostGrid";
import { PaginationRange } from "@/components/PostRange";
import { Sidebar } from "@/components/Sidebar";

import { Post, Search } from "@/payload-types";
import { Ads } from "../Ads";

type PostArchiveProps = {
  children: ReactNode;
};

type PostArchiveHeaderProps = {
  children?: ReactNode;
  currentPage: number;
  totalPages: number;
  totalDocs: number;
};

type PostArchiveFeedProps = {
  posts: Post[] | Search[];
  page: number | undefined;
  totalPages: number;
  path: string;
  query?: string;
  cardDisable?: Partial<CardProps["disable"]>;
};

export function PostArchive({ children }: PostArchiveProps) {
  return (
    <>
      <section className="relative z-0 pt-4 pb-24">
        <div className="container grid gap-10 lg:grid-cols-[1fr_300px]">
          <div className="space-y-8">{children}</div>
          <Sidebar />
        </div>
      </section>
    </>
  );
}

export function PostArchiveHeader({ children, currentPage, totalPages, totalDocs }: PostArchiveHeaderProps) {
  return (
    <div className="space-y-4">
      {children}
      <PaginationRange currentPage={currentPage} totalPages={totalPages} totalDocs={totalDocs} />
    </div>
  );
}

export function PostArchiveFeed({ posts, page, totalPages, path, query, cardDisable = { excerpt: true } }: PostArchiveFeedProps) {
  return (
    <>
      <PostGrid>
        {posts.map((post, index) => (
          <Fragment key={post.id}>
            <Card {...post} disable={cardDisable} size="sm" />
            {index === 2 && <Ads className="lg:hidden" position="sidebar-top" />}
            {index === 6 && <Ads className="lg:hidden" position="sidebar-middle" />}
          </Fragment>
        ))}
      </PostGrid>
      <Ads className="lg:hidden" position="sidebar-bottom-premium" />
      <Pagination page={page} totalPages={totalPages} path={path} query={query} />
    </>
  );
}
