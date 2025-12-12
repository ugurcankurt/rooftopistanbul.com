-- Allow anonymous inserts to portfolio_images table
-- (Since admin panel uses application-level auth, not Supabase Auth)
create policy "Enable insert for all users"
on public.portfolio_images
for insert
to anon, authenticated
with check (true);

-- Allow anonymous delete on portfolio_images
create policy "Enable delete for all users"
on public.portfolio_images
for delete
to anon, authenticated
using (true);

-- Allow anonymous uploads to 'portfolio' bucket
create policy "Public Insert"
on storage.objects
for insert
to anon, authenticated
with check ( bucket_id = 'portfolio' );

-- Allow anonymous deletes from 'portfolio' bucket
create policy "Public Delete"
on storage.objects
for delete
to anon, authenticated
using ( bucket_id = 'portfolio' );
