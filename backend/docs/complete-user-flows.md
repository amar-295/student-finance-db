# Complete User Flows - Student Finance Dashboard

## Flow B: Budget Alert Scenario (Alex)

**Scenario:** Alex has a $200 food budget, has spent $180, and adds a $25 DoorDash order that triggers an alert.

```mermaid
graph TD
    A[Alex opens app] --> B[Dashboard]
    B --> C[Click Add Transaction]
    C --> D[Enter amount: $25]
    D --> E[Enter merchant: DoorDash]
    E --> F[AI categorizes as Food & Dining]
    F --> G{System checks budget}
    G --> H[Food budget: $180/$200]
    H --> I[New total: $205 > $200]
    I --> J[Trigger budget alert]
    J --> K[Show warning modal]
    K --> L{Alex's choice}
    L -->|Adjust budget| M[Increase food budget to $230]
    L -->|Acknowledge| N[Save transaction anyway]
    L -->|Cancel| O[Don't save transaction]
    M --> P[Transaction saved]
    N --> P
    P --> Q[Dashboard shows over-budget status]
    Q --> R[Budget bar turns red]
    R --> S[AI generates insight: You're over budget]
```

**Key UI Elements:**
- Alert modal with clear messaging: "This transaction will put you $5 over your Food budget"
- Options: "Adjust Budget" | "Add Anyway" | "Cancel"
- Budget bar visual update (green → yellow → red)
- Contextual AI insight generated

---

## Flow C: Viewing AI Insights (All Users)

**Scenario:** User navigates to dashboard to view and interact with AI-generated financial insights.

```mermaid
graph TD
    A[User opens Dashboard] --> B[Insights card visible]
    B --> C[Shows 3 AI insights]
    C --> D{User clicks insight}
    
    D --> E[Insight Detail View]
    E --> F[See full explanation]
    F --> G[View supporting data]
    G --> H[See related transactions]
    
    H --> I{User action}
    I -->|Dismiss| J[Mark as read/hidden]
    I -->|Take action| K{Action type}
    I -->|Give feedback| L[Rate helpful/not helpful]
    
    K -->|Adjust budget| M[Open budget editor]
    K -->|View category| N[Filter transactions by category]
    K -->|Set goal| O[Create savings goal]
    
    J --> P[Insight removed from feed]
    L --> Q[Feedback stored for AI improvement]
    M --> R[Complete action]
    N --> R
    O --> R
    
    R --> S[Return to dashboard]
    S --> T{More insights available?}
    T -->|Yes| C
    T -->|No| U[Click Generate New Insights]
    U --> V[AI analyzes recent data]
    V --> W[New insights appear]
```

**AI Insight Types (from personas):**

1. **Warning Insights** (Red)
   - "You're spending 40% more on food delivery this week"
   - "You'll run out of money by week 3 at this rate"
   - "Transportation spending doubled this month"

2. **Positive Insights** (Green)
   - "Great job! You're $55 under budget for entertainment"
   - "You saved $120 more than last month"
   - "Your grocery spending decreased by 15%"

3. **Tip Insights** (Blue)
   - "Your coffee habit costs $120/month. Campus coffee saves $70"
   - "Cooking 2x/week could save $80/month vs delivery"
   - "You could save $30/mo by switching to student subscriptions"

---

## Flow D: Roommate Payment Collection (Maria's Pain Point)

**Scenario:** Maria needs to follow up on unpaid bills from roommates.

```mermaid
graph TD
    A[Maria opens Roommates tab] --> B[See pending splits]
    B --> C{Filter by status}
    C --> D[Pending splits: 2 items]
    
    D --> E[Electric Bill: $30 from Sarah - Pending]
    D --> F[Internet: $25 from Mike - Paid]
    
    E --> G{Days since request}
    G -->|0-3 days| H[Status: Pending]
    G -->|4-7 days| I[Status: Overdue soon]
    G -->|8+ days| J[Status: Overdue]
    
    J --> K[Auto-reminder sent]
    K --> L[Maria can manually remind]
    L --> M[Click Remind button]
    M --> N[Select reminder type]
    N --> O{Reminder method}
    
    O -->|Polite| P[Send: Hey Sarah, gentle reminder about electric]
    O -->|Urgent| Q[Send: Electric bill overdue, please pay]
    
    P --> R[In-app notification to Sarah]
    Q --> R
    R --> S[Sarah receives notification]
    S --> T[Sarah opens app]
    T --> U[Sees pending payment]
    U --> V[Clicks Mark as Paid]
    V --> W[Optionally: Add Venmo link/note]
    W --> X[Payment marked complete]
    X --> Y[Maria receives notification]
    Y --> Z[Balance updated on Maria's side]
```

**Smart Features:**
- Auto-reminders after 7 days
- Escalating message tone (polite → firm)
- Venmo/Zelle deep links (pre-filled amount)
- Payment deadline tracking

---

## Flow E: First-Time Budget Setup (Semester Smoothing for Maria)

**Scenario:** Maria gets $6,000 loan disbursement and wants to spread it across 4 months.

```mermaid
graph TD
    A[Maria logs in after loan arrives] --> B[Dashboard shows high balance]
    B --> C[AI prompt: Set up semester budget?]
    C --> D[Maria clicks Yes]
    D --> E[Budget Setup Wizard]
    
    E --> F[Step 1: Confirm income]
    F --> G[Loan: $6,000 for 4 months]
    G --> H[Step 2: Add recurring expenses]
    H --> I[Rent: $500/mo, Therapy: $40/mo]
    I --> J[Step 3: Set category budgets]
    J --> K[Food: $200, Entertainment: $100, etc]
    
    K --> L[System calculates]
    L --> M[Total monthly: $1,200]
    M --> N[Available per month: $1,500]
    N --> O[Suggested savings: $300/mo]
    
    O --> P{Maria confirms?}
    P -->|Yes| Q[Create budgets for all categories]
    P -->|Adjust| R[Edit budget amounts]
    R --> Q
    
    Q --> S[Set up alerts]
    S --> T[Alert at 80% of budget]
    T --> U[Budgets created]
    U --> V[Dashboard shows 4-month runway]
    V --> W[AI tracks progress weekly]
```

---

## Flow F: Multi-Currency Transaction (Yuki)

**Scenario:** Yuki receives ¥200,000 from parents and wants to track it properly.

```mermaid
graph TD
    A[Yuki opens app] --> B[Set base currency: USD]
    B --> C[Add Transaction: Income]
    C --> D[Enter amount: 200000]
    D --> E[Select currency: JPY]
    E --> F[System fetches exchange rate]
    F --> G[Shows converted: ~$1,350 USD]
    G --> H[Option to lock rate or use live]
    
    H --> I{Yuki's choice}
    I -->|Lock rate| J[Save as: ¥200,000 = $1,350]
    I -->|Live rate| K[Update conversion daily]
    
    J --> L[Transaction saved]
    K --> L
    L --> M[Dashboard shows both amounts]
    M --> N[¥200,000 ($1,350 USD)]
    
    N --> O[Monthly report generated]
    O --> P[Export in JPY for parents]
    P --> Q[Export in USD for Yuki's tracking]
```

**Multi-Currency Features:**
- Display both original and converted amounts
- Lock exchange rate at transaction time
- Monthly reports in both currencies
- Total balance in base currency + breakdown by currency

---

## Summary of All Core Flows

| Flow | Persona | Purpose | Complexity |
|------|---------|---------|-----------|
| A - Bill Splitting | Maria | Split shared expenses | Medium |
| B - Budget Alert | Alex | Prevent overspending | Medium |
| C - AI Insights | All | Financial awareness | High (AI) |
| D - Payment Collection | Maria | Collect debts | Medium |
| E - Semester Budget | Maria | Plan loan spending | High |
| F - Multi-Currency | Yuki | Track foreign income | Medium |

---

## Navigation Flow (Quick Reference)

```
Landing → Sign Up → Onboarding → Dashboard
                                    ↓
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
              Transactions      Budgets       Roommates
                    ↓               ↓               ↓
              [Add/Edit]     [Create/Edit]   [Split/Track]
                    ↓               ↓               ↓
                    └───────────────┼───────────────┘
                                    ↓
                              AI Insights
                                    ↓
                              [View/Act]
```

---

## Mobile Considerations

**Key mobile-specific flows:**
1. **Pull-to-refresh** on all list views
2. **Swipe actions** on transactions (edit/delete)
3. **Bottom sheet modals** for add transaction (easier thumb reach)
4. **Quick add** from home screen widget
5. **Notifications** for:
   - Budget alerts
   - Payment received
   - Payment requests
   - New AI insights

---

## State Management Notes

**Global state needed:**
- User auth status
- Current account balance
- Active filters (transactions, budgets)
- Pending notifications count
- Currency settings

**Component-level state:**
- Form inputs (add transaction, split bill)
- Modal open/closed
- List pagination
- Collapsed/expanded sections

---

*These flows are ready for wireframing and implementation. Each flow maps to specific API endpoints and database operations.*
