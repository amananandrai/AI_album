import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "lift inline-flex items-center justify-center gap-2 whitespace-nowrap border-2 border-ink font-display text-sm font-extrabold leading-none disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        default: "bg-accent text-on-accent shadow-sticker hover:bg-accent-hover",
        destructive: "bg-rose text-on-rose shadow-sticker",
        outline: "bg-card text-ink shadow-sticker-sm",
        secondary: "bg-sun text-on-sun shadow-sticker-sm hover:bg-sun-hover",
        ghost: "border-transparent bg-transparent text-ink shadow-none",
        link: "border-transparent bg-transparent text-ink shadow-none underline decoration-accent decoration-2 underline-offset-[3px]",
      },
      size: {
        default: "h-11 rounded-[10px] px-4",
        sm: "h-9 rounded-[10px] px-3 text-[13px]",
        lg: "h-12 rounded-[10px] px-6",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
