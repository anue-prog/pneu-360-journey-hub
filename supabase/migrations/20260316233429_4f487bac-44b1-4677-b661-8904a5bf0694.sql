
-- Table for manually curated reviews (admin-managed)
CREATE TABLE public.curated_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating = 5),
  location TEXT,
  photo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.curated_reviews ENABLE ROW LEVEL SECURITY;

-- Public read access (reviews are public content)
CREATE POLICY "Anyone can read active curated reviews"
ON public.curated_reviews
FOR SELECT
USING (active = true);

-- Service role can manage (edge function uses service role)
-- No insert/update/delete policies needed for anon - managed via edge function or direct DB
