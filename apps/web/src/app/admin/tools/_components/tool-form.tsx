"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ToolStatus } from "@openalternative/db/client"
import { PricingStatus } from "@prisma/client"
import { formatDate } from "date-fns"
import { redirect } from "next/navigation"
import type { ComponentProps } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { motion } from "framer-motion";
import { RelationSelector } from "~/components/admin/relation-selector"
import { Button } from "~/components/common/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { Input } from "~/components/common/input"
import { Link } from "~/components/common/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { Switch } from "~/components/common/switch"
import { TextArea } from "~/components/common/textarea"
import type { findAlternativeList } from "~/server/admin/alternatives/queries"
import type { findCategoryList } from "~/server/admin/categories/queries"
import { createTool, updateTool } from "~/server/admin/tools/actions"
import type { findToolBySlug } from "~/server/admin/tools/queries"
import { type ToolSchema, toolSchema } from "~/server/admin/tools/validations"
import { cx } from "~/utils/cva"
import { nullsToUndefined } from "~/utils/helpers"

type ToolFormProps = ComponentProps<"form"> & {
  tool?: Awaited<ReturnType<typeof findToolBySlug>>
  alternatives: ReturnType<typeof findAlternativeList>
  categories: ReturnType<typeof findCategoryList>
}

export function ToolForm({
  children,
  className,
  tool,
  alternatives,
  categories,
  ...props
}: ToolFormProps) {
  const form = useForm<ToolSchema>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      ...nullsToUndefined(tool),
      alternatives: tool?.alternatives.map(({ id }) => id),
      categories: tool?.categories.map(({ id }) => id),
    },
  });

  // Create tool
  const { execute: createToolAction, isPending: isCreatingTool } = useServerAction(createTool, {
    onSuccess: ({ data }) => {
      toast.success(`Created: ${data.name} (${data.slug})`);
      redirect(`/admin/tools/${data.slug}`);
    },
    onError: ({ err }) => {
      console.error("Error creating tool:", err);
      toast.error(`Error: ${err.message || "Something went wrong"}`);
    },
  });
  

  const normalizeFieldValue = (value: any, type: string) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value.toString();
    if (value instanceof Date) return value.toISOString().slice(0, 16);
    if (Array.isArray(value)) return value.join(", ");
    return value;
  };
  
  const renderInputField = (name: keyof ToolSchema, label: string, type: string = "text") => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              {...field}
              value={normalizeFieldValue(field.value, type)}
              onChange={(e) =>
                field.onChange(type === "number" ? Number(e.target.value) || 0 : e.target.value)
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
  
  
  const renderSelectField = (name: keyof ToolSchema, label: string, options: string[]) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const value = typeof field.value === "string" ? field.value : "";
  
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} value={value}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
  
  
  

  // Update tool
  const { execute: updateToolAction, isPending: isUpdatingTool } = useServerAction(updateTool, {
    onSuccess: ({ data }) => {
      toast.success("Tool successfully updated")
      redirect(`/admin/tools/${data.slug}`)
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  const onSubmit = form.handleSubmit(data => {
    if (!tool?.id) {
      toast.error("ID is required.");
      return;
    }
    updateToolAction({ id: tool.id, ...data });
  });
  

  const isPending = isCreatingTool || isUpdatingTool

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cx("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}
        noValidate
        {...props}
      >


<fieldset className="border border-gray-300 rounded-lg p-4">
  <legend className="text-lg font-semibold text-gray-700 px-2">Basic Info</legend>
  {renderInputField("name", "Tool Name")}
  {renderInputField("slug", "Slug")}
  {renderInputField("websiteUrl", "Website URL", "url")}
  {renderInputField("affiliateUrl", "Affiliate URL")}
  {renderInputField("tagline", "Tagline")}
</fieldset>
<fieldset className="border border-gray-300 rounded-lg p-4">
        <legend className="text-lg font-semibold text-gray-700 px-2">Submit Info</legend>
{renderInputField("submitterName", "Submitter Name")}
{renderInputField("submitterEmail", "Submitter Email")}
{renderInputField("submitterNote", "Note")}
{renderInputField("faviconUrl", "Favico Url","url")}
{renderInputField("screenshotUrl", "Screenshot Url", "url")}
{renderInputField("discountCode", "discountCode")}
{renderInputField("discountAmount", "discountAmount")}
</fieldset>
<FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem className="col-span-full">
      <FormLabel>Description</FormLabel>
      <FormControl>
        <TextArea className="min-h-[150px] max-h-[400px] resize-y" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="content"
  render={({ field }) => (
    <FormItem className="col-span-full">
      <FormLabel>Content</FormLabel>
      <FormControl>
        <TextArea className="min-h-[200px] max-h-[500px] resize-y" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

        <div className="flex flex-row gap-4 max-sm:contents">
        <FormField
  control={form.control}
  name="isFeatured"
  render={({ field }) => (
    <FormItem className="flex-1">
      <FormLabel>Featured</FormLabel>
      <FormControl>
        <Switch onCheckedChange={field.onChange} checked={!!field.value} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


          <FormField
            control={form.control}
            name="isSelfHosted"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Self-hosted</FormLabel>
                <FormControl>
                  <Switch onCheckedChange={field.onChange} checked={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-row gap-4 max-sm:contents">
        <FormField
  control={form.control}
  name="publishedAt"
  render={({ field }) => {
    const value = field.value
      ? new Date(field.value).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16);

    return (
      <FormItem>
        <FormLabel>Published At</FormLabel>
        <FormControl>
          <Input
            type="datetime-local"
            {...field}
            value={value}
            onChange={(e) => field.onChange(e.target.value)}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }}
/>


          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full tabular-nums">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent className="tabular-nums">
                      {Object.values(ToolStatus).map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

<fieldset className="border border-gray-300 rounded-lg p-4">
      <legend className="text-lg font-semibold text-gray-700 px-2">Pricing Details</legend>
      {renderSelectField("pricingType", "Pricing Type", Object.values(PricingStatus))}
      {form.watch("pricingType") === "Paid" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderInputField("priceRange", "Price Range ($)", "text")}
        </motion.div>
      )}
    </fieldset>

        <FormField
          control={form.control}
          name="screenshotUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screenshot URL</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alternatives"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternatives</FormLabel>
              <RelationSelector
                promise={alternatives}
                selectedIds={field.value ?? []}
                onChange={field.onChange}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <RelationSelector
                promise={categories}
                selectedIds={field.value ?? []}
                onChange={field.onChange}
              />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button variant="secondary" asChild>
            <Link href="/admin/tools">Cancel</Link>
          </Button>

          <Button variant="fancy" isPending={isPending}>
            {tool ? "Update tool" : "Create tool"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
