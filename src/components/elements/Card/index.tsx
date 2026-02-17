import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export const Card = ({ className, children }: CardProps) => {
  return (
    <div className={twMerge("rounded-2xl bg-white p-4 shadow-lg sm:p-6", className)}>
      {children}
    </div>
  );
};
