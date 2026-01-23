---
trigger: always_on
---

## 📋 TESTING CATEGORIES (MANDATORY EXECUTION)

The agent MUST execute **all categories below**.  
Skipping any test, soft-testing, or assuming safety is a **rule violation**.

---

## 🔒 SECURITY TESTING (ZERO TRUST)

### Authentication Attacks
The agent MUST attempt:
- Login without credentials
- Login with valid username + invalid password
- Token reuse after logout
- Expired token reuse
- Token manipulation (payload, signature, expiry)
- Role escalation (user → admin)
- Session fixation and parallel session abuse

If authentication can be bypassed → **IMMEDIATE BLOCKER**

---

### Injection Attacks
The agent MUST attempt:
- SQL injection in all inputs (body, params, headers)
- NoSQL injection where applicable
- Command injection (if backend touches system calls)
- JSON structure manipulation
- ORM bypass attempts

If unvalidated input reaches DB or logic → **CRITICAL FAILURE**

---

### XSS & CSRF
The agent MUST:
- Inject scripts into all user-controlled fields
- Test stored and reflected XSS
- Attempt CSRF without tokens
- Attempt CSRF with reused or invalid tokens
- Verify SameSite, HttpOnly, Secure flags

Any executable client-side injection → **BLOCKER**

---

## 💾 DATA INTEGRITY (NO DATA LOSS ALLOWED)

### Concurrent Updates
The agent MUST:
- Perform simultaneous updates on the same record
- Check for lost updates
- Verify optimistic/pessimistic locking

Data overwrite without warning → **CRITICAL**

---

### Race Conditions
The agent MUST:
- Trigger parallel requests on write operations
- Attempt double-submit on critical actions
- Check transaction atomicity

Non-atomic behavior → **BLOCKER**

---

### Data Corruption
The agent MUST:
- Insert malformed data
- Interrupt transactions mid-way
- Force partial writes
- Validate rollback behavior

Persistent corrupted data → **BLOCKER**

---

## ⚡ PERFORMANCE TESTING (FAIL UNDER LOAD = FAIL RELEASE)

### Load Testing
The agent MUST:
- Simulate sustained normal traffic
- Measure response degradation
- Detect memory leaks

Performance degradation without recovery → **MAJOR**

---

### Stress Testing
The agent MUST:
- Push beyond expected limits
- Identify breaking points
- Observe system recovery behavior

Crash without graceful recovery → **CRITICAL**

---

### Spike Testing
The agent MUST:
- Simulate sudden traffic spikes
- Verify throttling and rate limiting
- Detect cascading failures

Uncontrolled spike failure → **CRITICAL**

---

## 🌐 API TESTING (NO TRUST IN CLIENT)

### API Abuse
The agent MUST:
- Call APIs out of intended order
- Replay requests
- Abuse rate limits
- Access unauthorized endpoints

Unauthorized access → **BLOCKER**

---

### Invalid Input
The agent MUST:
- Send nulls, empty strings, wrong types
- Send unexpected JSON structures
- Omit required fields

Unhandled input → **MAJOR**

---

### Boundary Testing
The agent MUST:
- Test min/max values
- Test extremely large payloads
- Test numeric overflows
- Test string length limits

Boundary violation without validation → **CRITICAL**

---

## 🚫 GENERAL ENFORCEMENT RULE

If **any single test above**:
- Causes a crash
- Compromises security
- Corrupts data
- Produces undefined behavior

→ **RELEASE STATUS MUST BE SET TO: FAILED**

No exceptions.
