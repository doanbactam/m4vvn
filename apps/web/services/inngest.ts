import { Logtail } from "@logtail/node"
import { db } from "@m4v/db"
import { EventSchemas, Inngest, InngestMiddleware } from "inngest"
import { env } from "~/env"

type ToolEventData = { slug: string }
type AlternativeEventData = { slug: string }

type Events = {
  "tool.submitted": { data: ToolEventData }
  "tool.expedited": { data: ToolEventData }
  "tool.featured": { data: ToolEventData }
  "tool.scheduled": { data: ToolEventData }
  "tool.published": { data: ToolEventData }
  "alternative.created": { data: AlternativeEventData }
}

const schemas = new EventSchemas().fromRecord<Events>()
const logger = new Logtail(env.LOGTAIL_SOURCE_TOKEN, { sendLogsToConsoleOutput: true })

const prismaMiddleware = new InngestMiddleware({
  name: "Prisma Middleware",
  init: () => ({
    onFunctionRun: () => ({
      transformInput: () => ({ ctx: { db } }),
    }),
  }),
})

export const inngest = new Inngest({
  id: "m4v",
  schemas,
  logger,
  middleware: [prismaMiddleware],
})
