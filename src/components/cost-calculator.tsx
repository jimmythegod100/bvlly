"use client"

import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { estimateCosts, money } from "@/lib/cost"

export function CostCalculator() {
  const [deals, setDeals] = useState(2)
  const [gci, setGci] = useState(10000)
  const rows = useMemo(() => estimateCosts(deals, gci), [deals, gci])
  const gross = deals * gci

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Year-one cost snapshot</CardTitle>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Modesto median sale is roughly the mid-$400s. At 2.5% on $400k you
          are looking at about $10,000 gross commission per side. Drag the
          sliders. These are planning numbers — get the ICA in writing before
          you transfer.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium">Closed deals this year</span>
              <span className="font-serif text-xl">{deals}</span>
            </div>
            <Slider
              min={0}
              max={12}
              step={1}
              value={[deals]}
              onValueChange={(value) => {
                const next = Array.isArray(value) ? value[0] : deals
                if (typeof next === "number") setDeals(next)
              }}
            />
          </label>
          <label className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium">Gross commission per deal</span>
              <Input
                type="number"
                min={2000}
                step={500}
                value={gci}
                onChange={(e) => setGci(Number(e.target.value) || 0)}
                className="h-8 w-28 text-right"
              />
            </div>
            <Slider
              min={4000}
              max={25000}
              step={500}
              value={[gci]}
              onValueChange={(value) => {
                const next = Array.isArray(value) ? value[0] : gci
                if (typeof next === "number") setGci(next)
              }}
            />
          </label>
        </div>

        <p className="text-muted-foreground text-sm">
          Gross this year: <span className="text-foreground font-medium">{money(gross)}</span>
          {deals === 0
            ? " — with zero closings, monthly-fee shops still bill you."
            : null}
        </p>

        <div className="overflow-x-auto rounded-lg ring-1 ring-foreground/10">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-muted/70 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Brokerage</th>
                <th className="px-3 py-2 font-medium">Est. fees</th>
                <th className="px-3 py-2 font-medium">You keep</th>
                <th className="px-3 py-2 font-medium">Monthly carry</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.brokerageId} className="border-t">
                  <td className="px-3 py-2.5 font-medium">{row.name}</td>
                  <td className="px-3 py-2.5">{money(row.brokerageCost)}</td>
                  <td className="px-3 py-2.5">{deals === 0 ? "—" : money(row.youKeep)}</td>
                  <td className="px-3 py-2.5">
                    {row.monthlyCarry > 0 ? (
                      <Badge variant="outline">{money(row.monthlyCarry)} / yr</Badge>
                    ) : (
                      <span className="text-muted-foreground">$0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {rows[0]?.notes} Association, MetroList, lockbox, signs, and C.A.R.
          dues are extra at every shop.
        </p>
      </CardContent>
    </Card>
  )
}
