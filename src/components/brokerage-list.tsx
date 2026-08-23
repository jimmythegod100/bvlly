"use client"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { brokerages, fitLabel, type Brokerage } from "@/data/brokerages"
import {
  STATUSES,
  statusLabel,
  useTracker,
  type Status,
} from "@/lib/tracker"

function FitBadge({ fit }: { fit: Brokerage["fit"] }) {
  if (fit === "best") return <Badge>{fitLabel[fit]}</Badge>
  if (fit === "training") return <Badge variant="outline">{fitLabel[fit]}</Badge>
  return <Badge variant="secondary">{fitLabel[fit]}</Badge>
}

export function BrokerageList() {
  const { tracker, setStatus } = useTracker()

  return (
    <div className="space-y-4">
      {brokerages.map((b) => {
        const status = tracker[b.id] ?? "not-started"
        return (
          <Card key={b.id} className="bg-card/90">
            <CardHeader className="border-b">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">
                    {b.rank === 1 ? "Call this week" : `Option ${b.rank}`}
                  </p>
                  <CardTitle className="font-serif text-2xl">{b.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    DRE {b.dre} · No office required · New agents{" "}
                    {b.newAgentOk ? "welcome" : "limited"}
                  </p>
                </div>
                <FitBadge fit={b.fit} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <p className="text-base leading-relaxed">{b.tagline}</p>
              <p className="text-muted-foreground leading-relaxed">{b.whyForYou}</p>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                    Money
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed">{b.splitSummary}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                    Year one
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed">{b.firstYearNote}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                    Broker support
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed">{b.support}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                    MetroList / Modesto
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed">{b.metroList}</dd>
                </div>
              </dl>
              <div>
                <p className="text-muted-foreground mb-2 text-xs uppercase tracking-wide">
                  Ask on the call
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
                  {b.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </div>
              {b.watchouts.length > 0 ? (
                <div className="bg-muted/60 rounded-lg px-3 py-2">
                  <p className="text-xs font-medium uppercase tracking-wide">Watch</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                    {b.watchouts.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <a
                  href={b.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants()}
                >
                  {b.applyLabel}
                </a>
                {b.phone ? (
                  <a
                    href={`tel:${b.phone}`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Call {b.phone}
                  </a>
                ) : null}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground whitespace-nowrap">
                  My status
                </span>
                <select
                  className="border-input bg-background h-8 rounded-lg border px-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(b.id, e.target.value as Status)}
                  aria-label={`Application status for ${b.name}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel[s]}
                    </option>
                  ))}
                </select>
              </label>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
