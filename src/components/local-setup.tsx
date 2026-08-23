import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { localSetup, skipList } from "@/data/brokerages"

export function LocalSetup() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Modesto onboarding</CardTitle>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The brokerage hangs your license. You still join the local
            association and MLS. You might visit Morris Avenue once for
            identity / eKEY — that is not floor time.
          </p>
        </CardHeader>
        <CardContent>
          <Accordion>
            <AccordionItem value="dre">
              <AccordionTrigger>{localSetup.dreLicensing.title}</AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal space-y-2 pl-5">
                  {localSetup.dreLicensing.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <p className="mt-3">
                  <a href={localSetup.dreLicensing.url} target="_blank" rel="noreferrer">
                    Open DRE eLicensing
                  </a>
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="lar">
              <AccordionTrigger>{localSetup.association.title}</AccordionTrigger>
              <AccordionContent>
                <p>{localSetup.association.notes}</p>
                <p className="mt-2">
                  {localSetup.association.address}
                  <br />
                  {localSetup.association.phone}
                </p>
                <p className="mt-3">
                  <a href={localSetup.association.url} target="_blank" rel="noreferrer">
                    Apply at connectlar.org
                  </a>
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="mls">
              <AccordionTrigger>{localSetup.mls.title}</AccordionTrigger>
              <AccordionContent>
                <p>{localSetup.mls.notes}</p>
                <p className="mt-2">
                  {localSetup.mls.phone}
                  <br />
                  {localSetup.mls.email}
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="script">
              <AccordionTrigger>Say this on every brokerage call</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-2 pl-5">
                  {localSetup.callScript.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Skip unless you want an office</CardTitle>
          <p className="text-muted-foreground text-sm leading-relaxed">
            These shops hire in Modesto. They are the opposite of what you
            asked for.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {skipList.map((item) => (
            <div key={item.name} className="border-border border-b pb-3 last:border-0 last:pb-0">
              <p className="font-medium">{item.name}</p>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {item.reason}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
