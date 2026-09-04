import Link from "next/link";
import styles from "./page.module.css";
import { Post } from "../lib/posts";
import PostActions from "./PostActions";
import SiteHeader from "../components/SiteHeader";
import SearchForm from "../components/SearchForm";
import { auth } from "@/auth";
import axios from "axios";

export default async function MyPosts({ searchParams }: { searchParams: Promise<{ search?: string; page?: string }> }) {
    const user:any = (await auth())?.user;
  const params = await searchParams;
  const query = params.search || "";
  const parsedPage = Number.parseInt(params.page || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const filter = new URLSearchParams({
    _page: String(currentPage),
    _per_page: "6",
    createdBy: user.username,
  });
  if (query) filter.set("title:contains", query);

  const postsResponse = await axios.get("http://localhost:4000/posts?" + filter.toString()).catch(() => ({ data: { data: [], items: 0, pages: 1 } }));
  const postsResult = postsResponse.data;
  const filteredPosts = postsResult.data;
  const postCount = postsResult.items;
  const pageCount = postsResult.pages || 1;
  const safePage = Math.min(currentPage, pageCount);
  const emptyPostCount = Math.max(0, 6 - filteredPosts.length);

  function pageUrl(page: number) {
    const nextParams = new URLSearchParams();
    if (query) nextParams.set("search", query);
    nextParams.set("page", String(page));
    return `/my-posts?${nextParams.toString()}`;
  }

  return (
    <main className={styles.page}>
      <SiteHeader  />
      <section className={styles.content}>
        <Link className={styles.backLink} href="/">← Back home</Link>
        <div className={styles.titleRow}>
          <div><p className={styles.eyebrow}>The collection</p><h1>My blog posts</h1></div>
          <SearchForm value={query} action="/my-posts" clearHref="/my-posts" />
        </div>
        <p className={styles.count}>{postCount} {postCount === 1 ? "post" : "posts"}</p>
        <div className={styles.postList}>
          {filteredPosts.map((post: Post, index: number) => (
            <div className={styles.post} key={post.id}>
              <div className={`${styles.number} ${index % 2 === 0 ? styles.coral : styles.green}`}>{String((safePage - 1) * 6 + index + 1).padStart(2, "0")}</div>
              <Link className={styles.postInfo} href={`/my-posts/${post.id}`}><div className={styles.meta}><span>{post.category}</span><span>{post.date}</span></div><h2>{post.title}</h2><p>{post.excerpt}</p></Link>
              <PostActions id={post.id} title={post.title} />
            </div>
          ))}
          {Array.from({ length: emptyPostCount }, (_, index) => <div className={`${styles.post} ${filteredPosts.length === 0 && index === 0 ? styles.noPostsText : styles.emptyPost}`} aria-hidden="true" key={`empty-post-${index}`} >
            {filteredPosts.length === 0 && index === 0 ?<p className={styles.empty}>No posts match that search.</p> : null}</div>)}
        </div>
        <div className={styles.pagination} aria-label="Post pagination">
          <Link scroll={false} aria-disabled={safePage === 1} className={safePage === 1 ? styles.disabledPage : ""} href={safePage === 1 ? "#" : pageUrl(safePage - 1)}>← Previous</Link>
          <span>Page {safePage} of {pageCount}</span>
          <Link scroll={false} aria-disabled={safePage === pageCount} className={safePage === pageCount ? styles.disabledPage : ""} href={safePage === pageCount ? "#" : pageUrl(safePage + 1)}>Next →</Link>
        </div>
      </section>
    </main>
  );
}
