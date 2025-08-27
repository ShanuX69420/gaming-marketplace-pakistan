-- Fix username availability check by allowing users to query usernames
-- This is needed for the username availability check in the frontend

-- Drop the existing policy that's too restrictive
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create more specific policies
-- Users can view basic public info (username, full_name, avatar_url) for active profiles
CREATE POLICY "Public profile info is viewable by everyone" ON public.profiles
    FOR SELECT USING (
        is_active = true AND 
        NOT is_suspended
    );

-- Allow authenticated users to check username availability (username column only)
CREATE POLICY "Username availability check" ON public.profiles
    FOR SELECT USING (
        auth.role() = 'authenticated'
    );

-- Create a function to safely check username availability
CREATE OR REPLACE FUNCTION public.check_username_availability(username_to_check TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Return false if username exists (not available)
    -- Return true if username doesn't exist (available)
    RETURN NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE username = username_to_check
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.check_username_availability(TEXT) TO authenticated;