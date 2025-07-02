-- DropIndex
DROP INDEX "order_items_orderId_idx";

-- DropIndex
DROP INDEX "orders_userId_idx";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" DROP DEFAULT;
