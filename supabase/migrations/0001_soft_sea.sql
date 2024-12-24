/*
  # Initial Schema Setup for Document Processing Application

  1. New Tables
    - users (handled by Supabase Auth)
    - documents
      - Stores document metadata and references
    - document_chunks
      - Stores processed document chunks for RAG
    - document_embeddings
      - Stores vector embeddings for semantic search
    - user_queries
      - Stores user interaction history
    
  2. Security
    - RLS policies for all tables
    - Secure access patterns
*/

-- Enable pgvector extension
create extension if not exists vector;

-- Documents table
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  title text not null,
  file_path text not null,
  file_type text not null,
  file_size bigint not null,
  status text not null default 'pending',
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Document chunks for RAG
create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade not null,
  content text not null,
  chunk_index integer not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Vector embeddings for semantic search
create table if not exists document_embeddings (
  id uuid primary key default gen_random_uuid(),
  chunk_id uuid references document_chunks(id) on delete cascade not null,
  embedding vector(1536) not null,
  created_at timestamptz default now()
);

-- User queries and interactions
create table if not exists user_queries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  query text not null,
  response text,
  documents_referenced uuid[] not null default '{}',
  created_at timestamptz default now()
);

-- Enable RLS
alter table documents enable row level security;
alter table document_chunks enable row level security;
alter table document_embeddings enable row level security;
alter table user_queries enable row level security;

-- RLS Policies
create policy "Users can view their own documents"
  on documents for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own documents"
  on documents for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can view their document chunks"
  on document_chunks for select
  to authenticated
  using (
    exists (
      select 1 from documents
      where documents.id = document_chunks.document_id
      and documents.user_id = auth.uid()
    )
  );

create policy "Users can view their document embeddings"
  on document_embeddings for select
  to authenticated
  using (
    exists (
      select 1 from document_chunks
      join documents on documents.id = document_chunks.document_id
      where document_chunks.id = document_embeddings.chunk_id
      and documents.user_id = auth.uid()
    )
  );

create policy "Users can view their queries"
  on user_queries for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their queries"
  on user_queries for insert
  to authenticated
  with check (auth.uid() = user_id);