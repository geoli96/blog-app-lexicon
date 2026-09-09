import styles from "./page.module.css";
import { categories } from "../lib/posts";
import SiteHeader from "../components/SiteHeader";
import { auth } from "@/auth";
import axios from "axios";
import ProfilePosts from "../components/ProfilePosts";

export default async function MyPosts({ searchParams }: { searchParams: Promise<{ search?: string; page?: string; category?: string }> }) {
    const user:any = (await auth())?.user;
  const params = await searchParams;
  const query = params.search || "";
  const selectedCategory = params.category || "";
  const category = categories.includes(selectedCategory) ? selectedCategory : "";
  const parsedPage = Number.parseInt(params.page || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  if(!user){
    return <main>
      <h1>Not signed in</h1>
    </main>
  }

  const filter = new URLSearchParams({
    _page: String(currentPage),
    _per_page: "6",
    createdBy: user.username,
  });
  if(category){
    filter.append("category", category);
  }
  if (query) filter.set("title:contains", query);

  const postsResponse = await axios.get("http://localhost:4000/posts?" + filter.toString()).catch(() => ({ data: { data: [], items: 0, pages: 1 } }));

  return (
    <main className={styles.page}>
      <SiteHeader  />
      <ProfilePosts params={params} authedUser={user} username={user.username}  postsResponse={postsResponse}></ProfilePosts>
    </main>
  );
}
