import Link from "next/link";
import styles from "./page.module.css";
import { getPosts } from "../lib/posts";
import PostActions from "./PostActions";
import SiteHeader, { HeaderLink } from "../components/SiteHeader";
import SearchForm from "../components/SearchForm";

export default async function MyPosts({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const posts = await getPosts().catch(() => []);
  const query = (await searchParams).search || "";

  const filteredPosts = posts.filter((post) =>
    `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main className={styles.page}>
      <SiteHeader  />
      <section className={styles.content}>
        <Link className={styles.backLink} href="/">← Back home</Link>
        <div className={styles.titleRow}>
          <div><p className={styles.eyebrow}>The collection</p><h1>My blog posts</h1></div>
          <SearchForm value={query} action="/my-posts" clearHref="/my-posts" />
        </div>
        <p className={styles.count}>{filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}</p>
        <div className={styles.postList}>
          {filteredPosts.map((post, index) => (
            <div className={styles.post} key={post.id}>
              <div className={`${styles.number} ${index % 2 === 0 ? styles.coral : styles.green}`}>{String(index + 1).padStart(2, "0")}</div>
              <Link className={styles.postInfo} href={`/my-posts/${post.id}`}><div className={styles.meta}><span>{post.category}</span><span>{post.date}</span></div><h2>{post.title}</h2><p>{post.excerpt}</p></Link>
              <PostActions id={post.id} title={post.title} />
            </div>
          ))}
        </div>
        {filteredPosts.length === 0 && <p className={styles.empty}>No posts match that search.</p>}
      </section>
    </main>
  );
}
