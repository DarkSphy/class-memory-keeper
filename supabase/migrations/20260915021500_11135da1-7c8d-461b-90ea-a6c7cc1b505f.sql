REVOKE ALL ON FUNCTION public.seed_demo_for_profile() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.seed_demo_for_profile() FROM anon;
REVOKE ALL ON FUNCTION public.seed_demo_for_profile() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.seed_demo_for_profile() TO service_role;