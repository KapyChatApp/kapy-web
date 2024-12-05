import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("items-center rounded-lg p-2", {
  variants: {
    variant: {
      default:
        "border-none background-light900_dark100 text-dark100_light900 shadow text-[12px]",
      secondary:
        "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80 rounded-md",
      outline: "text-foreground rounded-md"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
