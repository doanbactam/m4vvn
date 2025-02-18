"use server"

import { createServerAction } from "zsa"
import { findAlternatives } from "~/server/web/alternatives/queries"
import { findCategories } from "~/server/web/categories/queries"
import type { FilterOption, FilterType } from "~/types/search"

export const findFilterOptions = createServerAction().handler(
  async (): Promise<Record<FilterType, FilterOption[]>> => {
    const [alternative, category] = await Promise.all([
      findAlternatives({}).then(r =>
        r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })),
      ),
      findCategories({}).then(r =>
        r.map(({ slug, name, _count }) => ({ slug, name, count: _count.tools })),
      ),
    ])

    return {
      alternative,
      category,
    }
  },
)
