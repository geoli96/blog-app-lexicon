import Link from "next/link";
import styles from "./page.module.css";
import { categories, getPosts, Post } from "./lib/posts";
import CategoryFilter from "./CategoryFilter";
import SiteHeader from "./components/SiteHeader";
import SearchForm from "./components/SearchForm";

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string; category?: string; page?: string }> }) {
  const params = await searchParams;
  const posts = await getPosts().catch(() => []);
  const query = params.search || "";
  const selectedCategory = params.category || "All";
  const category = categories.includes(selectedCategory) ? selectedCategory : "All";
  const parsedPage = Number.parseInt(params.page || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const postsPerPage = 4;

  const filteredPosts = posts.filter((post) =>
    (category === "All" || post.category === category) &&
    `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
  const safePage = Math.min(currentPage, pageCount);
  const visiblePosts = filteredPosts.slice((safePage - 1) * postsPerPage, safePage * postsPerPage);

  function pageUrl(page: number) {
    const nextParams = new URLSearchParams();
    if (query) nextParams.set("search", query);
    if (category !== "All") nextParams.set("category", category);
    nextParams.set("page", String(page));
    return `/?${nextParams.toString()}`;
  }

  return (
    <div className={styles.page}>
      <SiteHeader />

      <main className={styles.main}>
        <>
            <section className={styles.archive}>
              <div className={styles.sectionHeader}>
                <div><p className={styles.eyebrow}>Blog posts</p><h2>Latest posts</h2></div>
                <div className={styles.filterControls}>
                  <CategoryFilter selectedCategory={category} />
                  <SearchForm value={query} action="/" clearHref={category !== "All" ? `/?category=${encodeURIComponent(category)}` : "/"} hiddenFields={category !== "All" ? { category } : {}} />
                </div>
              </div>
              <div className={styles.postGrid}>
                {visiblePosts.map((post, index) => <PostCard key={post.id} post={post} featured={safePage === 1 && index === 0} />)}
              </div>
              {filteredPosts.length === 0 && <p className={styles.empty}>No posts match that search.</p>}
              {filteredPosts.length > 0 && <div className={styles.pagination} aria-label="Post pagination">
                <Link aria-disabled={safePage === 1} className={safePage === 1 ? styles.disabledPage : ""} href={safePage === 1 ? "#" : pageUrl(safePage - 1)}>← Previous</Link>
                <span>Page {safePage} of {pageCount}</span>
                <Link aria-disabled={safePage === pageCount} className={safePage === pageCount ? styles.disabledPage : ""} href={safePage === pageCount ? "#" : pageUrl(safePage + 1)}>Next →</Link>
              </div>}
            </section>
        </>
      </main>
    </div>
  );
}

function PostCard({ post, featured }: { post: Post; featured: boolean }) {
  return <Link className={`${styles.postCard} ${featured ? styles.featured : ""}`} href={`/posts/${post.id}`}>
    <div className={styles.cardVisual}><span>{featured ? "01" : "✦"}</span></div>
    <div className={styles.cardContent}><div className={styles.cardMeta}><span>{post.category}</span><span>{post.date}</span></div><h3>{post.title}</h3><p>{post.excerpt}</p><span  className={styles.author}>Written by {post.createdBy} </span><span className={styles.readLink}>Read post <b>↗</b></span></div>
  </Link>;
}

