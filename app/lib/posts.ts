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

export const API_URL = "http://localhost:4000";
export const categories = ["All", "General", "Essay", "Ideas", "Guides", "Reviews", "Personal", "Travel", "Fitness", "Food"];

export async function getPosts(searchParams?: Record<string, string>): Promise<Post[]> {
    const urlParams = new URLSearchParams({_per_page: "6" });
    Object.entries(searchParams || {}).forEach(([key, value]) => {
      urlParams.set(key, value);
    });
  const response = await fetch(`${API_URL}/posts?${urlParams.toString()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load posts");
  return response.json();
}

export async function getPost(id: string): Promise<Post | null> {
  const response = await fetch(`${API_URL}/posts/${id}`, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json();
}
