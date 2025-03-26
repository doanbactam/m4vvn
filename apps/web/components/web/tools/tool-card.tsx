import { formatNumber } from "@curiousleaf/utils"
import { cx } from "cva"
import { formatDistanceToNowStrict } from "date-fns"
import { GlobeIcon, HandCoinsIcon, UsersIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { Card, CardDescription, CardHeader } from "~/components/common/card"
import { H4 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import { ToolBadges } from "~/components/web/tools/tool-badges"
import { Favicon } from "~/components/web/ui/favicon"
import { Insights } from "~/components/web/ui/insights"
import { VerifiedBadge } from "~/components/web/verified-badge"
import type { ToolMany } from "~/server/web/tools/payloads"

type ToolCardProps = ComponentProps<typeof Card> & {
  tool: ToolMany

  /**
   * Disables the view transition.
   */
  isRelated?: boolean
}

const ToolCard = ({ className, tool, isRelated, ...props }: ToolCardProps) => {
  const hasMoreInfo = tool.description || !!tool.alternatives.length
  // const lastCommitDate =
  //   tool.lastCommitDate && formatDistanceToNowStrict(tool.lastCommitDate, { addSuffix: true })

  const insights = [
    { label: "Lượt truy cập", value: formatNumber(Number(tool.monthlyVisits), "standard"), icon: <UsersIcon /> },
    { label: "Thứ hạng toàn cầu", value: formatNumber(tool.globalRank || 0, "standard"), icon: <GlobeIcon /> },
    { label: "Giá", value: tool.priceRange, icon: <HandCoinsIcon /> },
  ]

  return (
    <Card asChild {...props}>
      <Link href={`/${tool.slug}`} className="group">
        <CardHeader>
          <Favicon src={tool.faviconUrl} title={tool.name} />

          <H4 as="h3" className="truncate">
            {tool.name}
          </H4>

          {tool.owner && <VerifiedBadge size="md" className="-ml-1.5" />}

          <ToolBadges tool={tool} className="ml-auto" />
        </CardHeader>

        <div className="relative size-full flex flex-col">
          {hasMoreInfo && (
            <Stack
              size="lg"
              direction="column"
              wrap={false}
              className="items-stretch absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
            >
              {tool.description && (
                <CardDescription className="line-clamp-4">{tool.description}</CardDescription>
              )}

              {!!tool.alternatives.length && (
                <Stack className="mt-auto text-sm">
                  <span>
                    <span className="sr-only">AI  </span>Công cụ tương tự:
                  </span>

                  {tool.alternatives.map((alternative) => (
                    <Stack size="xs" key={alternative.slug}>
                      <Favicon 
                        src={alternative.faviconUrl || '/default-favicon.png'} 
                        title={alternative.name} 
                        className="size-6 p-[3px]" 
                      />
                      <strong className="font-medium">{alternative.name}</strong>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Stack>
          )}

          <Stack
            size="lg"
            direction="column"
            className={cx(
              "flex-1",
              hasMoreInfo && "transition-opacity duration-200 group-hover:opacity-0",
            )}
          >
            {tool.tagline && <CardDescription>{tool.tagline}</CardDescription>}
            <Insights insights={insights.filter(i => i.value)} className="mt-auto" />
          </Stack>
        </div>
      </Link>
    </Card>
  )
}

const ToolCardSkeleton = () => {
  const insights = [
    { label: "Lượt truy cập", value: <Skeleton className="h-4 w-16" />, icon: <UsersIcon /> },
    { label: "Thứ hạng toàn cầu", value: <Skeleton className="h-4 w-14" />, icon: <GlobeIcon /> },
    { label: "Giá", value: <Skeleton className="h-4 w-20" />, icon: <HandCoinsIcon /> },
  ]

  return (
    <Card hover={false} className="items-stretch select-none">
      <CardHeader>
        <Favicon src="/favicon.png" className="animate-pulse opacity-50" />

        <H4 className="w-2/3">
          <Skeleton>&nbsp;</Skeleton>
        </H4>
      </CardHeader>

      <CardDescription className="flex flex-col gap-0.5">
        <Skeleton className="h-5 w-4/5">&nbsp;</Skeleton>
        <Skeleton className="h-5 w-1/2">&nbsp;</Skeleton>
      </CardDescription>

      <Stack size="sm">
        <Insights insights={insights} className="mt-auto animate-pulse" />
      </Stack>
    </Card>
  )
}

export { ToolCard, ToolCardSkeleton }
