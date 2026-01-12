/*
  Warnings:

  - You are about to drop the column `arrivalStation` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `departureStation` on the `Expense` table. All the data in the column will be lost.
  - Added the required column `arrival` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departure` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Expense" DROP COLUMN "arrivalStation",
DROP COLUMN "departureStation",
ADD COLUMN     "arrival" TEXT NOT NULL,
ADD COLUMN     "departure" TEXT NOT NULL;
