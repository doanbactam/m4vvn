import { formatNumber } from '@curiousleaf/utils';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  GitForkIcon,
  TimerIcon,
  DollarSignIcon,
  BadgeInfo,
} from 'lucide-react';
import type { ComponentProps } from 'react';
import { H4 } from '~/components/common/heading';
import { Link } from '~/components/common/link';
import { Skeleton } from '~/components/common/skeleton';
import { Stack } from '~/components/common/stack';
import { ToolBadges } from '~/components/web/tools/tool-badges';
import { Badge } from '~/components/common/badge';
import { Card, CardDescription, CardHeader } from '~/components/common/card';
import { Favicon } from '~/components/web/ui/favicon';
import { Insights } from '~/components/web/ui/insights';
import type { ToolMany } from '~/server/web/tools/payloads';

type ToolCardProps = ComponentProps<typeof Card> & {
  tool: ToolMany;
  isRelated?: boolean;
};

const ToolCard = ({ className, tool, isRelated, ...props }: ToolCardProps) => {
  const insights = [
    {
      label: 'Pricing',
      value: tool.pricingType || 'Free',
      icon: <DollarSignIcon className="text-green-500" />,
    },
    {
      label: 'Price Range',
      value: tool.priceRange || 'N/A',
      icon: <BadgeInfo className="text-blue-500" />,
    },
  ];

  return (
    <Card {...props}>
      <Link href={`/${tool.slug}`} className="group">
        <CardHeader>
          <Favicon src={tool.faviconUrl} title={tool.name} />

          <H4 as="h3" className="truncate">
            {tool.name}
          </H4>

          <ToolBadges tool={tool} className="ml-auto">
            {typeof tool.discountAmount === 'string' && (
              <Badge variant="success">
                Get{' '}
                {tool.discountAmount.includes('%')
                  ? tool.discountAmount
                  : `${tool.discountAmount}%`}
                !
              </Badge>
            )}
          </ToolBadges>
        </CardHeader>

        <div className="relative size-full flex flex-col">
          <Stack
            size="lg"
            direction="column"
            className="items-stretch absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
          >
            {tool.description && (
              <CardDescription className="line-clamp-4">
                {tool.description}
              </CardDescription>
            )}

            {tool.alternatives?.length ? (
              <Stack className="mt-auto text-sm">
                <span>
                  <span className="sr-only">Open Source </span>Alternative to:
                </span>

                {tool.alternatives.map(({ slug, name, faviconUrl }) => (
                  <Stack size="xs" key={slug}>
                    <Favicon
                      src={faviconUrl}
                      title={name}
                      className="size-6 p-[3px]"
                    />
                    <strong className="font-medium">{name}</strong>
                  </Stack>
                ))}
              </Stack>
            ) : null}
          </Stack>

          <Stack
            size="lg"
            direction="column"
            className="flex-1 transition-opacity duration-200 group-hover:opacity-0"
          >
            {tool.tagline && <CardDescription>{tool.tagline}</CardDescription>}
            <Insights insights={insights} className="mt-auto" />
          </Stack>
        </div>
      </Link>
    </Card>
  );
};

// Skeleton Loader for ToolCard
const ToolCardSkeleton = () => {
  const insightData = [
    { label: 'Pricing', width: 'w-16', icon: <DollarSignIcon /> },
    { label: 'Price Range', width: 'w-16', icon: <BadgeInfo /> },
  ];

  const insights = insightData.map(({ label, width, icon }) => ({
    label,
    value: <Skeleton className={`h-4 ${width}`} />,
    icon,
  }));

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
  );
};

export { ToolCard, ToolCardSkeleton };
