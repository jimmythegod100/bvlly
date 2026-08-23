import { brokerages, type Brokerage } from "@/data/brokerages"

export type CostResult = {
  brokerageId: string
  name: string
  brokerageCost: number
  youKeep: number
  gross: number
  monthlyCarry: number
  notes: string
}

const RM_PER_MILLION = 200

function reebrokerCost(deals: number, gci: number): Omit<CostResult, "brokerageId" | "name"> {
  let fee = 0
  for (let i = 1; i <= deals; i++) {
    if (i === 1) {
      fee += gci * 0.25 + RM_PER_MILLION
    } else {
      fee += 500 + RM_PER_MILLION
    }
  }
  const gross = deals * gci
  return {
    brokerageCost: fee,
    youKeep: gross - fee,
    gross,
    monthlyCarry: 0,
    notes: "Assumes first-file mentorship at 25% + $200 RM; later files $500 + $200 RM.",
  }
}

function sourceCost(deals: number, gci: number): Omit<CostResult, "brokerageId" | "name"> {
  const fee = deals * 595
  const gross = deals * gci
  return {
    brokerageCost: fee,
    youKeep: gross - fee,
    gross,
    monthlyCarry: 0,
    notes: "Published $595 per file including E&O. Confirm on the call.",
  }
}

function realCost(deals: number, gci: number): Omit<CostResult, "brokerageId" | "name"> {
  const CAP = 12_000
  const gross = deals * gci
  let company = 0
  let tx = 0
  for (let i = 1; i <= deals; i++) {
    tx += 40
    if (company < CAP) {
      const take = Math.min(gci * 0.15, CAP - company)
      company += take
      if (take < gci * 0.15) tx += 285
    } else {
      tx += 285
    }
  }
  const annual = Math.min(deals, 3) * 250
  const signup = deals >= 0 ? 249 : 0
  const fee = company + tx + annual + signup
  return {
    brokerageCost: fee,
    youKeep: gross - (company + tx + annual),
    gross,
    monthlyCarry: 0,
    notes: "Includes $249 signup, $250 of the annual fee per of the first 3 closings, 15% to $12k, $40 CBR, $285 after cap. You-keep excludes the one-time signup.",
  }
}

function expCost(deals: number, gci: number): Omit<CostResult, "brokerageId" | "name"> {
  const CAP = 16_000
  const gross = deals * gci
  let company = 0
  let mentor = 0
  let tx = 0
  for (let i = 1; i <= deals; i++) {
    const newAgent = i <= 3
    if (newAgent) mentor += gci * 0.2
    if (company < CAP) {
      const take = Math.min(gci * 0.2, CAP - company)
      company += take
      tx += take < gci * 0.2 ? 250 : 85
    } else {
      tx += 250
    }
  }
  const monthly = 85 * 12
  const signup = 149
  const fee = company + mentor + tx + monthly + signup
  return {
    brokerageCost: fee,
    youKeep: gross - (company + mentor + tx),
    gross,
    monthlyCarry: monthly,
    notes: "Includes $149 signup, $85/mo for 12 months, 20% extra mentor/program on first 3 files, 80/20 to $16k, then ~$250/file. You-keep excludes monthly + signup.",
  }
}

const estimators: Record<string, (deals: number, gci: number) => Omit<CostResult, "brokerageId" | "name">> = {
  reebroker: reebrokerCost,
  "real-estate-source": sourceCost,
  real: realCost,
  exp: expCost,
}

export function estimateCosts(deals: number, gci: number): CostResult[] {
  return brokerages.map((b: Brokerage) => {
    const row = estimators[b.id](deals, gci)
    return { brokerageId: b.id, name: b.name, ...row }
  })
}

export function money(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
}
