"use client";

type PaginationRangeProps = {
  currentPage: number;
  totalPages: number;
  totalDocs: number;
};

export function PaginationRange({ currentPage, totalPages, totalDocs }: PaginationRangeProps) {
  return (
    <div className="text-center font-medium">
      <p>
        {totalDocs} resultados, Página {currentPage} de {totalPages}
      </p>
    </div>
  );
}
