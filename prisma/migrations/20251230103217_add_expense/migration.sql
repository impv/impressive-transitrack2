-- CreateEnum
CREATE TYPE "public"."TransportType" AS ENUM ('TRAIN', 'BUS');

-- CreateTable
CREATE TABLE "public"."Expense" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "departureStation" TEXT NOT NULL,
    "arrivalStation" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "transport" "public"."TransportType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Expense_memberId_idx" ON "public"."Expense"("memberId");

-- CreateIndex
CREATE INDEX "Expense_date_idx" ON "public"."Expense"("date");

-- CreateIndex
CREATE INDEX "Expense_memberId_date_idx" ON "public"."Expense"("memberId", "date");

-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
