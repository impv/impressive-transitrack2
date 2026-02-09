-- CreateTable
CREATE TABLE "FavoriteRoute" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "departure" TEXT NOT NULL,
    "arrival" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "transport" "TransportType" NOT NULL,
    "tripType" "TripType" NOT NULL DEFAULT 'ONEWAY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FavoriteRoute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FavoriteRoute_memberId_idx" ON "FavoriteRoute"("memberId");

-- AddForeignKey
ALTER TABLE "FavoriteRoute" ADD CONSTRAINT "FavoriteRoute_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Enable Row Level Security
ALTER TABLE "FavoriteRoute" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage all favorite routes"
ON "FavoriteRoute"
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Block anonymous access to favorite routes"
ON "FavoriteRoute"
FOR ALL
TO anon
USING (false);
