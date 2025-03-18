"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import type { StandardSchemaV1Issue } from "@tanstack/react-form"
import { Field } from "@tanstack/react-form"

import { cn } from "#lib/utils.ts"
import { Label } from "#components/ui/label.tsx"

// Create a simpler version that doesn't rely on field context
type FormItemContextValue = {
  id: string
  name: string
  hasError: boolean
  errors: StandardSchemaV1Issue[]
  formItemId: string
  formDescriptionId: string
  formMessageId: string
}

const FormItemContext = React.createContext<FormItemContextValue | undefined>(undefined)

const useFormItem = () => {
  const context = React.useContext(FormItemContext)
  if (!context) {
    throw new Error("useFormItem should be used within <FormItem>")
  }
  return context
}

// Form component is a simple pass-through now
const Form = React.forwardRef<
  HTMLFormElement,
  React.HTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => (
  <form ref={ref} className={cn(className)} {...props} />
))
Form.displayName = "Form"

// Removing the poorly typed FormField component

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    name?: string; 
    errors?: StandardSchemaV1Issue[] | undefined[] 
  }
>(({ className, name, errors = [], ...props }, ref) => {
  const id = React.useId()
  
  // Create context values
  const formItemContextValue = React.useMemo<FormItemContextValue>(() => ({
    id,
    name: name || '',
    hasError: errors.length > 0,
    errors: errors as StandardSchemaV1Issue[],
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
  }), [id, name, errors])

  return (
    <FormItemContext.Provider value={formItemContextValue}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { hasError, formItemId } = useFormItem()

  return (
    <Label
      ref={ref}
      className={cn(hasError && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { hasError, formItemId, formDescriptionId, formMessageId } = useFormItem()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !hasError
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!hasError}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormItem()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { hasError, errors, formMessageId } = useFormItem()
  const body = hasError ? errors.map(error => error.message).join(", ") : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormItem,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
