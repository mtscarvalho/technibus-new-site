"use client";

import Link from "next/link";
import { RefObject, useEffect, useRef, useState } from "react";

import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";

import { Menu as MenuIcon, X } from "lucide-react";

import { Button } from "@/components/Button";
import { Dropdown, DropdownContent, DropdownTrigger } from "@/components/Dropdown";

import { Menu as PayloadMenu } from "@/payload-types";

type HeaderProps = {
  menu: PayloadMenu;
};

export function Menu({ menu }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function openButton() {
    setIsOpen(!isOpen);
  }

  useFocusTrap(menuRef as RefObject<HTMLElement>, isOpen);

  useEscapeKey(() => {
    setIsOpen(false);
  });

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
    <div className={`py-4 ${isOpen ? "h-svh" : "h-auto"}`} ref={menuRef}>
      <div className="container">
        <div className="flex flex-wrap items-center justify-between">
          <Link href="/">
            <div className="text-2xl font-bold">Boilerplate</div>
            <span className="sr-only">Página inicial</span>
          </Link>
          <div className="flex items-center justify-center lg:hidden">
            <Button variant="subtle" size="icon" onClick={openButton}>
              {isOpen ? <X /> : <MenuIcon />}
            </Button>
          </div>
          <nav className={`basis-full lg:basis-auto lg:py-0 ${isOpen ? "py-10" : ""}`}>
            <ul className={`items-center text-sm lg:flex ${isOpen ? "block" : "hidden"}`}>
              {menu.menu.map((item) => (
                <li key={item.id} className="mb-2 lg:mb-0">
                  {item.type == "submenu" ? (
                    <SubmenuItem
                      title={item.label!}
                      items={item.submenu!.map((sub) => ({
                        title: sub.label,
                        link: sub.link,
                      }))}
                    />
                  ) : (
                    <MenuItem title={item.label!} link={item.link!} />
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ title, link, external }: { title: string; link: string; external?: boolean }) {
  return (
    <Button size="sm" variant="subtle" asChild>
      <Link href={link} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {title}
      </Link>
    </Button>
  );
}

function SubmenuItem({ title, items }: { title: string; items: Array<{ title: string; link: string }> }) {
  return (
    <Dropdown>
      <Button variant="subtle" size="sm" asChild>
        <DropdownTrigger>{title}</DropdownTrigger>
      </Button>
      <DropdownContent className="max-lg:relative">
        <ul>
          {items.map((item) => (
            <li key={item.title}>
              <MenuItem {...item} />
            </li>
          ))}
        </ul>
      </DropdownContent>
    </Dropdown>
  );
}
