-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role can manage tokens" ON email_verification_tokens;

-- Create policy for users to view only their own verification tokens
CREATE POLICY "Users can view their own verification tokens"
ON email_verification_tokens
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for service role to insert tokens (via edge functions)
CREATE POLICY "Service role can insert tokens"
ON email_verification_tokens
FOR INSERT
WITH CHECK (true);

-- Create policy for service role to update tokens (via edge functions)
CREATE POLICY "Service role can update tokens"
ON email_verification_tokens
FOR UPDATE
USING (true);

-- Create policy for service role to delete expired tokens
CREATE POLICY "Service role can delete tokens"
ON email_verification_tokens
FOR DELETE
USING (true);