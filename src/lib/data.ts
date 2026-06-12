import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Artwork = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  medium: string | null;
  year: number | null;
  image_url: string;
  is_featured: boolean;
  display_order: number;
};

export type Poem = {
  id: string;
  title: string;
  body: string | null;
  pdf_url: string | null;
  category: string | null;
  excerpt: string | null;
  is_featured: boolean;
  display_order: number;
  written_on: string | null;
};

export type Publication = {
  id: string;
  title: string;
  publication_name: string | null;
  publication_date: string | null;
  description: string | null;
  category: string | null;
  cover_url: string;
  file_url: string | null;
  link_url: string | null;
  is_featured: boolean;
  display_order: number;
};

export type Memory = {
  id: string;
  image_url: string;
  caption: string | null;
  note: string | null;
  taken_on: string | null;
  rotation: number | null;
  display_order: number;
};

const BUCKETS: Record<string, string> = {
  artworks: "artworks",
  poems: "poems",
  publications: "publications",
  memories: "memories",
};

export function publicUrl(bucket: keyof typeof BUCKETS, path: string | null | undefined) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  const { data } = supabase.storage.from(BUCKETS[bucket]).getPublicUrl(path);
  return data.publicUrl;
}

export function useArtworks() {
  return useQuery({
    queryKey: ["artworks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Artwork[];
    },
  });
}

export function usePoems() {
  return useQuery({
    queryKey: ["poems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("poems")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Poem[];
    },
  });
}

export function usePublications() {
  return useQuery({
    queryKey: ["publications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Publication[];
    },
  });
}

export function useMemories() {
  return useQuery({
    queryKey: ["memories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Memory[];
    },
  });
}