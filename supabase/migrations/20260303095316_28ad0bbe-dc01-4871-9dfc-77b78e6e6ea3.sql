
-- Add exit_destination to track where users go when leaving a page
ALTER TABLE public.analytics_events ADD COLUMN exit_destination text;

-- Add is_returning_visitor to distinguish new vs returning visitors
ALTER TABLE public.analytics_events ADD COLUMN is_returning_visitor boolean DEFAULT false;
