# Database Setup - Phase 7: User Profile Schema

This document contains instructions for setting up the user profile database schema in Supabase.

## Quick Setup Instructions

### Step 1: Access Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run Migration Scripts

Execute the following SQL scripts in order:

#### 1. Create Profiles Table
Copy and paste the contents of `supabase/migrations/001_create_profiles_table.sql` into the SQL editor and click "Run".

This creates:
- `profiles` table with all user profile fields
- Indexes for performance optimization
- Row Level Security (RLS) policies
- Proper foreign key relationships

#### 2. Create Profile Functions & Triggers
Copy and paste the contents of `supabase/migrations/002_create_profile_functions.sql` into the SQL editor and click "Run".

This creates:
- Automatic profile creation trigger (runs when user signs up)
- Profile update timestamp trigger
- Username generation function
- Email verification update function

#### 3. Setup Storage Buckets
Copy and paste the contents of `supabase/migrations/003_setup_storage.sql` into the SQL editor and click "Run".

This creates:
- `avatars` storage bucket for profile pictures
- `products` storage bucket for future product images
- Storage RLS policies for secure file access

## What Gets Created

### Profiles Table Structure
```sql
- id (UUID, Primary Key, references auth.users)
- email, first_name, last_name, full_name
- username (unique), avatar_url, bio
- phone, location
- Verification fields (email_verified, phone_verified, identity_verified)
- Seller information (is_seller, seller_rating, sales count)
- Account status (is_active, is_suspended)
- Social links (discord, telegram, whatsapp)
- Preferences (currency, notifications)
- Timestamps (created_at, updated_at)
```

### Automatic Features
- **Profile Creation**: When a user registers, a profile is automatically created
- **Email Verification Sync**: Profile updates when user confirms email
- **Username Generation**: Function to suggest unique usernames
- **Secure Storage**: Avatar uploads with user-specific access control

## Testing the Setup

After running the migrations, you can test by:

1. **Register a new user** through your app
2. **Check the profiles table** in Supabase Table Editor
3. **Verify the profile was created** automatically
4. **Test avatar upload** (if implemented in your app)

## Security Features

- **Row Level Security**: Users can only update their own profiles
- **Storage Security**: Users can only upload/delete their own avatars
- **Public Profile Viewing**: All active profiles are publicly viewable
- **Admin Controls**: Profiles cannot be deleted by users (admin only)

## Next Steps

After setting up the database schema:
1. Test user registration creates profiles automatically
2. Implement profile editing UI (Phase 8)
3. Add avatar upload functionality
4. Create public profile pages

## Troubleshooting

**If you get permission errors:**
- Make sure you're running the SQL as the project owner
- Check that RLS is properly configured
- Verify storage bucket policies are in place

**If profiles aren't created automatically:**
- Check that the trigger `on_auth_user_created` exists
- Verify the `handle_new_user()` function is working
- Look for errors in the Supabase logs

**For storage issues:**
- Ensure storage buckets exist (`avatars`, `products`)
- Check storage policies are allowing the right permissions
- Verify file size limits in your upload code