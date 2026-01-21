# College Student Personas — Budgeting & Bill Splitting

A concise, development-ready reference with three detailed user personas based on real student pain points around budgeting, irregular income, currency conversion, and bill splitting. Use this during product design, feature prioritization, and UX flows.

---

## Persona 1 — Alex Chen

**Core**
- **Name:** Alex Chen
- **Age / Year:** 20, Sophomore
- **Major:** Computer Science
- **Living Situation:** Off‑campus apartment; shares with 2 roommates (3-person unit)
- **Income:** $800 / month from a part‑time campus IT job; $2,000 scholarship paid per semester (lump sum)
- **Major Expenses:** Rent (Alex’s share: $450/mo), groceries (~$200/mo personal/household share), textbooks (variable), entertainment & food delivery
- **Tech Comfort:** High — early adopter of apps; comfortable with spreadsheets and integrations
- **Quote:** “I know I'm spending too much on DoorDash, but I don't realize it until my bank account is low.”

**Financial Pain Points (concise)**
- Irregular cashflow because scholarship arrives as a semester lump sum creating long periods with less income.
- Repeated friction splitting groceries and utilities with roommates; ad‑hoc IOUs pile up.
- Uses Venmo for person‑to‑person payments but loses track of outstanding debts and who paid what.
- Wants to save for summer (when part‑time income drops) but has no automated save schedule.

**Behavior & Current Tools**
- Tools: Venmo (payments), Notes app (quick tracking), Excel (rarely updated)
- Typical flow: Buys food / orders delivery → pays via Venmo or card → later checks bank balance and panics.
- Social: Comfortable asking roommates to pay but avoids awkward group money convos.

**Primary use case for our app**
- Fast, automated roommate bill splitting and persistent roommate balances with reminders and one‑tap settlement using Venmo / bank links.
- Scheduleable savings goal tied to lump‑sum scholarship events (automatically split scholarship into monthly budgets + savings transfer).

**Biggest win if they use our app**
- Alex consistently saves $500 for summer without manual tracking and never has an awkward roommate confrontation about who owes what — the app keeps a clear running balance and sends polite reminders before due dates.

**Photo description (for later visualization)**
- Young Asian male, casual hoodie, headphones around neck, studying on a laptop at a coffee shop with a half‑finished takeaway cup nearby.

---

## Persona 2 — Maria Rodriguez

**Core**
- **Name:** Maria Rodriguez
- **Age / Year:** 22, Senior
- **Major:** Psychology
- **Living Situation:** Off‑campus shared house with 3 roommates (4 total)
- **Income:** $6,000 per semester in student loan disbursements; occasional babysitting $100–200 / month
- **Major Expenses:** Rent (Maria’s share: $500/mo), utilities (shared), groceries (shared), textbooks, therapy co‑pay
- **Tech Comfort:** Medium — uses a few apps (Splitwise) but prefers simple, straightforward UX
- **Quote:** “I paid for the electric bill again and forgot to ask my roommates for their share. I'm basically subsidizing everyone.”

**Financial Pain Points (concise)**
- Anxiety and stress over loan balances and making the loan money last the semester.
- Multiple shared expenses across different payers and cycles (monthly utilities, one‑off house purchases).
- Forgets to request or follow up with roommates, resulting in Maria covering costs herself.
- Lack of a clear month‑to‑month budget aligned to loan disbursement timing — overspending early and cash short later.

**Behavior & Current Tools**
- Tools: Splitwise (used inconsistently), bank app (frequent balance checks), pen & paper notes for ad‑hoc tracking
- Typical flow: Receives loan disbursement at semester start → pays recurring bills and buys groceries → expects roommates to reimburse → often doesn’t collect promptly.

**Primary use case for our app**
- Semester‑aware budget planner that spreads loan disbursements into predictable monthly allowances, tracks shared expenses by household and automates reminders & follow‑ups to roommates with friendly, templated messages.

**Biggest win if they use our app**
- Maria reduces loan‑driven anxiety because the app turns a $6,000 lump sum into a clear, month‑by‑month spending plan, and roommate debts are collected automatically: fewer unpaid IOUs and less out‑of‑pocket covering.

**Photo description (for later visualization)**
- Young Latina female, casual sweater, sitting at a kitchen table with a small stack of bills and a phone open to a budgeting app, looking worried but determined.

---

## Persona 3 — Yuki Tanaka

**Core**
- **Name:** Yuki Tanaka
- **Age / Year:** 21, Junior
- **Major:** Business Administration
- **Living Situation:** University dorms; meal plan included (so fewer recurring housing splits)
- **Income:** $1,500 / month sent by parents in JPY (converted to USD)
- **Major Expenses:** Dorm fees (pre‑paid), textbooks, social activities, occasional travel home, savings for post‑graduation travel
- **Tech Comfort:** High — detail‑oriented and organized; uses Google Sheets and multi‑currency banking
- **Quote:** “My parents ask where the money goes, but tracking everything in yen and dollars is exhausting.”

**Financial Pain Points (concise)**
- Currency conversion complexity (JPY → USD) creates uncertainty in monthly budgets and unexpected fees from FX conversions.
- Parents expect visibility into spending and want reassurance their transfers are used responsibly.
- Occasional group activities where friends use different payment apps (Venmo, cash, international transfers) complicate quick settlements.
- Wants to save in USD for travel but conversion timing and fees reduce saving efficiency.

**Behavior & Current Tools**
- Tools: Bank app with multi‑currency features, Google Sheets shared with parents, Venmo for peer payments
- Typical flow: Receives transfer from parents in yen → bank converts to USD (fees may apply) → logs expenses in a Google Sheet to share with parents monthly.

**Primary use case for our app**
- A multi‑currency-aware wallet that shows converted balances with live FX estimates, tracks spending in both currencies, and offers low‑fee conversion scheduling + shareable monthly summaries for parents.

**Biggest win if they use our app**
- Yuki avoids conversion surprises and hits a reliable $200/month USD savings target through scheduled low‑fee conversions and automated transfers; parents receive clear, neat monthly reports so trust increases.

**Photo description (for later visualization)**
- Young East Asian female, neat button‑up shirt, sitting in a dorm common area with a laptop and a notebook, a small Japanese coin purse visible next to her phone.

---

## Cross‑Persona Notes (quick reference)

**Common needs across personas**
- Clear handling of irregular/lump‑sum income (scholarships, loan disbursements) → automated smoothing into monthly budgets.
- Robust roommate bill splitting with persistent balances, reminders, and friction‑free settlement options (Venmo / bank integration).
- Simple, shareable summaries (monthly reports / exportable CSVs) to reduce awkward money conversations.
- Multi‑currency support and conversion scheduling for international students.

**Feature ideas that map directly to pain points**
- "Semester Smoothing": allocate lump sums into monthly budgets and auto‑transfer to savings goals.
- "Household Ledger": shared household with line‑item expenses, settled via 1‑tap payment, automated reminders and escalation rules.
- "Parent View" (opt‑in): read‑only monthly snapshot for parents (for international students).
- Low‑fee FX scheduler: convert parent transfers at scheduled times to reduce fees and volatility.

---

*Document created as a development reference. Use these personas when designing user flows, onboarding copy, and notification tone. Keep language simple and reduce friction for low‑tech users (Maria) while offering power features for advanced users (Alex, Yuki).*


---

# MoSCoW Prioritization — Student Finance Dashboard MVP

**Goal:** Ship a recruiter‑impressive, student‑loved MVP in **8–12 weeks**, with a **fully usable free tier**, combining **budgeting + bill splitting**, and showcasing **AI-powered features**.

Timeline assumption:
- **Must Have:** ~6–8 weeks total
- **Should Have:** v1.1 (post‑MVP)
- **Could Have:** Stretch / hackathon / polish

---

## MUST HAVE (Core MVP — Cannot Launch Without)

> These features directly solve the core pain points of Alex, Maria, and Yuki. Total estimated dev time ≈ **260–300 hours** (fits 6–8 weeks for a solo dev or small team).

### 1. User Authentication & Profile Setup
- **User Value:** All personas need secure, personal financial data. Enables personalization (currency, roommates, goals).
- **Personas:** All
- **Technical Complexity:** 2/5
- **Estimated Dev Time:** 10 hours
- **Dependencies:** Backend auth service, database schema

---

### 2. Manual Transaction Entry (Expenses & Income)
- **User Value:**
  - Maria needs to see where loan money goes.
  - Alex wants visibility into food & entertainment overspending.
  - Yuki logs expenses for parental transparency.
- **Technical Complexity:** 2/5
- **Estimated Dev Time:** 12 hours
- **Dependencies:** Auth, transactions table

---

### 3. AI‑Powered Transaction Categorization ✅ (AI #1)
- **User Value:**
  - Alex hates manual categorization.
  - Maria needs clarity without effort.
  - Yuki wants clean reports.
- **What it does:** Uses AI to auto‑assign categories (food, rent, utilities, fun) from transaction descriptions.
- **Technical Complexity:** 4/5
- **Estimated Dev Time:** 18 hours
- **Dependencies:** Transaction entry, AI API integration

---

### 4. Budget Creation (Monthly / Semester‑Based)
- **User Value:**
  - Maria spreads loan money across months.
  - Alex converts scholarship lump sum into monthly limits.
- **Technical Complexity:** 3/5
- **Estimated Dev Time:** 16 hours
- **Dependencies:** Transactions, categories

---

### 5. AI Budget Insights & Warnings ✅ (AI #2)
- **User Value:**
  - Alex: “You’re 20% over food budget due to delivery.”
  - Maria: early warning before semester money runs low.
- **What it does:** AI summarizes spending patterns and flags risks.
- **Technical Complexity:** 4/5
- **Estimated Dev Time:** 20 hours
- **Dependencies:** Budgets, categorized transactions

---

### 6. Roommate Groups (Household Creation)
- **User Value:**
  - Core for Alex & Maria to manage shared living.
- **Technical Complexity:** 3/5
- **Estimated Dev Time:** 14 hours
- **Dependencies:** Auth, user relationships

---

### 7. Expense Splitting (Equal & Custom Splits)
- **User Value:**
  - Alex splits groceries & utilities.
  - Maria stops subsidizing roommates.
  - Yuki splits group dinners.
- **Technical Complexity:** 4/5
- **Estimated Dev Time:** 22 hours
- **Dependencies:** Groups, transactions

---

### 8. Persistent Balances (Who Owes Whom)
- **User Value:**
  - Eliminates awkward money conversations.
  - Maria always knows outstanding debts.
- **Technical Complexity:** 4/5
- **Estimated Dev Time:** 20 hours
- **Dependencies:** Expense splitting logic

---

### 9. Payment Tracking (Marked as Paid / Settled)
- **User Value:**
  - Alex uses Venmo but wants records.
  - Yuki handles mixed payment methods.
- **Technical Complexity:** 3/5
- **Estimated Dev Time:** 12 hours
- **Dependencies:** Balances

---

### 10. Dashboard Overview (Single Source of Truth)
- **User Value:**
  - All personas want one place to see budget health + debts.
- **Includes:** Spending summary, budget status, roommate balances.
- **Technical Complexity:** 3/5
- **Estimated Dev Time:** 16 hours
- **Dependencies:** All core modules

---

### 11. Multi‑Currency Support (Basic)
- **User Value:**
  - Critical for Yuki (JPY → USD clarity).
- **What it does:** Store base currency + display converted totals.
- **Technical Complexity:** 3/5
- **Estimated Dev Time:** 14 hours
- **Dependencies:** Currency rates API

---

**Estimated MUST HAVE Total:** ~**270–300 hours** ✅

---

## SHOULD HAVE (v1.1 — Important but Deferrable)

### 1. Semester Smoothing (Lump‑Sum Distribution)
- **User Value:**
  - Alex & Maria auto‑allocate scholarships/loans across months.
- **Technical Complexity:** 4/5
- **Estimated Dev Time:** 18 hours
- **Dependencies:** Budgets

---

### 2. Smart Reminder System (AI‑Generated Nudges)
- **User Value:**
  - Maria gets reminders to collect dues.
- **Technical Complexity:** 4/5
- **Estimated Dev Time:** 16 hours
- **Dependencies:** Balances, notifications

---

### 3. Shareable Monthly Reports (PDF / Link)
- **User Value:**
  - Yuki shares reports with parents.
- **Technical Complexity:** 3/5
- **Estimated Dev Time:** 12 hours
- **Dependencies:** Dashboard data

---

### 4. Category Customization
- **User Value:**
  - Power users like Alex want control.
- **Technical Complexity:** 2/5
- **Estimated Dev Time:** 8 hours
- **Dependencies:** Categorization logic

---

## COULD HAVE (Nice to Have / Stretch)

### 1. Savings Goals with Visual Progress
- **User Value:**
  - Alex saves for summer.
  - Yuki saves for travel.
- **Technical Complexity:** 3/5
- **Estimated Dev Time:** 12 hours

---

### 2. Venmo / UPI Deep Links
- **User Value:**
  - Faster settlements for Alex & Maria.
- **Technical Complexity:** 3/5
- **Estimated Dev Time:** 10 hours

---

### 3. Dark Mode & UI Personalization
- **User Value:**
  - Nice UX polish, not core value.
- **Technical Complexity:** 1/5
- **Estimated Dev Time:** 6 hours

---

## WON’T HAVE (Explicitly Out of Scope for MVP)

### ❌ Bank Account Syncing
- **Why:** High compliance, reliability, and debugging cost. Manual entry is enough for MVP.

### ❌ Paid / Premium Tier
- **Why:** Free tier must be fully functional; monetization can wait.

### ❌ Investment Tracking / Crypto
- **Why:** Not relevant to student pain points; distracts from core value.

### ❌ Social Feed / Gamification
- **Why:** Adds complexity without solving budgeting or bill splitting.

### ❌ Credit Score Monitoring
- **Why:** Region‑specific, limited value for students globally.

---

## Why This MVP Wins (Recruiter Lens)
- Combines **budgeting + bill splitting** (rare among competitors)
- Uses **AI meaningfully**, not as a gimmick
- Demonstrates:
  - Data modeling
  - AI integration
  - Multi‑currency handling
  - Real‑world financial workflows

If you want, next I can:
- Turn MUST‑HAVE features into a **week‑by‑week build plan**
- Map features → **resume bullets & interview stories**
- Design **API schema + DB models** for the MVP

