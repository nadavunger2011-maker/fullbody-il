CREATE OR REPLACE FUNCTION public.create_plan_lead(
  _name text,
  _phone text,
  _email text,
  _goal text,
  _gender text,
  _age integer,
  _height numeric,
  _weight numeric,
  _activity numeric,
  _days integer,
  _kosher boolean,
  _flavor text,
  _target_calories integer,
  _experience_level text,
  _program_start_date date,
  _form_data jsonb DEFAULT NULL,
  _results_data jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.leads (
    name, phone, email, goal, gender, age, height, weight, activity, days,
    kosher, flavor, target_calories, experience_level, program_start_date, last_seen_at
  ) VALUES (
    _name, _phone, _email, _goal, _gender, _age, _height, _weight, _activity, _days,
    _kosher, _flavor, _target_calories, _experience_level, COALESCE(_program_start_date, CURRENT_DATE), now()
  )
  RETURNING id INTO new_id;

  IF _form_data IS NOT NULL OR _results_data IS NOT NULL THEN
    INSERT INTO public.plans (lead_id, form_data, results_data)
    VALUES (new_id, _form_data, _results_data);
  END IF;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_plan_lead(text,text,text,text,text,integer,numeric,numeric,numeric,integer,boolean,text,integer,text,date,jsonb,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_plan_lead(text,text,text,text,text,integer,numeric,numeric,numeric,integer,boolean,text,integer,text,date,jsonb,jsonb) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_lead_dashboard(_lead_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'lead', jsonb_build_object(
      'id', l.id,
      'name', l.name,
      'goal', l.goal,
      'days', l.days,
      'flavor', l.flavor,
      'kosher', l.kosher,
      'target_calories', l.target_calories,
      'experience_level', l.experience_level,
      'program_start_date', l.program_start_date
    ),
    'plan', (
      SELECT jsonb_build_object('form_data', p.form_data, 'results_data', p.results_data, 'created_at', p.created_at)
      FROM public.plans p
      WHERE p.lead_id = l.id
      ORDER BY p.created_at DESC
      LIMIT 1
    )
  )
  INTO result
  FROM public.leads l
  WHERE l.id = _lead_id;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_lead_dashboard(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_lead_dashboard(uuid) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.touch_lead_seen(_lead_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.leads SET last_seen_at = now() WHERE id = _lead_id;
END;
$$;

REVOKE ALL ON FUNCTION public.touch_lead_seen(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.touch_lead_seen(uuid) TO anon, authenticated, service_role;

DELETE FROM public.leads WHERE name LIKE '\_\_diag\_test%';