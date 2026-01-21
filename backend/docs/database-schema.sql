-- Student Finance Dashboard - PostgreSQL Database Schema
-- Designed for: Budgeting + Bill Splitting + AI Features
-- Target: College students (Alex, Maria, Yuki personas)

-- =============================================================================
-- CORE ENTITIES
-- =============================================================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    university VARCHAR(150),
    base_currency VARCHAR(3) DEFAULT 'USD', -- ISO 4217 code
    email_verified BOOLEAN DEFAULT FALSE,
    failed_login_attempts INTEGER DEFAULT 0, -- Rate limiting
    locked_until TIMESTAMP WITH TIME ZONE, -- Account lockout
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- User accounts (checking, savings, cash, credit card)
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- "Chase Checking", "Cash", etc.
    account_type VARCHAR(50) NOT NULL, -- 'checking', 'savings', 'cash', 'credit_card'
    balance DECIMAL(12, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    institution VARCHAR(100),
    account_number VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_user_active ON accounts(user_id, is_active);

-- =============================================================================
-- TRANSACTION MANAGEMENT
-- =============================================================================

-- Categories for transactions
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    icon VARCHAR(50), -- Icon name for UI (e.g., 'coffee', 'home', 'transport')
    color VARCHAR(7), -- Hex color code
    is_system BOOLEAN DEFAULT FALSE, -- System vs user-created
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for system categories
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_user_type ON categories(user_id, type);
CREATE INDEX idx_categories_system ON categories(is_system);

-- Pre-populate system categories
INSERT INTO categories (name, type, icon, color, is_system) VALUES
    ('Food & Dining', 'expense', 'utensils', '#EF4444', TRUE),
    ('Groceries', 'expense', 'shopping-cart', '#10B981', TRUE),
    ('Transportation', 'expense', 'car', '#3B82F6', TRUE),
    ('Entertainment', 'expense', 'film', '#8B5CF6', TRUE),
    ('Shopping', 'expense', 'shopping-bag', '#F59E0B', TRUE),
    ('Rent', 'expense', 'home', '#6366F1', TRUE),
    ('Utilities', 'expense', 'zap', '#14B8A6', TRUE),
    ('Healthcare', 'expense', 'heart', '#EC4899', TRUE),
    ('Education', 'expense', 'book', '#06B6D4', TRUE),
    ('Salary', 'income', 'dollar-sign', '#10B981', TRUE),
    ('Scholarship', 'income', 'award', '#F59E0B', TRUE),
    ('Freelance', 'income', 'briefcase', '#3B82F6', TRUE),
    ('Other Income', 'income', 'plus-circle', '#6B7280', TRUE),
    ('Other Expense', 'expense', 'minus-circle', '#6B7280', TRUE);

-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    tags TEXT[] DEFAULT '{}', -- Array of tags
    converted_amount DECIMAL(12, 2), -- Amount in user's base currency
    exchange_rate DECIMAL(10, 6), -- Exchange rate used for conversion
    merchant VARCHAR(255), -- "Starbucks", "Amazon", etc.
    description TEXT,
    transaction_date DATE NOT NULL,
    is_split BOOLEAN DEFAULT FALSE, -- Part of a bill split?
    split_id UUID, -- References bill_splits.id (added later)
    ai_categorized BOOLEAN DEFAULT FALSE, -- Was category AI-suggested?
    ai_confidence DECIMAL(3, 2), -- Confidence score (0.00 to 1.00)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_user_category ON transactions(user_id, category_id);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_deleted ON transactions(deleted_at);
CREATE INDEX idx_transactions_merchant ON transactions(merchant); -- For AI pattern matching

-- =============================================================================
-- BUDGET MANAGEMENT
-- =============================================================================

-- Budgets (monthly limits per category)
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    period_type VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'semester' (for Maria)
    start_date DATE NOT NULL,
    end_date DATE, -- NULL for ongoing budgets
    alert_threshold DECIMAL(3, 2) DEFAULT 0.80, -- Alert at 80% spent
    rollover BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category_id, start_date) -- One budget per category per period
);

CREATE INDEX idx_budgets_user_active ON budgets(user_id, start_date, end_date);
CREATE INDEX idx_budgets_category ON budgets(category_id);

-- =============================================================================
-- BILL SPLITTING & ROOMMATES
-- =============================================================================

-- Roommate groups (households)
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- "Apartment 4B", "Beach House"
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Group members (many-to-many)
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_members_user ON group_members(user_id);
CREATE INDEX idx_group_members_group_active ON group_members(group_id, is_active);

-- Bill splits (shared expenses)
CREATE TABLE bill_splits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    total_amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    description VARCHAR(255) NOT NULL,
    split_type VARCHAR(20) NOT NULL, -- 'equal', 'custom', 'percentage'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'partial', 'settled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    settled_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_bill_splits_group ON bill_splits(group_id);
CREATE INDEX idx_bill_splits_creator ON bill_splits(created_by);
CREATE INDEX idx_bill_splits_status ON bill_splits(status);

-- Individual shares in a split
CREATE TABLE split_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    split_id UUID NOT NULL REFERENCES bill_splits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_owed DECIMAL(12, 2) NOT NULL,
    amount_paid DECIMAL(12, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'forgiven'
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_note TEXT, -- Optional Venmo confirmation, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(split_id, user_id)
);

CREATE INDEX idx_split_participants_user ON split_participants(user_id, status);
CREATE INDEX idx_split_participants_split ON split_participants(split_id);

-- Payment reminders (for Maria's pain point)
CREATE TABLE payment_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    split_participant_id UUID NOT NULL REFERENCES split_participants(id) ON DELETE CASCADE,
    sent_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    reminder_type VARCHAR(20) DEFAULT 'polite', -- 'polite', 'urgent'
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- AI FEATURES
-- =============================================================================

-- AI-generated insights
CREATE TABLE insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL, -- 'warning', 'positive', 'tip', 'prediction'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    supporting_data JSONB, -- Store related transaction IDs, amounts, etc.
    action_type VARCHAR(50), -- 'adjust_budget', 'view_category', 'set_goal'
    action_data JSONB, -- Data needed to perform action
    is_dismissed BOOLEAN DEFAULT FALSE,
    feedback VARCHAR(20), -- 'helpful', 'not_helpful'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    dismissed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_insights_user_active ON insights(user_id, is_dismissed, created_at DESC);
CREATE INDEX idx_insights_type ON insights(insight_type);

-- AI categorization cache (to reduce API calls)
CREATE TABLE ai_category_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_normalized VARCHAR(255) UNIQUE NOT NULL, -- Lowercase, trimmed
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    confidence DECIMAL(3, 2),
    usage_count INTEGER DEFAULT 1,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_cache_merchant ON ai_category_cache(merchant_normalized);
CREATE INDEX idx_ai_cache_usage ON ai_category_cache(usage_count DESC);

-- =============================================================================
-- NOTIFICATIONS & ALERTS
-- =============================================================================

-- Notification preferences
CREATE TABLE notification_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    budget_alerts BOOLEAN DEFAULT TRUE,
    split_reminders BOOLEAN DEFAULT TRUE,
    payment_received BOOLEAN DEFAULT TRUE,
    ai_insights BOOLEAN DEFAULT TRUE,
    insight_frequency VARCHAR(20) DEFAULT 'daily', -- 'realtime', 'daily', 'weekly'
    email_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notification queue
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- 'budget_alert', 'split_request', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500), -- Deep link to relevant page
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- =============================================================================
-- REPORTING & EXPORTS (for Yuki)
-- =============================================================================

-- Monthly reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_type VARCHAR(50) DEFAULT 'monthly', -- 'monthly', 'semester'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_income DECIMAL(12, 2),
    total_expenses DECIMAL(12, 2),
    net_change DECIMAL(12, 2),
    category_breakdown JSONB, -- {category_id: amount}
    currency VARCHAR(3) DEFAULT 'USD',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_user_period ON reports(user_id, period_start, period_end);

-- =============================================================================
-- AUDIT & SECURITY
-- =============================================================================

-- Audit log (track sensitive actions)
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'login', 'delete_transaction', etc.
    entity_type VARCHAR(50), -- 'transaction', 'budget', 'split'
    entity_id UUID,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user_time ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_action ON audit_log(action);

-- =============================================================================
-- VIEWS (For complex queries)
-- =============================================================================

-- User balance summary (across all accounts)
CREATE VIEW user_balance_summary AS
SELECT 
    user_id,
    SUM(balance) AS total_balance,
    COUNT(*) AS account_count,
    MAX(updated_at) AS last_updated
FROM accounts
WHERE is_active = TRUE
GROUP BY user_id;

-- Monthly spending by category
CREATE VIEW monthly_spending AS
SELECT 
    user_id,
    category_id,
    DATE_TRUNC('month', transaction_date) AS month,
    SUM(ABS(amount)) AS total_spent,
    COUNT(*) AS transaction_count
FROM transactions
WHERE deleted_at IS NULL
GROUP BY user_id, category_id, DATE_TRUNC('month', transaction_date);

-- Roommate balances (who owes whom)
CREATE VIEW roommate_balances AS
SELECT 
    sp.user_id,
    bs.created_by AS owed_by,
    SUM(sp.amount_owed - sp.amount_paid) AS balance
FROM split_participants sp
JOIN bill_splits bs ON sp.split_id = bs.id
WHERE sp.status = 'pending' AND bs.status != 'settled'
GROUP BY sp.user_id, bs.created_by;

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    
CREATE TRIGGER update_bill_splits_updated_at BEFORE UPDATE ON bill_splits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update account balance when transaction is added/updated
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE accounts
        SET balance = balance + NEW.amount
        WHERE id = NEW.account_id;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE accounts
        SET balance = balance - OLD.amount + NEW.amount
        WHERE id = NEW.account_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE accounts
        SET balance = balance - OLD.amount
        WHERE id = OLD.account_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transaction_update_balance
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_account_balance();

-- =============================================================================
-- SAMPLE DATA (for development/testing)
-- =============================================================================

-- Sample user (Alex Chen)
INSERT INTO users (email, password_hash, name, university, base_currency) VALUES
    ('alex@example.com', '$2b$10$...', 'Alex Chen', 'State University', 'USD');

-- Sample categories are already inserted above

-- =============================================================================
-- SCHEMA SUMMARY
-- =============================================================================

/*
Total Tables: 19
- Core: users, accounts, categories, transactions
- Budgets: budgets
- Social: groups, group_members, bill_splits, split_participants, payment_reminders
- AI: insights, ai_category_cache
- System: notification_settings, notifications, reports, audit_log

Total Views: 3
- user_balance_summary
- monthly_spending
- roommate_balances

Key Relationships:
- User → Accounts (1:many)
- User → Transactions (1:many)
- User → Budgets (1:many)
- User → Groups (many:many via group_members)
- BillSplit → Participants (1:many)
- Transaction → Category (many:1)

Performance Optimizations:
- Indexes on foreign keys
- Composite indexes on common queries
- Views for complex aggregations
- Triggers for auto-updating timestamps and balances

Security Features:
- Soft deletes (deleted_at)
- Audit logging
- Password hashing (done at app level)
- Cascade deletes configured appropriately
*/
