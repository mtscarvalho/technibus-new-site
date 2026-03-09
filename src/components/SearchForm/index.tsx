"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Search, XCircle } from "lucide-react";

type SearchAreaProps = {
  searchTerm?: string;
};

export function SearchForm({ searchTerm }: SearchAreaProps) {
  const [value, setValue] = useState(searchTerm);

  function handleReset() {
    setValue("");
  }

  return (
    <form action="/pesquisar" method="GET" className="relative">
      <label className="sr-only" htmlFor="pesquisar">
        Pesquisar
      </label>
      <Input className="pr-9 pl-9" id="pesquisar" type="text" name="s" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Busque aqui..." />

      {value && (
        <button type="button" onClick={handleReset} className="absolute top-1/2 right-3 -translate-y-1/2 rounded" aria-label="Limpar busca">
          <XCircle className="icon-secondary size-4" />
        </button>
      )}

      <button type="submit" className="absolute top-1/2 left-3 -translate-y-1/2 rounded" aria-label="Buscar">
        <Search className="icon-secondary size-4" />
      </button>
    </form>
  );
}
