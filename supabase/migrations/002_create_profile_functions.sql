-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        first_name,
        last_name,
        full_name,
        email_verified
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email_confirmed_at IS NOT NULL
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function after user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update profile updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profile changes
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate unique username suggestions
CREATE OR REPLACE FUNCTION public.generate_username(first_name TEXT, last_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_username TEXT;
    final_username TEXT;
    counter INTEGER := 0;
BEGIN
    -- Create base username from first and last name
    base_username := LOWER(
        REGEXP_REPLACE(
            COALESCE(first_name, '') || COALESCE(last_name, ''), 
            '[^a-zA-Z0-9]', 
            '', 
            'g'
        )
    );
    
    -- If base_username is empty, use 'user'
    IF base_username = '' THEN
        base_username := 'user';
    END IF;
    
    -- Check if base username is available
    final_username := base_username;
    
    -- If not available, append numbers until we find a unique one
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
        counter := counter + 1;
        final_username := base_username || counter::TEXT;
    END LOOP;
    
    RETURN final_username;
END;
$$ LANGUAGE plpgsql;

-- Function to update user email verification status
CREATE OR REPLACE FUNCTION public.update_email_verification()
RETURNS TRIGGER AS $$
BEGIN
    -- Update profile when user's email is confirmed
    IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
        UPDATE public.profiles 
        SET email_verified = TRUE, updated_at = NOW()
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update email verification status
DROP TRIGGER IF EXISTS on_email_confirmed ON auth.users;
CREATE TRIGGER on_email_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW 
    WHEN (OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at)
    EXECUTE FUNCTION public.update_email_verification();