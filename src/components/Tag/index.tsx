import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const tagVariants = cva("block max-w-max border px-2 py-0.5 text-xs font-semibold uppercase", {
  variants: {
    variant: {
      primary: "border-primary text-foreground",
      secondary: "border-secondary text-secondary",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export type TagProps = {
  children: React.ReactNode;
} & VariantProps<typeof tagVariants>;

export function Tag({ children, variant }: TagProps) {
  return <span className={cn(tagVariants({ variant }))}>{children}</span>;
}
