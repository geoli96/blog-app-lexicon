import styles from "./page.module.css";
import { categories } from "@/app/lib/posts";
import SiteHeader from "@/app/components/SiteHeader";
import { auth } from "@/auth";
import axios from "axios";
import ProfilePosts from "@/app/components/ProfilePosts";

export default async function UserPosts({ searchParams, params }: { params: Promise<{username:string}>; searchParams: Promise<{ search?: string; page?: string; category?: string }> }) {
    const user:any = (await auth())?.user;
    const username = (await params)?.username
  const _searchParams = await searchParams;
  const query = _searchParams.search || "";
  const selectedCategory = _searchParams.category || "";
  const category = categories.includes(selectedCategory) ? selectedCategory : "";
  const parsedPage = Number.parseInt(_searchParams.page || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const filter = new URLSearchParams({
    _page: String(currentPage),
    _per_page: "6",
    createdBy: username,
  });
  if(category){
    filter.append("category", category);
  }
  if (query) filter.set("title:contains", query);

  const postsResponse = await axios.get("http://localhost:4000/posts?" + filter.toString()).catch(() => ({ data: { data: [], items: 0, pages: 1 } }));

  return (
    <main className={styles.page}>
      <SiteHeader  />
      <ProfilePosts params={_searchParams} authedUser={user} username={username}  postsResponse={postsResponse}></ProfilePosts>
    </main>
  );
}
