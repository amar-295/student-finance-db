# Entity Relationship Diagram - Student Finance Dashboard

```mermaid
erDiagram
    %% Core Entities
    User ||--o{ Account : "has"
    User ||--o{ Transaction : "creates"
    User ||--o{ Budget : "sets"
    User ||--o{ Insight : "receives"
    User ||--o{ Notification : "gets"
    User ||--o{ Report : "generates"
    User ||--o{ GroupMember : "joins"
    User ||--o{ BillSplit : "creates"
    User ||--o{ SplitParticipant : "participates"
    User ||--|| NotificationSettings : "configures"
    
    %% Transaction Relations
    Account ||--o{ Transaction : "contains"
    Category ||--o{ Transaction : "categorizes"
    Category ||--o{ Budget : "limits"
    
    %% Group/Split Relations
    Group ||--o{ GroupMember : "includes"
    Group ||--o{ BillSplit : "tracks"
    BillSplit ||--o{ SplitParticipant : "divides"
    SplitParticipant ||--o{ PaymentReminder : "reminds"
    
    %% Entities with Attributes
    User {
        uuid id PK
        string email UK
        string passwordHash
        string name
        string university
        string baseCurrency
        boolean emailVerified
        timestamp createdAt
        timestamp updatedAt
    }
    
    Account {
        uuid id PK
        uuid userId FK
        string name
        string accountType
        decimal balance
        string currency
        boolean isActive
    }
    
    Transaction {
        uuid id PK
        uuid userId FK
        uuid accountId FK
        uuid categoryId FK
        decimal amount
        string currency
        decimal convertedAmount
        string merchant
        date transactionDate
        boolean aiCategorized
        decimal aiConfidence
    }
    
    Category {
        uuid id PK
        string name
        string type
        string icon
        string color
        boolean isSystem
        uuid userId FK
    }
    
    Budget {
        uuid id PK
        uuid userId FK
        uuid categoryId FK
        decimal amount
        string periodType
        date startDate
        date endDate
        decimal alertThreshold
    }
    
    Group {
        uuid id PK
        string name
        uuid createdBy FK
    }
    
    GroupMember {
        uuid id PK
        uuid groupId FK
        uuid userId FK
        boolean isActive
    }
    
    BillSplit {
        uuid id PK
        uuid groupId FK
        uuid createdBy FK
        decimal totalAmount
        string description
        string splitType
        string status
    }
    
    SplitParticipant {
        uuid id PK
        uuid splitId FK
        uuid userId FK
        decimal amountOwed
        decimal amountPaid
        string status
        timestamp paidAt
    }
    
    PaymentReminder {
        uuid id PK
        uuid splitParticipantId FK
        uuid sentBy FK
        string reminderType
        timestamp sentAt
    }
    
    Insight {
        uuid id PK
        uuid userId FK
        string insightType
        string title
        text message
        json supportingData
        string actionType
        boolean isDismissed
    }
    
    Notification {
        uuid id PK
        uuid userId FK
        string notificationType
        string title
        text message
        boolean isRead
    }
    
    NotificationSettings {
        uuid userId PK_FK
        boolean budgetAlerts
        boolean splitReminders
        boolean paymentReceived
        boolean aiInsights
        string insightFrequency
    }
    
    Report {
        uuid id PK
        uuid userId FK
        string reportType
        date periodStart
        date periodEnd
        decimal totalIncome
        decimal totalExpenses
        json categoryBreakdown
    }
    
    AiCategoryCache {
        uuid id PK
        string merchantNormalized UK
        uuid categoryId
        decimal confidence
        int usageCount
    }
```

## Key Relationships Explained

### 1. User-Centric Design
- **User** is the central entity
- All major features connect to User (transactions, budgets, groups, insights)
- Enables proper data isolation and security

### 2. Financial Tracking Flow
```
User → Account → Transaction → Category
                     ↓
                  Budget (spending limit per category)
```

### 3. Bill Splitting Flow
```
User creates Group → Invites members (GroupMember)
                   → Creates BillSplit
                   → System creates SplitParticipant for each member
                   → PaymentReminder sent if overdue
```

### 4. AI Integration Points
```
Transaction.merchant → AiCategoryCache (check pattern)
                    → OpenAI API (if not cached)
                    → Transaction.category (auto-set)

User transactions → AI analysis → Insight (generated tip/warning)
```

## Database Performance Considerations

### Indexes Created:
1. **Fast lookups**: `users.email`, `transactions.merchant`
2. **Date filtering**: `transactions.transaction_date`, `budgets.start_date`
3. **Composite indexes**: `(user_id, transaction_date)` for common queries
4. **Status filtering**: `bill_splits.status`, `split_participants.status`

### Optimizations:
- **Soft deletes** on critical tables (transactions, users)
- **Triggers** for auto-updating balances and timestamps
- **Views** for complex aggregations (monthly_spending, roommate_balances)
- **JSONB** for flexible data (insight supporting data, report breakdowns)

## Data Integrity Rules

### Cascade Deletes:
- Delete User → Deletes all their transactions, budgets, accounts
- Delete Group → Deletes all group members
- Delete BillSplit → Deletes all split participants

### Restrict Deletes:
- Cannot delete Account if transactions exist
- Cannot delete Category if budgets/transactions use it
- Cannot delete Group creator while group exists

### Set Null:
- Delete Category → Transactions keep amount but lose category
- Delete Group → BillSplits remain but lose group reference

## Security Considerations

1. **Password hashing**: Done at application level (bcrypt)
2. **Audit logging**: All sensitive actions tracked
3. **Soft deletes**: Data recoverable, never truly lost
4. **Row-level security**: Could be added for multi-tenancy

## Scalability Notes

### For 10K+ users:
- Add **Redis caching** for:
  - AI category lookups
  - User balance calculations
  - Recent transactions

- Add **database read replicas** for:
  - Dashboard queries
  - Report generation
  - Insight calculations

- Add **partitioning** on:
  - `transactions` table by date
  - `audit_log` table by date

### For real-time features:
- Use **WebSockets** for:
  - Live split payment updates
  - Budget alert notifications
  - Real-time balance changes

## Total Entity Count
- **Tables**: 17
- **Views**: 3 (in SQL version)
- **Triggers**: 5 (in SQL version)
- **Indexes**: 30+
