-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
