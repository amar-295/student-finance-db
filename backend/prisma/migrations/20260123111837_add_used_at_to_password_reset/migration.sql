/*
  Warnings:

  - You are about to drop the column `is_active` on the `accounts` table. All the data in the column will be lost.
  - You are about to alter the column `balance` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to drop the column `category_id` on the `ai_category_cache` table. All the data in the column will be lost.
  - You are about to drop the column `last_used_at` on the `ai_category_cache` table. All the data in the column will be lost.
  - You are about to drop the column `merchant_normalized` on the `ai_category_cache` table. All the data in the column will be lost.
  - You are about to drop the column `usage_count` on the `ai_category_cache` table. All the data in the column will be lost.
  - You are about to alter the column `confidence` on the `ai_category_cache` table. The data in that column could be lost. The data in that column will be cast from `Decimal(3,2)` to `DoublePrecision`.
  - You are about to alter the column `total_amount` on the `bill_splits` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to drop the column `period_type` on the `budgets` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `budgets` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to alter the column `alert_threshold` on the `budgets` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Integer`.
  - You are about to drop the column `dismissed_at` on the `insights` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `insights` table. All the data in the column will be lost.
  - You are about to drop the column `is_dismissed` on the `insights` table. All the data in the column will be lost.
  - You are about to drop the column `supporting_data` on the `insights` table. All the data in the column will be lost.
  - The primary key for the `notification_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ai_insights` on the `notification_settings` table. All the data in the column will be lost.
  - You are about to drop the column `insight_frequency` on the `notification_settings` table. All the data in the column will be lost.
  - You are about to drop the column `payment_received` on the `notification_settings` table. All the data in the column will be lost.
  - You are about to drop the column `split_reminders` on the `notification_settings` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `is_read` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `notification_type` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `category_breakdown` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `net_change` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `total_expenses` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `total_income` on the `reports` table. All the data in the column will be lost.
  - You are about to alter the column `amount_owed` on the `split_participants` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to alter the column `amount_paid` on the `split_participants` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to drop the column `converted_amount` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `exchange_rate` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `is_split` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `split_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to alter the column `ai_confidence` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(3,2)` to `DoublePrecision`.
  - A unique constraint covering the columns `[merchant]` on the table `ai_category_cache` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,category_id,period]` on the table `budgets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `notification_settings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `ai_category_cache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchant` to the `ai_category_cache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `ai_category_cache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ai_category_cache` table without a default value. This is not possible if the table is not empty.
  - Made the column `confidence` on table `ai_category_cache` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `period` to the `budgets` table without a default value. This is not possible if the table is not empty.
  - Made the column `end_date` on table `budgets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `color` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - The required column `id` was added to the `notification_settings` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `type` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Made the column `merchant` on table `transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ai_confidence` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "bill_splits" DROP CONSTRAINT "bill_splits_created_by_fkey";

-- DropForeignKey
ALTER TABLE "bill_splits" DROP CONSTRAINT "bill_splits_group_id_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_created_by_fkey";

-- DropForeignKey
ALTER TABLE "payment_reminders" DROP CONSTRAINT "payment_reminders_sent_by_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_account_id_fkey";

-- DropIndex
DROP INDEX "accounts_user_id_is_active_idx";

-- DropIndex
DROP INDEX "ai_category_cache_merchant_normalized_idx";

-- DropIndex
DROP INDEX "ai_category_cache_merchant_normalized_key";

-- DropIndex
DROP INDEX "ai_category_cache_usage_count_idx";

-- DropIndex
DROP INDEX "bill_splits_status_idx";

-- DropIndex
DROP INDEX "budgets_user_id_category_id_start_date_key";

-- DropIndex
DROP INDEX "budgets_user_id_start_date_end_date_idx";

-- DropIndex
DROP INDEX "categories_user_id_type_idx";

-- DropIndex
DROP INDEX "group_members_group_id_is_active_idx";

-- DropIndex
DROP INDEX "insights_user_id_is_dismissed_created_at_idx";

-- DropIndex
DROP INDEX "notifications_user_id_is_read_created_at_idx";

-- DropIndex
DROP INDEX "split_participants_split_id_idx";

-- DropIndex
DROP INDEX "split_participants_user_id_status_idx";

-- DropIndex
DROP INDEX "transactions_deleted_at_idx";

-- DropIndex
DROP INDEX "transactions_user_id_category_id_idx";

-- DropIndex
DROP INDEX "transactions_user_id_transaction_date_idx";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "is_active",
ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#1e293b',
ADD COLUMN     "goal_amount" DECIMAL(10,2),
ADD COLUMN     "goal_date" TIMESTAMP(3),
ADD COLUMN     "icon" TEXT NOT NULL DEFAULT 'account_balance',
ALTER COLUMN "balance" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "ai_category_cache" DROP COLUMN "category_id",
DROP COLUMN "last_used_at",
DROP COLUMN "merchant_normalized",
DROP COLUMN "usage_count",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "hit_count" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "merchant" TEXT NOT NULL,
ADD COLUMN     "source" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "confidence" SET NOT NULL,
ALTER COLUMN "confidence" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "bill_splits" ADD COLUMN     "bill_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ALTER COLUMN "total_amount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "currency" SET DEFAULT 'GBP';

-- AlterTable
ALTER TABLE "budgets" DROP COLUMN "period_type",
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Budget',
ADD COLUMN     "period" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "start_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "end_date" SET NOT NULL,
ALTER COLUMN "end_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "alert_threshold" SET DEFAULT 80,
ALTER COLUMN "alert_threshold" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "type" SET DEFAULT 'expense',
ALTER COLUMN "color" SET NOT NULL,
ALTER COLUMN "color" SET DEFAULT '#95A5A6';

-- AlterTable
ALTER TABLE "group_members" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'member';

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "insights" DROP COLUMN "dismissed_at",
DROP COLUMN "feedback",
DROP COLUMN "is_dismissed",
DROP COLUMN "supporting_data",
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "read_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "notification_settings" DROP CONSTRAINT "notification_settings_pkey",
DROP COLUMN "ai_insights",
DROP COLUMN "insight_frequency",
DROP COLUMN "payment_received",
DROP COLUMN "split_reminders",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "insight_notifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "payment_reminders" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "push_notifications" BOOLEAN NOT NULL DEFAULT true,
ADD CONSTRAINT "notification_settings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "created_at",
DROP COLUMN "is_read",
DROP COLUMN "notification_type",
ADD COLUMN     "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payment_reminders" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'sent',
ALTER COLUMN "reminder_type" SET DEFAULT 'email';

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "category_breakdown",
DROP COLUMN "currency",
DROP COLUMN "net_change",
DROP COLUMN "total_expenses",
DROP COLUMN "total_income",
ADD COLUMN     "data" JSONB NOT NULL,
ADD COLUMN     "format" TEXT NOT NULL DEFAULT 'json',
ALTER COLUMN "report_type" DROP DEFAULT,
ALTER COLUMN "period_start" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "period_end" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "split_participants" ADD COLUMN     "payment_method" TEXT,
ALTER COLUMN "amount_owed" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "amount_paid" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "converted_amount",
DROP COLUMN "exchange_rate",
DROP COLUMN "is_split",
DROP COLUMN "split_id",
ADD COLUMN     "receipt_url" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'cleared',
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "merchant" SET NOT NULL,
ALTER COLUMN "transaction_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ai_confidence" SET NOT NULL,
ALTER COLUMN "ai_confidence" SET DEFAULT 0,
ALTER COLUMN "ai_confidence" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "date_format" TEXT NOT NULL DEFAULT 'MM/DD/YYYY',
ADD COLUMN     "location" TEXT,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'system';

-- CreateTable
CREATE TABLE "split_comments" (
    "id" TEXT NOT NULL,
    "split_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "split_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "split_comments_split_id_idx" ON "split_comments"("split_id");

-- CreateIndex
CREATE INDEX "split_comments_user_id_idx" ON "split_comments"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_token_key" ON "password_resets"("token");

-- CreateIndex
CREATE INDEX "password_resets_user_id_idx" ON "password_resets"("user_id");

-- CreateIndex
CREATE INDEX "password_resets_token_idx" ON "password_resets"("token");

-- CreateIndex
CREATE INDEX "password_resets_expires_at_idx" ON "password_resets"("expires_at");

-- CreateIndex
CREATE INDEX "accounts_account_type_idx" ON "accounts"("account_type");

-- CreateIndex
CREATE UNIQUE INDEX "ai_category_cache_merchant_key" ON "ai_category_cache"("merchant");

-- CreateIndex
CREATE INDEX "ai_category_cache_merchant_idx" ON "ai_category_cache"("merchant");

-- CreateIndex
CREATE INDEX "bill_splits_bill_date_idx" ON "bill_splits"("bill_date");

-- CreateIndex
CREATE INDEX "budgets_user_id_idx" ON "budgets"("user_id");

-- CreateIndex
CREATE INDEX "budgets_start_date_end_date_idx" ON "budgets"("start_date", "end_date");

-- CreateIndex
CREATE UNIQUE INDEX "budgets_user_id_category_id_period_key" ON "budgets"("user_id", "category_id", "period");

-- CreateIndex
CREATE INDEX "categories_user_id_idx" ON "categories"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_user_id_name_key" ON "categories"("user_id", "name");

-- CreateIndex
CREATE INDEX "group_members_group_id_idx" ON "group_members"("group_id");

-- CreateIndex
CREATE INDEX "groups_created_by_idx" ON "groups"("created_by");

-- CreateIndex
CREATE INDEX "insights_user_id_created_at_idx" ON "insights"("user_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "notification_settings_user_id_key" ON "notification_settings"("user_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_sent_at_idx" ON "notifications"("user_id", "sent_at" DESC);

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "payment_reminders_split_participant_id_idx" ON "payment_reminders"("split_participant_id");

-- CreateIndex
CREATE INDEX "payment_reminders_sent_by_idx" ON "payment_reminders"("sent_by");

-- CreateIndex
CREATE INDEX "transactions_user_id_idx" ON "transactions"("user_id");

-- CreateIndex
CREATE INDEX "transactions_category_id_idx" ON "transactions"("category_id");

-- CreateIndex
CREATE INDEX "transactions_transaction_date_idx" ON "transactions"("transaction_date");

-- CreateIndex
CREATE INDEX "transactions_user_id_transaction_date_idx" ON "transactions"("user_id", "transaction_date");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_splits" ADD CONSTRAINT "bill_splits_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_splits" ADD CONSTRAINT "bill_splits_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "split_comments" ADD CONSTRAINT "split_comments_split_id_fkey" FOREIGN KEY ("split_id") REFERENCES "bill_splits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "split_comments" ADD CONSTRAINT "split_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_reminders" ADD CONSTRAINT "payment_reminders_sent_by_fkey" FOREIGN KEY ("sent_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
