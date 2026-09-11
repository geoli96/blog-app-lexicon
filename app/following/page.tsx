import Link from "next/link";
import styles from "../page.module.css";
import styles2 from './page.module.css'
import { categories, PaginatedPosts, Post, searchFilters } from "../lib/posts";
import SiteHeader from "../components/SiteHeader";
import axios from "axios";
import { auth } from "@/auth";
import SortBy from "../components/SortBy";

export default async function FollowingPage({ searchParams }: {searchParams: Promise<{sortBy?:string; search?: string; category?: string; page?: string; searchFilter?:string }> }) {
  const user = (await auth())?.user;
  if(!user){
    return null;
  }
    const params = await searchParams;
  const query = params.search || "";
  const sortBy = params.sortBy || "";
  const selectedCategory = params.category || "";
  const category = categories.includes(selectedCategory) ? selectedCategory : "";
  const selectedSearchFilter = params.searchFilter || "";
  const searchFilter = searchFilters.includes(selectedSearchFilter) ? selectedSearchFilter : "";
  const parsedPage = Number.parseInt(params.page || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const filter = new URLSearchParams();
  filter.append("_page", String(currentPage));
  filter.append("_per_page", "6");
  filter.append("_sort", sortBy || "-dateInMs");

  const followedAuthors = (await axios.get(`http://localhost:4000/follows?followedBy=${user.username}`)).data;
  filter.append("_where", `{"or": ${JSON.stringify(followedAuthors.map(({follow}:{follow:string}) => ({createdBy: {eq: follow}})))} }`);
  const filteredPostsResponse = await axios.get<PaginatedPosts>('http://localhost:4000/posts?' + filter.toString());

  const filteredPosts = filteredPostsResponse.data.data;
  const extraCards = 6 - filteredPosts.length - Number(filteredPosts.length === 0);
  const extra:number[] = [];
  extra.length = extraCards;
  extra.fill(0);
  
  const pageCount = filteredPostsResponse.data.pages;
  const safePage = Math.min(currentPage, pageCount);

  function pageUrl(page: number) {
    const nextParams = new URLSearchParams();
    if (query) nextParams.set("search", query);
    if (category) nextParams.set("category", category);
    if (searchFilter) nextParams.set("searchFilter", searchFilter);
    nextParams.set("page", String(page));
    return `/?${nextParams.toString()}`;
  }

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <>
            <section className={styles.archive}>
              <div className={styles.pageLinksContainer}>
              <a href="/" >All posts</a>
              {user?<a href="/following" className={styles.pageLinkActive}>By followed authors</a> : null}
              </div>
              <div className={styles.sectionHeader}>
                <div><h2>Latest posts</h2><p>{filteredPostsResponse.data.items} posts</p></div>
                <div className={styles.filterControls + " " + styles2.filterControls}>
                  <SortBy selectedSort={sortBy} />
                </div>
              </div>
              <div className={styles.postGrid}>
                {filteredPosts.map((post: Post, index:number) => <PostCard key={post.id} post={post} featured={safePage === 1 && index === 0} />)}
                {filteredPosts.length === 0 && <p className={styles.empty}>No posts found.</p>}
                {extra.map((v,i) => <Link key={"postcard-empty"+(i+1)} className={`${styles.postCardEmpty}`} href=""><div></div></Link>)}
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
  const date = new Date(post.date);
  return <Link className={`${styles.postCard} ${featured ? styles.featured : ""}`} href={`/posts/${post.id}`}>
    <img className={styles.postImage} height={295} width={"40%"} alt={post.imageCaption} src={post.imageUrl}/>
    <div className={styles.cardContent}><div className={styles.cardMeta}>
      <span>{post.category}</span>
      <span>{date.getDate() < 10 ? "0" : ""}{date.getDate()}/{date.getMonth() < 10 ? "0" : ""}{date.getMonth()}/{String(date.getFullYear()).substring(2)}</span>
      </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <span  className={styles.author}>By {post.createdBy} </span>
      </div>
  </Link>;
}

