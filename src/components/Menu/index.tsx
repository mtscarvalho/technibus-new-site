"use client";

import { RefObject, useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { MenuIcon, Search, X } from "lucide-react";

import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { Button } from "../Button";

const MENU_ITEMS = [
  { label: "Empresas & Negócios", url: "/" },
  { label: "Entrevista & Opinião", url: "/" },
  { label: "Indústria", url: "/" },
  { label: "Lat.bus", url: "/" },
  { label: "Metroferroviário", url: "/" },
  { label: "Mobilidade", url: "/" },
  { label: "Rodoviário", url: "/" },
  { label: "Sustentabilidade", url: "/" },
  { label: "Technibus na história", url: "/" },
  { label: "Tecnologia", url: "/" },
];

export function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen((v) => !v);

  useFocusTrap(menuRef as RefObject<HTMLElement>, isOpen);
  useEscapeKey(() => setIsOpen(false));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className={`left-0 z-10 w-full backdrop-blur-xl ${isOpen ? "bg-woodsmoke h-svh" : "h-auto"}`} ref={menuRef}>
      <div className="container h-full max-lg:py-4">
        <div className="border-secondary hidden grid-cols-[1fr_auto_1fr] items-center border-b px-4 py-6 lg:grid">
          <div className="flex flex-col">
            <Search />
          </div>
          <Link className="block rounded" href="/">
            <Image className="mx- h-14" src="/logo.svg" width={377} height={190} alt="OTM Editora" />
            <span className="sr-only">Página inicial</span>
          </Link>
          <div className="flex justify-end">
            <Button variant="ghost">Assine gratuitamente</Button>
          </div>
        </div>

        <div className="flex w-full items-center justify-between max-lg:flex-wrap lg:justify-center">
          <div className="flex items-center justify-start gap-4 lg:hidden">
            <Link className="block rounded" href="/">
              <Image className="h-16 w-full" src="/logo.svg" width={65} height={40} alt="OTM Editora" />
              <span className="sr-only">Página inicial</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center justify-center lg:hidden">
            <Button variant="ghost" size="icon" onClick={toggleOpen} aria-expanded={isOpen} aria-controls="main-navigation" aria-label={isOpen ? "Fechar menu" : "Abrir menu"}>
              {isOpen ? <X className="size-5" /> : <MenuIcon className="size-5" />}
            </Button>
          </div>

          <div className="flex items-center gap-4 max-lg:basis-full max-lg:flex-wrap">
            <nav id="main-navigation" className={`basis-full items-center lg:basis-auto lg:justify-center lg:py-0 ${isOpen ? "pt-10" : ""}`}>
              {/* Desktop Menu */}
              <ul className="hidden max-w-3xl justify-center py-2 lg:flex lg:flex-wrap lg:items-center">
                {MENU_ITEMS.map((item) => (
                  <li key={item.label} className="mb-2 lg:mb-0">
                    <Button className="max-lg:w-full max-lg:justify-start" size="lg" variant="ghost" asChild>
                      <Link href={item.url}>{item.label}</Link>
                    </Button>
                  </li>
                ))}
              </ul>

              {/* Mobile Menu */}
              <ul className={`-ml-3 lg:hidden ${isOpen ? "block" : "hidden"}`}>
                {MENU_ITEMS.map((item) => (
                  <li key={item.label} className="">
                    <Button className="max-lg:w-full max-lg:justify-start" size="lg" variant="ghost" asChild>
                      <Link href={item.url} onClick={() => setIsOpen(false)}>
                        {item.label}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
