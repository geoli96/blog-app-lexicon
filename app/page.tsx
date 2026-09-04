import Link from "next/link";
import styles from "./page.module.css";
import { categories, getPosts, Post } from "./lib/posts";
import CategoryFilter from "./CategoryFilter";
import SiteHeader from "./components/SiteHeader";
import SearchForm from "./components/SearchForm";
import axios from "axios";

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string; category?: string; page?: string }> }) {
  const params = await searchParams;
  const query = params.search || "";
  const selectedCategory = params.category || "";
  const category = categories.includes(selectedCategory) ? selectedCategory : "";
  const parsedPage = Number.parseInt(params.page || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const filter = new URLSearchParams();
  filter.append("_page", String(currentPage));
  filter.append("_per_page", "4");
  if(category){
    filter.append("category", category);
  }
  if(query){
    filter.append("q", query);
  }
  const filteredPostsResponse = (await axios.get('http://localhost:4000/posts?' + filter.toString())).data;
  const filteredPosts = filteredPostsResponse.data;
  const extraCards = 4 - filteredPosts.length - Number(filteredPosts.length === 0);
  const extra:number[] = [];
  extra.length = extraCards;
  extra.fill(0);
  
  const pageCount = filteredPostsResponse.pages;
  const safePage = Math.min(currentPage, pageCount);

  function pageUrl(page: number) {
    const nextParams = new URLSearchParams();
    if (query) nextParams.set("search", query);
    if (category) nextParams.set("category", category);
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
                  <SearchForm value={query} action="/" clearHref={category ? `/?category=${encodeURIComponent(category)}` : "/"} hiddenFields={category !== "All" ? { category } : {}} />
                </div>
              </div>
              <div className={styles.postGrid}>
                {filteredPosts.map((post: Post, index:number) => <PostCard key={post.id} post={post} featured={safePage === 1 && index === 0} />)}
                {filteredPosts.length === 0 && <p className={styles.empty}>No posts match that search.</p>}
                {extra.map((v,i) => <Link key={"postcard-empty"+(i+1)} className={`${styles.postCardEmpty}`} href=""></Link>)}
              </div>
              {<div className={styles.pagination} aria-label="Post pagination">
                <Link scroll={false} aria-disabled={safePage === 1} className={safePage === 1 ? styles.disabledPage : ""} href={safePage === 1 ? "#" : pageUrl(safePage - 1)}>← Previous</Link>
                <span>Page {safePage} of {pageCount}</span>
                <Link scroll={false} aria-disabled={safePage === pageCount} className={safePage === pageCount ? styles.disabledPage : ""} href={safePage === pageCount ? "#" : pageUrl(safePage + 1)}>Next →</Link>
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

