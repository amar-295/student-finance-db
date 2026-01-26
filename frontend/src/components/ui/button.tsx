import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 select-none",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
                outline:
                    "border border-input bg-background hover:bg-muted hover:text-foreground shadow-sm",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline px-0",
                glow: "bg-primary text-primary-foreground shadow-glow hover:shadow-glow-lg border border-primary/20 hover:border-primary/40 relative overflow-hidden",
                glass: "bg-background/40 backdrop-blur-md border border-primary/10 hover:border-primary/30 hover:bg-background/60 shadow-sm",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 rounded-md px-4 truncate",
                lg: "h-14 rounded-full px-10 text-lg",
                xl: "h-16 rounded-full px-12 text-xl",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends Omit<HTMLMotionProps<"button">, "variant" | "size">,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
        if (asChild) {
            return (
                <Slot
                    className={cn(buttonVariants({ variant, size, className }))}
                    ref={ref}
                >
                    {children as React.ReactNode}
                </Slot>
            )
        }

        return (
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={cn(buttonVariants({ variant, size, className }), "group")}
                ref={ref}
                {...props}
            >
                {/* Subtle Shimmer for Glow Variant */}
                {variant === 'glow' && (
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-1000 ease-in-out" />
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {isLoading && (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent z-10"
                        />
                    )}
                </AnimatePresence>
                <span className="relative z-10 flex items-center gap-2">
                    {children as React.ReactNode}
                </span>
            </motion.button>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
