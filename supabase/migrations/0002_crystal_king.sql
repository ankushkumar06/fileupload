/*
  # Setup Storage for Documents

  1. Storage Setup
    - Create storage bucket for documents
    - Set up public access policies
  
  2. Security
    - Enable RLS for storage
    - Add policies for authenticated users
*/

-- Create storage bucket
insert into storage.buckets (id, name)
values ('documents', 'documents')
on conflict do nothing;

-- Set up RLS for storage
create policy "Authenticated users can upload documents"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'documents');

create policy "Authenticated users can read their documents"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'documents');