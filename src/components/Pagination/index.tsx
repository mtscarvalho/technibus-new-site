"use client";

import { useRouter } from "nextjs-toploader/app";

import { cn } from "@/utilities/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/Button";

type PaginationProps = {
  className?: string;
  page?: number;
  totalPages: number;
  path: string;
};

export function Pagination({ className, page, path, totalPages }: PaginationProps) {
  const router = useRouter();

  if (totalPages <= 1) {
    return;
  }

  if (page) {
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return (
      <div className={cn("my-12", className)}>
        <nav aria-label="pagination" className="mx-auto flex w-full justify-center" role="navigation">
          <ul className="flex flex-row items-center gap-1">
            <li className="-mr-1">
              <Button size="md" variant="subtle" aria-label="Ir para página anterior" disabled={!hasPrevPage} onClick={() => router.push(`${path}/${page - 1}`)}>
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
              </Button>
            </li>

            {hasPrevPage && (
              <li>
                <Button className="size-10" size="icon" variant="subtle" aria-label={`Ir para página ${page - 1}`} disabled={!hasPrevPage} onClick={() => router.push(`${path}/${page - 1}`)}>
                  {page - 1}
                </Button>
              </li>
            )}

            <li>
              <Button className="size-10" size="icon" variant="primary" aria-label="Página atual" onClick={() => router.push(`${path}/${page}`)}>
                {page}
              </Button>
            </li>

            {hasNextPage && (
              <li>
                <Button className="size-10" size="icon" variant="subtle" aria-label={`Ir para página ${page + 1}`} disabled={!hasNextPage} onClick={() => router.push(`${path}/${page + 1}`)}>
                  {page + 1}
                </Button>
              </li>
            )}

            <li className="-ml-1">
              <Button size="md" variant="subtle" aria-label="Ir para próxima página" disabled={!hasNextPage} onClick={() => router.push(`${path}/${page + 1}`)}>
                <span>Próxima</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
