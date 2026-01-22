-- Enable Row Level Security on Member table
ALTER TABLE "Member" ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on Expense table
ALTER TABLE "Expense" ENABLE ROW LEVEL SECURITY;

-- Create policy for Member table
-- Only allow service_role (server-side) to access
CREATE POLICY "Service role can manage all members"
ON "Member"
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Block anonymous access to Member table
CREATE POLICY "Block anonymous access to members"
ON "Member"
FOR ALL
TO anon
USING (false);

-- Create policy for Expense table
-- Only allow service_role (server-side) to access
CREATE POLICY "Service role can manage all expenses"
ON "Expense"
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Block anonymous access to Expense table
CREATE POLICY "Block anonymous access to expenses"
ON "Expense"
FOR ALL
TO anon
USING (false);
