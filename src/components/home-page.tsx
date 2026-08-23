import { BrokerageList } from "@/components/brokerage-list"
import { CostCalculator } from "@/components/cost-calculator"
import { LocalSetup } from "@/components/local-setup"

export function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-10 sm:px-6 sm:py-14">
      <header className="space-y-4">
        <p className="text-primary text-sm font-medium tracking-wide uppercase">
          Modesto · California salesperson
        </p>
        <h1 className="font-serif text-4xl leading-tight text-pretty sm:text-5xl">
          Hang your license somewhere you do not have to sit in an office.
        </h1>
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-lg">
          You are newly licensed and based in Modesto. You already run other
          businesses. The shops below are cloud or 100% models with no floor
          time. Your MLS is MetroList; your local board is the Lodi Association
          of REALTORS® on Morris Avenue.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed">
          Start with <strong>REeBroker Group</strong> this week. If the first-file
          mentorship split feels high, compare that call to{" "}
          <strong>Real Estate Source</strong> ($595/file). Use Real or eXp only
          if you want a national platform — eXp if you want training, Real if
          you want no monthly bill.
        </p>
      </header>

      <section className="space-y-4" aria-labelledby="shortlist">
        <div>
          <h2 id="shortlist" className="font-serif text-3xl">
            Shortlist
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Status saves in this browser. Fees researched August 2026 — confirm
            on the ICA.
          </p>
        </div>
        <BrokerageList />
      </section>

      <section aria-labelledby="math">
        <h2 id="math" className="sr-only">
          Cost calculator
        </h2>
        <CostCalculator />
      </section>

      <section aria-labelledby="local">
        <h2 id="local" className="sr-only">
          Local setup
        </h2>
        <LocalSetup />
      </section>

      <footer className="text-muted-foreground border-t pt-6 text-xs leading-relaxed">
        Not legal, tax, or DRE advice. Brokerage fees, mentor splits, and MLS
        dues change. Do not transfer your license until you have a signed
        independent contractor agreement and written confirmation of MetroList
        access.
      </footer>
    </div>
  )
}
