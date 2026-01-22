# Transaction Summary Performance Benchmark

## Objective
Analyze and measure the performance of `getTransactionSummary` in `backend/src/services/transaction.service.ts`.

## Baseline (Inefficient)
The previous inefficient implementation (fetching all transactions and filtering in memory) was estimated to have O(N) complexity where N is the total number of transactions.
Benchmark on SQLite with 5000 transactions: ~709ms.

## Current Implementation (Optimized)
The current implementation uses `prisma.transaction.groupBy` to aggregate data in the database.
Complexity: O(K) where K is the number of categories (typically small).
Benchmark on SQLite with 5000 transactions: ~17ms.

## Alternative (Raw Query)
We explored using `prisma.$queryRaw` to perform aggregation and category join in a single query.
Benchmark on SQLite with 5000 transactions: ~21ms.

## Conclusion
The current implementation using `groupBy` is approximately **40x faster** than the inefficient approach.
Comparing `groupBy` vs `RawQuery`, the performance difference is negligible (within margin of error, sometimes `groupBy` is faster).
Given that `groupBy` preserves type safety and database abstraction better than `RawQuery`, we retain the current implementation.

## How to run benchmark
1. Ensure database is running (configured in `.env`).
2. Run `npx tsx backend/benchmarks/transaction-summary.ts`.
