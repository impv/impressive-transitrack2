import type { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400",
  secondary:
    "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md focus:ring-gray-400",
  danger:
    "border border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 focus:ring-red-400",
  ghost:
    "border border-blue-200 text-blue-600 hover:border-blue-300 hover:bg-blue-50 focus:ring-blue-400 disabled:opacity-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-1 py-1 text-sm",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-3 text-sm",
};

const ButtonStyles = tv({
  base: "inline-flex items-center justify-center rounded-lg font-medium transition-colors cursor-pointer focus:outline-none disabled:cursor-not-allowed",
  variants: {
    variant: {
      primary: variantClasses.primary,
      secondary: variantClasses.secondary,
      danger: variantClasses.danger,
      ghost: variantClasses.ghost,
    },
    size: {
      sm: sizeClasses.sm,
      md: sizeClasses.md,
      lg: sizeClasses.lg,
    },
    fullWidth: {
      true: "w-full",
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    fullWidth: false,
  },
});

export const Button = ({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={twMerge(ButtonStyles({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
};
