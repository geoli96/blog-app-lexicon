export type Post = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
};

export type PaginatedPosts = {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: Post[];
};

export const API_URL = "http://localhost:4000";
export const categories = ["All", "General", "Essay", "Ideas", "Guides", "Reviews", "Personal", "Travel", "Fitness", "Food"];
export const searchFilters = ["title", "createdBy","excerpt","content"];
export const searchFilterLabelMapper: Record<string, string> = {title: "Title", createdBy: "Author", excerpt: "Description", content: "Content"}

export async function getPosts(searchParams?: Record<string, string>): Promise<Post[]> {
    const urlParams = new URLSearchParams({_per_page: "6" });
    Object.entries(searchParams || {}).forEach(([key, value]) => {
      urlParams.set(key, value);
    });
  const response = await fetch(`${API_URL}/posts?${urlParams.toString()}`);
  if (!response.ok) throw new Error("Unable to load posts");
  return response.json();
}

export async function getPost(id: string): Promise<Post | null> {
  const response = await fetch(`${API_URL}/posts/${id}`);
  if (!response.ok) throw new Error("Unable to load post");
  return response.json();
}
