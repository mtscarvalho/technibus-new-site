"use client";

import Link from "next/link";

import { Button } from "@/components/Button";
import { cn } from "@/utilities/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  className?: string;
  page?: number;
  totalPages: number;
  path: string;
};

export function Pagination({ className, page, path, totalPages }: PaginationProps) {
  if (!page || totalPages <= 1) return null;

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const getPageHref = (targetPage: number) => {
    if (targetPage <= 1) return path;
    return `${path}/pagina/${targetPage}`;
  };

  return (
    <div className={cn("my-12", className)}>
      <nav aria-label="pagination" className="mx-auto flex w-full justify-center" role="navigation">
        <ul className="flex flex-row items-center gap-1">
          <li className="-mr-1">
            {hasPrevPage ? (
              <Button asChild variant="subtle" aria-label="Ir para página anterior">
                <Link href={getPageHref(page - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </Link>
              </Button>
            ) : (
              <Button variant="subtle" disabled aria-label="Ir para página anterior">
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
              </Button>
            )}
          </li>

          {hasPrevPage && (
            <li>
              <Button asChild size="icon" variant="subtle" aria-label={`Ir para página ${page - 1}`}>
                <Link href={getPageHref(page - 1)}>{page - 1}</Link>
              </Button>
            </li>
          )}

          <li>
            <Button className="pointer-events-none" size="icon" variant="primary" aria-current="page" asChild>
              <span>{page}</span>
            </Button>
          </li>

          {hasNextPage && (
            <li>
              <Button asChild size="icon" variant="subtle" aria-label={`Ir para página ${page + 1}`}>
                <Link href={getPageHref(page + 1)}>{page + 1}</Link>
              </Button>
            </li>
          )}

          <li className="-ml-1">
            {hasNextPage ? (
              <Button asChild variant="subtle" aria-label="Ir para próxima página">
                <Link href={getPageHref(page + 1)}>
                  <span>Próxima</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="subtle" disabled aria-label="Ir para próxima página">
                <span>Próxima</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
