# Content Harvest SOP (Website, GitHub, LinkedIn)

## Purpose

Centralize all sales collateral from public and internal sources into a Single Source of Truth (SSOT) repository.

---

## Scope

| Source | Content Type | Priority |
|--------|--------------|----------|
| Website (bevalid.app) | Landing pages, product descriptions, feature lists | High |
| GitHub (Skisteve007) | READMEs, documentation, technical specs | High |
| LinkedIn | Company posts, founder posts, engagement content | Medium |
| Admin Portal | Sales manual, CEO playbook, pricing sheets | Critical |
| Pitch Deck | Investor materials, demo content | Critical |

---

## Step-by-Step Process

### Step 1: Website Crawl

**Tools:** Firecrawl, manual export, or browser save

**Pages to capture:**
- [ ] Homepage (/)
- [ ] About/Mission
- [ ] Product pages (/demos, /synth)
- [ ] Pricing (/pricing, /operation-sf)
- [ ] Partner solutions (/partners)
- [ ] Investor portal (/investor-portal)
- [ ] Trust/Security pages
- [ ] Legal (Terms, Privacy)

**Output format:** Markdown files in `/content/website/`

---

### Step 2: GitHub Documentation

**Repository:** https://github.com/Skisteve007

**Content to extract:**
- [ ] Main README.md
- [ ] /docs folder content
- [ ] API documentation
- [ ] Integration guides
- [ ] Architecture diagrams

**Output format:** Markdown files in `/content/github/`

---

### Step 3: LinkedIn Content

**Profile:** https://www.linkedin.com/in/steven-grillo-00885b21a/

**Content to capture:**
- [ ] Company page description
- [ ] Featured posts (last 90 days)
- [ ] High-engagement content
- [ ] Key announcements

**Output format:** Markdown files in `/content/linkedin/`

---

### Step 4: Admin Portal Export

**Source:** Internal admin dashboard

**Content to extract:**
- [ ] Sales Manual (full text)
- [ ] CEO Playbook (all sections)
- [ ] Pricing sheets (all tiers)
- [ ] Battle cards
- [ ] Objection handlers
- [ ] Discovery frameworks

**Output format:** Markdown files in `/content/internal/`

---

### Step 5: Pitch Deck & Demos

**Source:** /pitch-deck, /demos

**Content to capture:**
- [ ] All slide content (text extraction)
- [ ] Key graphics/diagrams (as descriptions)
- [ ] Demo scripts
- [ ] Value propositions
- [ ] Competitive positioning

**Output format:** Markdown files in `/content/pitch/`

---

## Normalization Guidelines

### File Naming Convention
```
[source]-[topic]-[date].md

Examples:
website-homepage-2026-01.md
github-api-docs-2026-01.md
linkedin-launch-announcement-2026-01.md
```

### Content Structure
```markdown
# [Title]

**Source:** [URL or location]
**Captured:** [Date]
**Status:** [Draft/Review/Approved]

## Summary
[2-3 sentence overview]

## Full Content
[Extracted content]

## Key Messages
- [Bullet points of main takeaways]

## Usage Notes
[How/where this content should be used]
```

---

## Deduplication Process

1. **Identify duplicates** — Same messaging appearing in multiple sources
2. **Select canonical version** — Choose the most complete/current version
3. **Cross-reference** — Note where content appears across sources
4. **Archive alternatives** — Keep non-canonical versions in `/archive/`

---

## Review Workflow

### Initial Review (Day 1-2)
- [ ] Complete harvest from all sources
- [ ] Normalize into markdown format
- [ ] Deduplicate content

### Content Review (Day 3-4)
- [ ] Steve reviews for accuracy
- [ ] Flag outdated content
- [ ] Identify gaps

### Finalization (Day 5)
- [ ] Apply corrections
- [ ] Mark content as approved
- [ ] Publish to SSOT repo

---

## Maintenance Schedule

| Frequency | Activity |
|-----------|----------|
| Weekly | Check for new LinkedIn posts |
| Bi-weekly | Review website for updates |
| Monthly | Full content audit |
| Quarterly | Major refresh cycle |

---

## Quality Checklist

Before marking content as complete:

- [ ] All sources harvested
- [ ] Content normalized to markdown
- [ ] Duplicates identified and resolved
- [ ] Owner review completed
- [ ] Files properly named and organized
- [ ] Cross-references documented
- [ ] Usage notes added

---

## Output Repository Structure

```
/docs/sales/
├── README.md (this index)
├── sales-playbook.md
├── pricing-packaging.md
├── alliance-badge-program.md
├── pilot-sow-template.md
├── outbound-sequences.md
├── content-harvest-SOP.md
└── CRM-pipeline.md

/content/
├── website/
├── github/
├── linkedin/
├── internal/
├── pitch/
└── archive/
```

---

*Version 1.0 | January 2026 | Giant Ventures LLC*
