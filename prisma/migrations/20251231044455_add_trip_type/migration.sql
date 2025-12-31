-- CreateEnum
CREATE TYPE "public"."TripType" AS ENUM ('ONEWAY', 'ROUNDTRIP');

-- AlterTable
ALTER TABLE "public"."Expense" ADD COLUMN     "tripType" "public"."TripType" NOT NULL DEFAULT 'ONEWAY';
