"use client";

import { ChevronDown } from "lucide-react";
import { ReactNode, useRef } from "react";

import { useEscapeKey } from "@/hooks/useEscapeKey";
import { cn } from "@/utilities/cn";

type DropdownProps = {
  children: ReactNode;
  className?: string;
};

export function Dropdown({ children, className }: DropdownProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  function openDropdown() {
    detailsRef.current?.setAttribute("open", "");
  }
  function closeDropdown() {
    detailsRef.current?.removeAttribute("open");
  }

  useEscapeKey(closeDropdown);

  return (
    <details
      ref={detailsRef}
      className={cn("group relative", className)}
      onMouseEnter={openDropdown}
      onMouseLeave={closeDropdown}
      onFocusCapture={openDropdown}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          closeDropdown();
        }
      }}
    >
      {children}
    </details>
  );
}

export function DropdownTrigger({ children, className }: DropdownProps) {
  return (
    <summary className={cn("flex cursor-pointer items-center gap-1", className)}>
      <span>{children}</span>
      <ChevronDown className="size-4 transition-transform duration-300 group-open:rotate-180" />
    </summary>
  );
}

export function DropdownContent({ children, className }: DropdownProps) {
  return <div className={cn("bg-default absolute z-10 min-w-max rounded-lg p-4", className)}>{children}</div>;
}
