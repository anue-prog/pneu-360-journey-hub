
-- Create wait_times table
CREATE TABLE public.wait_times (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL UNIQUE,
  wait_minutes integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wait_times ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Anyone can read wait times"
ON public.wait_times FOR SELECT
TO public
USING (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update wait times"
ON public.wait_times FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.wait_times;

-- Insert initial data
INSERT INTO public.wait_times (location, wait_minutes) VALUES
  ('oftringen', 0),
  ('langenthal', 0);
