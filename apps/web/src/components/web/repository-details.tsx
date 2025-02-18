import { formatNumber } from "@curiousleaf/utils";
import type { ComponentProps } from "react";
import { Card } from "~/components/common/card";
import { H5 } from "~/components/common/heading";
import { Stack } from "~/components/common/stack";
import { ToolBadges } from "~/components/web/tools/tool-badges";
import { Insights } from "~/components/web/ui/insights";
import type { ToolOne } from "~/server/web/tools/payloads";
import { cx } from "~/utils/cva";
import { DollarSignIcon, BadgeInfo, ExternalLinkIcon } from "lucide-react";
import { Button } from "~/components/common/button";
import { ExternalLink } from "~/components/web/external-link";

type RepositoryDetailsProps = ComponentProps<"div"> & {
  tool: ToolOne;
};

export const RepositoryDetails = ({ className, tool, ...props }: RepositoryDetailsProps) => {
  const insights = [
    {
      label: "Pricing Type",
      value: tool.pricingType || "Free",
      icon: <DollarSignIcon className="text-green-500" />,
    },
    ...(tool.priceRange
      ? [
          {
            label: "Price Range",
            value: tool.priceRange,
            icon: <BadgeInfo className="text-blue-500" />,
          },
        ]
      : []),
  ];

  return (
    <Card hover={false} focus={false} className={cx("items-stretch bg-transparent", className)} {...props}>
      <Stack direction="column">
        <Stack size="sm" className="w-full justify-between">
          <H5 as="strong">Pricing Details:</H5>
          <ToolBadges tool={tool} />
        </Stack>

        <Insights insights={insights} className="text-sm" />

        {/* ✅ Nút Visit Website */}
        {tool.websiteUrl && (
          <Button
            size="lg"
            variant="secondary"
            prefix={<ExternalLinkIcon />}
            className="mt-2 self-start"
            asChild
          >
            <ExternalLink
              href={tool.websiteUrl}
              eventName="click_website"
              eventProps={{ url: tool.websiteUrl }}
            >
              Visit Website
            </ExternalLink>
          </Button>
        )}
      </Stack>
    </Card>
  );
};
