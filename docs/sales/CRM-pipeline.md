# CRM Pipeline, Fields & KPIs (v1.0)

## Pipeline Stages

| Stage | Definition | Exit Criteria | Probability |
|-------|------------|---------------|-------------|
| 1. Targeted Prospect | Identified fit, no contact yet | First outreach sent | 5% |
| 2. Engaged | Responded to outreach | Discovery call scheduled | 10% |
| 3. Discovery | Active conversation | Pain confirmed, budget discussed | 20% |
| 4. Pilot Design | Scoping pilot scope | Mutual action plan agreed | 40% |
| 5. Proposal Sent | SOW delivered | Verbal commitment received | 60% |
| 6. Negotiation | Terms being finalized | Contract sent for signature | 75% |
| 7. Closed Won | Contract signed | Payment received | 100% |
| 8. Closed Lost | Deal lost | Reason documented | 0% |

---

## Required Fields by Stage

### Stage 1: Targeted Prospect
- [ ] Company name
- [ ] Industry/vertical
- [ ] Company size (employees)
- [ ] Primary contact name
- [ ] Primary contact title
- [ ] Primary contact email
- [ ] Source (inbound/outbound/referral)
- [ ] ICP fit score (1-5)

### Stage 2: Engaged
- [ ] Response date
- [ ] Response type (email/LinkedIn/phone)
- [ ] Sentiment (positive/neutral/negative)
- [ ] Next step scheduled

### Stage 3: Discovery
- [ ] Discovery call date
- [ ] Attendees
- [ ] Pain points identified
- [ ] Current AI tools in use
- [ ] Governance gaps noted
- [ ] Budget range (if disclosed)
- [ ] Timeline urgency (1-5)
- [ ] Decision maker identified

### Stage 4: Pilot Design
- [ ] Pilot scope (workflows)
- [ ] Success criteria defined
- [ ] Technical requirements
- [ ] Integration points
- [ ] Pilot duration
- [ ] Pricing tier
- [ ] Mutual action plan created

### Stage 5: Proposal Sent
- [ ] SOW sent date
- [ ] SOW amount
- [ ] Payment terms
- [ ] Key stakeholders copied
- [ ] Follow-up date set

### Stage 6: Negotiation
- [ ] Negotiation points
- [ ] Discount requested
- [ ] Discount approved (Y/N)
- [ ] Legal review status
- [ ] Security review status
- [ ] Expected close date

### Stage 7: Closed Won
- [ ] Contract signed date
- [ ] Contract value
- [ ] Payment schedule
- [ ] Implementation kickoff date
- [ ] Customer success handoff

### Stage 8: Closed Lost
- [ ] Loss reason (primary)
- [ ] Loss reason (secondary)
- [ ] Competitor selected (if any)
- [ ] Reopen potential (Y/N)
- [ ] Lessons learned

---

## Loss Reasons (Standard Picklist)

| Code | Reason | Follow-up Timing |
|------|--------|------------------|
| L1 | No budget | 6 months |
| L2 | Not a priority | 3 months |
| L3 | Chose competitor | 12 months |
| L4 | Internal solution | 6 months |
| L5 | No decision made | 3 months |
| L6 | Champion left | Immediate (new contact) |
| L7 | Bad timing | 6 months |
| L8 | Scope mismatch | As needs change |
| L9 | Security/compliance blocker | As resolved |
| L10 | Other | Case by case |

---

## Key Performance Indicators (KPIs)

### Activity Metrics (Weekly)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Outbound emails sent | 50/week | CRM tracking |
| LinkedIn connections | 25/week | Manual count |
| Discovery calls held | 5/week | Calendar sync |
| Proposals sent | 2/week | CRM tracking |

### Pipeline Metrics (Monthly)
| Metric | Target | Measurement |
|--------|--------|-------------|
| New opportunities | 10/month | Stage 3+ entries |
| Pipeline value | $500K+ | Weighted by probability |
| Stage conversion rate | 50%+ | Stage-to-stage movement |
| Average deal size | $75K+ | Closed won average |

### Outcome Metrics (Quarterly)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Closed won revenue | $150K+ | Signed contracts |
| Win rate | 25%+ | Won / (Won + Lost) |
| Average sales cycle | <60 days | First contact to close |
| Pilot conversion rate | 70%+ | Pilots to enterprise |

---

## Pipeline Health Indicators

### Healthy Pipeline
- ✅ 3x coverage (pipeline value = 3x target)
- ✅ Balanced distribution across stages
- ✅ No deals stalled >14 days
- ✅ Next steps scheduled for all active deals
- ✅ Accurate close dates

### Warning Signs
- ⚠️ <2x coverage
- ⚠️ Deals stuck in same stage
- ⚠️ Missing required fields
- ⚠️ No activity in 7+ days
- ⚠️ Close dates keep pushing

### Critical Issues
- 🚨 <1x coverage
- 🚨 Deals with no next steps
- 🚨 Unresponsive champions
- 🚨 Repeated loss to same competitor
- 🚨 Pricing objections increasing

---

## Reporting Cadence

### Daily
- New leads entered
- Deals moving stages
- Overdue tasks

### Weekly
- Pipeline review meeting
- Activity metrics review
- Forecast discussion

### Monthly
- Pipeline health analysis
- Win/loss review
- KPI dashboard update

### Quarterly
- Strategic pipeline review
- ICP refinement
- Process improvements

---

## CRM Best Practices

### Data Quality Rules
1. **Complete required fields** before advancing stages
2. **Update close dates** when timeline changes
3. **Log all activities** within 24 hours
4. **Document loss reasons** for every closed-lost deal
5. **Set next steps** for every active opportunity

### Hygiene Standards
- No duplicate accounts
- Consistent naming conventions
- Current contact information
- Accurate company data
- Proper stage assignments

### Review Triggers
- Deal >$100K → Manager review
- Discount >10% → Approval workflow
- Stalled >14 days → Intervention required
- Close date change → Forecast update

---

## Integration Points

### Connected Systems
- **Email:** Sync for activity tracking
- **Calendar:** Meeting scheduling
- **LinkedIn:** Lead enrichment
- **Stripe:** Payment tracking
- **Slack:** Notifications

### Automation Rules
- New lead → Auto-assign based on territory
- Stage change → Notify manager
- Close date passed → Alert sales rep
- Closed won → Trigger onboarding workflow
- Closed lost → Schedule follow-up task

---

*Version 1.0 | January 2026 | Giant Ventures LLC*
