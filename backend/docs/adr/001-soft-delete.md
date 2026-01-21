# ADR 001: Soft Delete Strategy

## Status
Accepted

## Context
In a financial application, data integrity is paramount. Users often delete transactions, budgets, or even accounts by mistake. Furthermore, for audit and compliance purposes (and potential future features like "Undo" or "Trash Bin"), permanently removing data from the database immediately upon a delete request is risky and often undesirable.

However, retaining all data indefinitely can lead to query performance degradation and privacy concerns (GDPR "Right to be Forgotten").

## Decision
We will implement a **Soft Delete** strategy for critical entities: `Transaction`, `Budget`, `Account`, and `Group`.

The implementation will follow these rules:

1.  **Schema Change**: Add a `deletedAt` DateTime column (nullable) to these tables.
    *   `deletedAt: null` -> Active record.
    *   `deletedAt: <timestamp>` -> Deleted record.

2.  **API Behavior**:
    *   `GET` requests will default to filtering out deleted items (`where: { deletedAt: null }`).
    *   `DELETE` requests will update the `deletedAt` timestamp to `NOW()` instead of removing the row.

3.  **Hard Delete**:
    *   Hard deletion will be reserved for specific administrative actions or GDPr compliance requests.
    *   A background cron job can be configured to permanently remove items deleted > 90 days ago (Data Retention Policy).

4.  **Prisma Implementation**:
    *   We will use Prisma Middleware (or Extensions in v5+) to intercept `delete` and `deleteMany` queries and transform them into `update` and `updateMany` setting `deletedAt`.
    *   Read queries will need explicit filtering or middleware injection to exclude deleted items by default.

## Consequences

### Positive
*   **Data Safety**: Accidental deletions are recoverable.
*   **Auditability**: We retain a history of what existed and when it was removed.
*   **Relations integrity**: "Deleting" a parent (like an Account) doesn't necessarily require cascading hard deletes of thousands of transactions immediately; they can just be hidden.

### Negative
*   **Query Complexity**: Every query needs to consider the `deletedAt` flag.
*   **Storage Index**: Database size grows faster as "deleted" data is kept.
*   **Unique Constraints**: Soft deletes complicate unique constraints (e.g., unique email). A user deletes account, tries to sign up again -> error because email exists (but is hidden). *Mitigation: Soft delete usually not applied to `User` email without handling this, or we allow reactivation.*

## Implementation Plan
1.  Add `deletedAt` to schema.
2.  Update services to respect `deletedAt`.
3.  Implement Prisma extension for transparent soft deletes.
