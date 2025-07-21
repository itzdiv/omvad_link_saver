// tooltip.tsx
// Reusable Tooltip component using Radix UI primitives. Shows helpful info on hover/focus.

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

// TooltipProvider wraps the app to enable tooltips
const TooltipProvider = TooltipPrimitive.Provider

// Tooltip root component
const Tooltip = TooltipPrimitive.Root

// Tooltip trigger (the element that shows the tooltip on hover/focus)
const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * TooltipContent is the popup content shown when the trigger is hovered/focused.
 * - Accepts custom className and sideOffset for positioning.
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
