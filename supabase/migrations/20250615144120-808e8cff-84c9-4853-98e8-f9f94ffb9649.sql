
-- Create table to store user query history and ChatGPT (AI) responses
CREATE TABLE public.query_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security so only user can access their data
ALTER TABLE public.query_history ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to view their own query history
CREATE POLICY "Users can view their own query history"
  ON public.query_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Allow users to create their own query history
CREATE POLICY "Users can add their own query history"
  ON public.query_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to delete their own query history
CREATE POLICY "Users can delete their query history"
  ON public.query_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Allow users to update their own query history
CREATE POLICY "Users can update their query history"
  ON public.query_history
  FOR UPDATE
  USING (auth.uid() = user_id);
