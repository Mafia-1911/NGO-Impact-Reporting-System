# NGO-Impact-Reporting-System
**Objective and Why’s :**  
→NGOs needing traceable reporting for international donors   
→Also the Doners want to see where there donations have been used ,   
→ To help NGOs manage projects, track fund utilization, monitor outcomes, and transparently report impact to donors and regulators   
→ To help user donate to beneficiaries directly 

ER Diagram -> https://app.diagrams.net/?splash=0#G1QIU1kPRN7ijQUn3EMkjGxYVHjc8b6Zs7#%7B%22pageId%22%3A%22hw2SvorGrzuGAmRxIAfh%22%7D

**Core Features:**

- Project budgets, activity plans, and execution tracking
- Audit history and documentation linkage
- Track total budget and disbursement per project
- Show donor-wise contribution across projects
- View project progress (timeline, % budget spent, beneficiary coverage)
- Generate impact reports (e.g., "1,200 families received food kits in Kurigram district")
- Monitor staff allocation and responsibilities
- Export donor-wise impact summary
- Real-time alerts for over/under spending
- Track project phases (planned, active, completed, on-hold)

**Advanced SQL Work:**

- Views for donor-wise impact summaries
- Triggers to enforce financial limits
- Procedures to generate monthly impact reports into Excel or pdf
- Find top 5 donors by total contribution in the last fiscal year
- Calculate spending per beneficiary per project
- Show activities with highest cost impact

🔄 Triggers

- Wont allow to Disburse if the amount exceeds remaining budget
- On INSERT to Reports: auto-update project’s last_report_submitted field

🧠 Stored Procedures

- Generate monthly spending summary for all active projects
- Calculate % of project completed based on dates and funds used

👁 Views

- donor_impact_summary: Donor → Projects → Activities → Beneficiaries
- project_budget_tracker: Project → Budget vs Disbursement over time

📎 Constraints & Integrity
- No disbursement without a valid grant
- Beneficiaries must belong to an active project
- A project must have at least one donor and one report
