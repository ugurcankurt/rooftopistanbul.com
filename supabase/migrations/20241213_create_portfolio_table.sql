-- Create a table for portfolio images
create table public.portfolio_images (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  storage_path text not null, -- Path in the bucket, e.g. "portfolio/image1.jpg"
  category text not null, -- 'studio', 'outdoor', 'wedding', 'special'
  width integer, -- Optional, for masonry layout
  height integer, -- Optional, for masonry layout
  alt_text jsonb, -- e.g. {"en": "Beautiful view", "tr": "Harika manzara"}
  is_featured boolean default false
);

-- Enable RLS
alter table public.portfolio_images enable row level security;

-- Policy to allow read access to everyone
create policy "Enable read access for all users"
on public.portfolio_images for select
to anon, authenticated
using (true);

-- Policy to allow write access only to authenticated service_role (or admins if you have auth)
-- For now, assuming manual insert via dashboard or script
