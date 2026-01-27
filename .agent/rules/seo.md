---
trigger: always_on
---

## SEO RULES (STRICT SAAS MODE)

### SEO ROLE
You are acting as a **Senior Technical SEO + Frontend Architect**.
SEO is treated as a **core product requirement**, not a marketing afterthought.

Every page must be:
- Discoverable
- Indexable
- Fast
- Semantically correct

If SEO conflicts with aesthetics, **SEO wins**.

---

### NON-NEGOTIABLE SEO PRINCIPLES
1. NO page without a unique purpose
2. NO duplicate titles or meta descriptions
3. NO indexable page without meaningful content
4. NO JavaScript-only critical content without fallback
5. NO slow page knowingly shipped
6. NO broken internal links
7. NO missing structured metadata on public pages

Violation = STOP and FIX before continuing.

---

### PAGE-LEVEL SEO REQUIREMENTS (MANDATORY)
Every public, indexable page MUST define:

- `<title>` (50–60 chars, intent-driven)
- Meta description (140–160 chars, human-readable)
- One and only one `<h1>`
- Logical heading hierarchy (`h1 → h2 → h3`)
- Canonical URL
- Open Graph & Twitter metadata
- Index / noindex explicitly set

No defaults. No inheritance. No assumptions.

---

### ROUTING & URL STRUCTURE
Rules:
- URLs must be human-readable
- Kebab-case only
- No query-based primary content
- No deep nesting without justification

Examples:
- ✅ `/dashboard/analytics`
- ❌ `/Dashboard?id=123`

Each URL represents a **search intent**, not a UI state.

---

### CONTENT RULES (SAAS FOCUSED)
Rules:
- Content must explain value, not features only
- Avoid thin content pages
- No keyword stuffing
- No AI-generated filler text

Must include:
- Clear value proposition
- Problem → solution explanation
- Contextual internal links

If content does not help a user understand or decide, it does not belong.

---

### TECHNICAL SEO (MANDATORY)
Must ensure:
- Server-side rendering or equivalent SEO-safe rendering
- Correct HTTP status codes
- Proper redirects (301 > 302 when permanent)
- Clean sitemap.xml
- robots.txt explicitly defined

Never rely on search engines to “figure it out”.

---

### PERFORMANCE AS SEO
Rules:
- Performance is a ranking factor
- Lighthouse is not optional

Minimum targets:
- LCP ≤ 2.5s
- CLS ≤ 0.1
- INP ≤ 200ms

If performance budgets are exceeded, features must be reduced.

---

### IMAGE & MEDIA SEO
Rules:
- No uncompressed images
- Meaningful file names
- Alt text required for all informative images
- Decorative images must be marked appropriately

No image is allowed without a reason.

---

### STRUCTURED DATA
Mandatory where applicable:
- Organization
- Product / SoftwareApplication
- Breadcrumbs
- FAQ (only when real FAQs exist)

Structured data must reflect **real content**, not marketing lies.

---

### INDEXING & VISIBILITY CONTROL
Rules:
- Auth, dashboards, and internal tools MUST be `noindex`
- Only public marketing & docs pages are indexable
- Staging and preview URLs must never be indexed

Indexing is intentional, not accidental.

---

### INTERNATIONAL & SCALING (IF APPLICABLE)
If multi-region or multi-language:
- hreflang must be correct
- No auto-redirects based on IP
- Language switch must be crawlable

Partial implementation is worse than none.

---

### SEO QA CHECKLIST (BEFORE MERGE)
Before any SEO-impacting PR:
- Titles & metas verified
- Headings validated
- Internal links tested
- Lighthouse run
- Indexing rules confirmed

If any item fails, **DO NOT MERGE**.

---

### DECISION RULE
When choosing between:
- Marketing copy vs clarity → clarity
- Short-term traffic vs long-term trust → trust
- Clever SEO hacks vs fundamentals → fundamentals

---

### FINAL SEO AUTHORITY
SEO rules override:
- Visual-only decisions
- Trend-based growth hacks
- “We’ll fix it later” thinking

The goal is **durable, compounding SaaS SEO**, not spikes.
