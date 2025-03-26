import { Prisma } from "@m4v/db/client"
import { alternativeManyPayload } from "~/server/web/alternatives/payloads"
import { categoryManyPayload } from "~/server/web/categories/payloads"
import { topicManyPayload } from "~/server/web/topics/payloads"

export const toolAlternativesPayload = Prisma.validator<Prisma.Tool$alternativesArgs>()({
  select: alternativeManyPayload,
  orderBy: [{ tools: { _count: "desc" } }, { isFeatured: "desc" }, { name: "asc" }],
})

export const toolCategoriesPayload = Prisma.validator<Prisma.Tool$categoriesArgs>()({
  select: categoryManyPayload,
  orderBy: { name: "asc" },
})

export const toolTopicsPayload = Prisma.validator<Prisma.Tool$topicsArgs>()({
  select: topicManyPayload,
  orderBy: { slug: "asc" },
})

export const toolOwnerPayload = Prisma.validator<Prisma.Tool$ownerArgs>()({
  select: { id: true },
})

export const toolOnePayload = Prisma.validator<Prisma.ToolSelect>()({
  name: true,
  slug: true,
  websiteUrl: true,
  affiliateUrl: true,
  tagline: true,
  description: true,
  content: true,
  faviconUrl: true,
  screenshotUrl: true,
  isFeatured: true,
  isSelfHosted: true,
  hostingUrl: true,
  discountCode: true,
  discountAmount: true,
  priceType: true,
  priceRange: true,
  status: true,
  publishedAt: true,
  updatedAt: true,
  globalRank: true,
  monthlyVisits: true,
  lastWebUpdate: true,
  owner: toolOwnerPayload,
  alternatives: toolAlternativesPayload,
  categories: toolCategoriesPayload,
  topics: toolTopicsPayload,
})

export const toolManyPayload = Prisma.validator<Prisma.ToolSelect>()({
  name: true,
  slug: true,
  websiteUrl: true,
  tagline: true,
  description: true,
  faviconUrl: true,
  discountCode: true,
  discountAmount: true,
  priceType: true,
  priceRange: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  monthlyVisits: true,
  globalRank: true,
  owner: toolOwnerPayload,
  alternatives: { ...toolAlternativesPayload, take: 1 },
})

export const toolManyExtendedPayload = Prisma.validator<Prisma.ToolSelect>()({
  name: true,
  slug: true,
  websiteUrl: true,
  description: true,
  content: true,
  faviconUrl: true,
  screenshotUrl: true,
  discountCode: true,
  discountAmount: true,
  priceType: true,
  priceRange: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  owner: toolOwnerPayload,
  categories: toolCategoriesPayload,
})

export type ToolOne = Prisma.ToolGetPayload<{ select: typeof toolOnePayload }>
export type ToolMany = Prisma.ToolGetPayload<{ select: typeof toolManyPayload }>
export type ToolManyExtended = Prisma.ToolGetPayload<{ select: typeof toolManyExtendedPayload }>
