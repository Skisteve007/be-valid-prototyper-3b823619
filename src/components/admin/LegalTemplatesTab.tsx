import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, FileText, Calendar, Download } from "lucide-react";
import { toast } from "sonner";

interface LegalTemplate {
  id: string;
  title: string;
  summaryLine: string;
  fullText: string;
}

const legalTemplates: LegalTemplate[] = [
  {
    id: "mutual-nda",
    title: "Mutual NDA (Non-Disclosure Agreement)",
    summaryLine: "Giant Ventures LLC, Texas | Short, strong mutual NDA",
    fullText: `MUTUAL NON-DISCLOSURE AGREEMENT (MUTUAL NDA)

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of [Effective Date] ("Effective Date") by and between:

(1) Giant Ventures LLC, a Texas limited liability company ("Company"), with an address at [Company Address]; and

(2) [Recipient Name], an individual/company ("Recipient"), with an address at [Recipient Address].

Company and Recipient may be referred to individually as a "Party" and collectively as the "Parties."

1) Purpose.
The Parties wish to explore a potential business relationship, engagement, or employment/contractor relationship (the "Purpose"). In connection with the Purpose, each Party may disclose Confidential Information to the other.

2) Confidential Information.
"Confidential Information" means any non-public information disclosed by a Party ("Disclosing Party") to the other ("Receiving Party"), whether oral, written, electronic, or other form, that is designated confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure, including without limitation: product plans, technical designs, source code, models, prompts, workflows, security practices, customer lists, pricing, financials, business strategy, and any demo or investor materials.

3) Exclusions.
Confidential Information does not include information that the Receiving Party can demonstrate by written records: (a) was publicly available through no breach of this Agreement; (b) was already lawfully known to the Receiving Party without restriction; (c) was independently developed without use of Confidential Information; or (d) was rightfully received from a third party without duty of confidentiality.

4) Obligations.
The Receiving Party will: (a) use Confidential Information solely for the Purpose; (b) not disclose Confidential Information to any third party except to its representatives who have a need to know and are bound by confidentiality obligations at least as protective as this Agreement; and (c) protect Confidential Information using at least reasonable care (and no less than the care it uses to protect its own similar information).

5) Compelled Disclosure.
If the Receiving Party is required by law to disclose Confidential Information, it will (to the extent legally permitted) provide prompt notice to the Disclosing Party and cooperate to seek protective treatment.

6) Term.
This Agreement begins on the Effective Date and continues for two (2) years. Confidentiality obligations for trade secrets survive as long as such information remains a trade secret under applicable law. For all other Confidential Information, obligations survive three (3) years from the date of disclosure.

7) Return/Destruction.
Upon request, the Receiving Party will promptly return or destroy Confidential Information and certify destruction, except that one archival copy may be retained solely for legal compliance.

8) No License / No Obligation.
No rights or licenses are granted except as expressly set forth. Nothing requires either Party to proceed with a transaction.

9) Injunctive Relief.
The Parties agree that unauthorized disclosure or use may cause irreparable harm, and the Disclosing Party may seek injunctive relief in addition to other remedies.

10) Governing Law; Venue.
This Agreement is governed by Texas law, without regard to conflict-of-law rules. Exclusive venue for any dispute will be state or federal courts located in [County], Texas, and each Party consents to personal jurisdiction there.

11) Entire Agreement.
This Agreement is the entire agreement regarding its subject matter and supersedes prior discussions.

AGREED:

Giant Ventures LLC                         [Recipient Name]

By: ___________________________            By: ___________________________

Name/Title: ____________________           Name/Title: ____________________

Date: __________________________            Date: __________________________`
  },
  {
    id: "contractor-agreement",
    title: "Independent Contractor Agreement (IP + Confidentiality)",
    summaryLine: "Giant Ventures LLC, Texas | IP Assignment + Security + No Agency",
    fullText: `INDEPENDENT CONTRACTOR AGREEMENT
(Confidentiality + IP Assignment + Security)

This Independent Contractor Agreement ("Agreement") is entered into as of [Effective Date] by and between:

(1) Giant Ventures LLC, a Texas limited liability company ("Company"), with an address at [Company Address]; and

(2) [Contractor Name] ("Contractor"), with an address at [Contractor Address].

1) Services.
Contractor will provide the services described in Exhibit A (the "Services") during the Term. Contractor will determine the manner and means of performing the Services, subject to Company requirements and policies provided in writing.

2) Term.
The term begins on [Start Date] and continues until [End Date] unless earlier terminated under Section 11.

3) Compensation.
Compensation will be as set forth in Exhibit B. Unless stated otherwise, Contractor is responsible for all expenses.

4) Independent Contractor Status.
Contractor is an independent contractor and not an employee, agent, joint venturer, or partner of Company. Contractor is not authorized to bind Company. Contractor is responsible for all taxes, withholdings, and statutory obligations.

5) Confidentiality.
(a) "Confidential Information" includes all non-public information about Company's business, products, customers, technology, security, pricing, plans, demos, and any work product.
(b) Contractor will not use Confidential Information except for performing Services.
(c) Contractor will not disclose Confidential Information to third parties.
(d) These obligations survive termination indefinitely for trade secrets and three (3) years for other Confidential Information.

6) Intellectual Property Assignment.
(a) All work product, inventions, designs, code, documentation, and materials created by Contractor in connection with the Services ("Work Product") is the sole property of Company.
(b) Contractor hereby assigns to Company all rights, title, and interest in Work Product, including all intellectual property rights.
(c) Contractor will execute any documents reasonably requested by Company to perfect such assignment.
(d) To the extent any Work Product includes pre-existing materials owned by Contractor, Contractor grants Company a perpetual, royalty-free, worldwide license to use such materials.

7) Security.
(a) Contractor will follow Company security policies provided in writing.
(b) Contractor will use reasonable security measures to protect Company data.
(c) Contractor will promptly notify Company of any suspected security incident.

8) Representations & Warranties.
Contractor represents that: (a) Contractor has the right to enter this Agreement; (b) Services will be performed in a professional manner; (c) Work Product will not infringe third-party rights.

9) Indemnification.
Contractor will indemnify Company against claims arising from: (a) Contractor's breach of this Agreement; (b) Contractor's negligence or willful misconduct; (c) any claim that Work Product infringes third-party rights.

10) No Agency.
Nothing in this Agreement creates an agency, partnership, or employment relationship. Contractor has no authority to bind Company in any manner.

11) Termination.
Either party may terminate with [14] days written notice. Company may terminate immediately for cause (including breach, misconduct, or failure to perform). Upon termination, Contractor will return all Company materials and Confidential Information.

12) Injunctive Relief.
Contractor acknowledges that breach of confidentiality or IP provisions would cause irreparable harm. Company may seek injunctive relief in addition to other remedies.

13) Governing Law; Venue.
This Agreement is governed by Texas law. Exclusive venue is state or federal courts in [County], Texas.

14) Entire Agreement; Amendment.
This Agreement (including Exhibits) is the entire agreement and supersedes prior discussions. Amendments require written agreement by both parties.

AGREED:

Giant Ventures LLC                         [Contractor Name]

By: ___________________________            By: ___________________________

Name/Title: ____________________           Name/Title: ____________________

Date: __________________________            Date: __________________________


------------------------------------------------------------
EXHIBIT A — SERVICES
------------------------------------------------------------

Role/Title: [Role Title]

Description of Services:
[Describe specific services, deliverables, and responsibilities]


------------------------------------------------------------
EXHIBIT B — COMPENSATION
------------------------------------------------------------

Compensation Terms:
- Rate: [$ amount / hour OR $ amount / month OR project-based]
- Payment Schedule: [e.g., monthly, upon milestone completion]
- Invoicing: Contractor will submit invoices by [date] each month

Equity Terms (if applicable):
- [Describe equity grant, vesting schedule, or reference to separate equity agreement]
- [OR "No equity is included in this engagement."]

Expenses:
- [Describe any reimbursable expenses, or "Contractor is responsible for all expenses."]`
  }
];

export function LegalTemplatesTab() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyTemplate = async (template: LegalTemplate) => {
    try {
      await navigator.clipboard.writeText(template.fullText);
      setCopiedId(template.id);
      toast.success(`"${template.title}" copied to clipboard`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = (template: LegalTemplate, format: 'txt') => {
    const blob = new Blob([template.fullText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.id}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success(`Downloaded ${template.title}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Legal Templates — Giant Ventures LLC (Texas)
              </CardTitle>
              <CardDescription className="mt-2">
                Copy/paste ready legal documents. Fill in bracketed fields before use.
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Last updated: Dec 28, 2024
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {legalTemplates.map((template) => (
              <AccordionItem 
                key={template.id} 
                value={template.id}
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-base">{template.title}</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      {template.summaryLine}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4">
                    <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg border font-mono overflow-x-auto max-h-[500px] overflow-y-auto">
                      {template.fullText}
                    </pre>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        onClick={() => handleCopyTemplate(template)}
                        variant={copiedId === template.id ? "secondary" : "default"}
                      >
                        {copiedId === template.id ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Template
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleDownload(template, 'txt')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download .txt
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="border-muted">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> These templates are provided for convenience only and do not constitute legal advice. 
            Consult with a qualified attorney before using these documents. Fill in all bracketed fields [like this] 
            before sending. Review all terms carefully for your specific situation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}