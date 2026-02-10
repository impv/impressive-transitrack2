import type { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends ComponentPropsWithRef<"input"> {
  className?: string;
  /**
   * input要素のid
   */
  id?: string;
}

export const Input = ({ className, id, ...props }: InputProps) => {
  return (
    <input
      id={id}
      type="text"
      className={twMerge(
        `w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none`,
        className,
      )}
      {...props}
    />
  );
};
