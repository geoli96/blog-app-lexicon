export type Post = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  createdAt: string;
  updatedAt: string;
};

export const API_URL = "http://localhost:4000";
export const categories = ["All", "General", "Essay", "Ideas", "Guides", "Reviews", "Personal", "Travel", "Fitness", "Food"];

export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${API_URL}/posts`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load posts");
  return response.json();
}

export async function getPost(id: string): Promise<Post | null> {
  const response = await fetch(`${API_URL}/posts/${id}`, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json();
}
