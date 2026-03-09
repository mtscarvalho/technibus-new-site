"use client";

import { ChevronDown, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { LatBusCategory } from "@/payload-types";

import { Button } from "@/components/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type FilterExibithorsProps = {
  categories: LatBusCategory[];
  initialCategory?: string;
  initialSearch?: string;
};

export function FilterExibithors({ categories, initialCategory, initialSearch }: FilterExibithorsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch || "");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "");

  function updateFilters(nextSearch: string, nextCategory: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextSearch.trim()) {
      params.set("s", nextSearch.trim());
    } else {
      params.delete("s");
    }

    if (nextCategory) {
      params.set("categoria", nextCategory);
    } else {
      params.delete("categoria");
    }

    const queryString = params.toString();

    startTransition(() => {
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    });
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateFilters(search, selectedCategory);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    updateFilters(search, category);
  }

  function handleClearFilters() {
    setSearch("");
    setSelectedCategory("");

    startTransition(() => {
      router.push(pathname);
    });
  }

  return (
    <div className="relative mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
      <div className="w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" className="w-full justify-between rounded-full">
              <span className="truncate">{selectedCategory || "Selecionar categoria"}</span>
              <ChevronDown className="size-4 opacity-60" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
            <DropdownMenuItem onClick={() => handleCategoryChange("")}>Todas as categorias</DropdownMenuItem>

            {categories.map((cat) => (
              <DropdownMenuItem key={cat.id} onClick={() => handleCategoryChange(cat.title)}>
                {cat.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex w-full gap-2">
        <div className="relative flex-1">
          <label className="sr-only" htmlFor="pesquisar-exhibitors">
            Pesquisar
          </label>
          <Input type="text" name="s" id="pesquisar-exhibitors" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar" className="w-full pr-10" />
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
        </div>
      </div>

      {(search || selectedCategory) && (
        <Button type="button" variant="ghost" onClick={handleClearFilters}>
          Limpar
        </Button>
      )}
    </div>
  );
}
