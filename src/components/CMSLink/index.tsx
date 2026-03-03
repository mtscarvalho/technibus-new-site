import React, { forwardRef } from "react";

import Link from "next/link";

import { Button, ButtonProps } from "@/components/Button";
import { ButtonField, Category, Post } from "@/payload-types";

function resolveHref(button?: ButtonField | null): string | undefined {
  if (!button) return undefined;
  if (button.type === "custom" && button.url) return button.url;
  if (button.type === "reference") {
    const v = button.reference?.value as Post | Category | undefined;
    return v?.relPermalink || "#";
  }
  return undefined;
}

export type CMSLinkProps = Omit<ButtonProps, "children"> & {
  button?: ButtonField | null;
  href?: string;
  children?: React.ReactNode;
  newTab?: boolean;
  prefetch?: boolean;
  scroll?: boolean;
  replace?: boolean;
  shallow?: boolean;
};

// Define as a *function* and wrap with forwardRef, but use the wrapped value in JSX.
export const CMSLink = forwardRef<HTMLButtonElement, CMSLinkProps>(function CMSLink(
  { button, href: hrefProp, children, newTab: newTabProp, variant = "subtle", size = "lg", prefetch, scroll, replace, shallow, asChild, ...buttonProps },
  ref,
) {
  const href = hrefProp ?? resolveHref(button) ?? "#";
  const newTab = newTabProp ?? !!button?.newTab;
  const ariaDisabled = href === "#";

  return (
    <Button variant={variant} size={size} asChild aria-disabled={ariaDisabled || undefined} {...buttonProps}>
      <Link
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        prefetch={prefetch}
        scroll={scroll}
        replace={replace}
        shallow={shallow}
      >
        {children ?? button?.label ?? "Learn more"}
      </Link>
    </Button>
  );
});
