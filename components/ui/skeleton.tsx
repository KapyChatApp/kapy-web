import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-full background-light500_dark500",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
