import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PrintableHeading, LastUpdated } from "./PrintStyles";
import { WhatWeSell } from "./sales/WhatWeSell";
import { SalesPitchDeck } from "./sales/SalesPitchDeck";
import { DiscoveryQuestions } from "./sales/DiscoveryQuestions";
import { ObjectionHandling } from "./sales/ObjectionHandling";
import { SalesLanguageGuide } from "./sales/SalesLanguageGuide";
import { SalesReadinessQuiz } from "./sales/SalesReadinessQuiz";
import { FAQsByPersona } from "./sales/FAQsByPersona";
import { PackagingPricing } from "./sales/PackagingPricing";
import { IncumbentPositioning } from "./sales/IncumbentPositioning";

export const SalesManualTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">📒 Sales Manual</CardTitle>
          <CardDescription>
            Canonical sales training, field guide, and print-ready materials for business development.
          </CardDescription>
          <LastUpdated />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="what-we-sell" className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-1 mb-6">
              <TabsTrigger value="what-we-sell" className="text-xs sm:text-sm">What We Sell</TabsTrigger>
              <TabsTrigger value="pitch-deck" className="text-xs sm:text-sm">Pitch Deck</TabsTrigger>
              <TabsTrigger value="discovery" className="text-xs sm:text-sm">Discovery</TabsTrigger>
              <TabsTrigger value="objections" className="text-xs sm:text-sm">Objections</TabsTrigger>
              <TabsTrigger value="language" className="text-xs sm:text-sm">Language</TabsTrigger>
              <TabsTrigger value="quiz" className="text-xs sm:text-sm">Quiz</TabsTrigger>
              <TabsTrigger value="faqs" className="text-xs sm:text-sm">FAQs</TabsTrigger>
              <TabsTrigger value="pricing" className="text-xs sm:text-sm">Pricing</TabsTrigger>
              <TabsTrigger value="incumbent" className="text-xs sm:text-sm">Incumbent</TabsTrigger>
            </TabsList>

            <TabsContent value="what-we-sell">
              <WhatWeSell />
            </TabsContent>

            <TabsContent value="pitch-deck">
              <SalesPitchDeck />
            </TabsContent>

            <TabsContent value="discovery">
              <DiscoveryQuestions />
            </TabsContent>

            <TabsContent value="objections">
              <ObjectionHandling />
            </TabsContent>

            <TabsContent value="language">
              <SalesLanguageGuide />
            </TabsContent>

            <TabsContent value="quiz">
              <SalesReadinessQuiz />
            </TabsContent>

            <TabsContent value="faqs">
              <FAQsByPersona />
            </TabsContent>

            <TabsContent value="pricing">
              <PackagingPricing />
            </TabsContent>

            <TabsContent value="incumbent">
              <IncumbentPositioning />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
