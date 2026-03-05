type PaginationRangeProps = {
  currentPage: number;
  totalPages: number;
  totalDocs: number;
};

export function PaginationRange({ currentPage, totalPages, totalDocs }: PaginationRangeProps) {
  return (
    <div className="text-secondary flex items-center justify-between max-sm:flex-col">
      <p>{totalDocs} resultados encontrados</p>
      <p>
        Página {currentPage} de {totalPages}
      </p>
    </div>
  );
}
