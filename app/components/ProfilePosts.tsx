import Link from "next/link";
import styles from "./ProfilePosts.module.css";
import { categories, Post } from "../lib/posts";
import PostActions from "./PostActions";
import SearchForm from "../components/SearchForm";
import CategoryFilter from "../components/CategoryFilter";
import { auth } from "@/auth";
import axios from "axios";
import FollowButton from "./FollowButton";
import BackLink from "./BackLink";

export default async function ProfilePosts({ params, authedUser, username, postsResponse,backLinkVisible }: {backLinkVisible: boolean; authedUser?: {id:number, username:string,name:string} ; params: Record<string, string>; username: string, postsResponse: {
    data: {
        data: Post[];
        items: number;
        pages: number;
    };
} }) {
  const user:any = (await auth())?.user;
  const query = params.search || "";
  const selectedCategory = params.category || "";
  const category = categories.includes(selectedCategory) ? selectedCategory : "";
  const parsedPage = Number.parseInt(params.page || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const isFollowedByUser = Boolean((await axios.get(`http://localhost:4000/follows?followedBy=${user.username}&follow=${username}`)).data[0]);

  const filter = new URLSearchParams({
    _page: String(currentPage),
    _per_page: "6",
    createdBy: username,
  });
  if(category){
    filter.append("category", category);
  }
  if (query) filter.set("title:contains", query);

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
      <section className={styles.content}>
        {backLinkVisible ? <BackLink>← Back to post</BackLink> : null}
        <div className={styles.titleRow}>
          <div><h1>{authedUser?.username === username ? 'My blog posts' : `${username}'s posts`}</h1></div>
          <div className={styles.followButtonContainer}>
          {user && user.username !== username ? <FollowButton isFollowedByUser={isFollowedByUser} username={username}/>: null}
          </div>
        </div>
        <div className={styles.filterControls}>
          <CategoryFilter selectedCategory={category} />
          <SearchForm value={query} action="/my-posts" clearHref={category ? `/my-posts?category=${encodeURIComponent(category)}` : "/my-posts"} />
          </div>
        <p className={styles.count}>{postCount} {postCount === 1 ? "post" : "posts"}</p>
        <div className={styles.postList}>
          {filteredPosts.map((post: Post, index: number) => (
            <div className={styles.post} key={post.id}>
              <img src={post.imageUrl} className={`${styles.image} ${index % 2 === 0 ? styles.coral : styles.green}`}></img>
              <Link className={styles.postInfo} href={authedUser?.username === username ? `/my-posts/${post.id}`: `/user/${post.createdBy}/post/${post.id}`}><div className={styles.meta}><span>{post.category}</span><span>{post.date}</span></div><h2>{post.title}</h2><p>{post.excerpt}</p></Link>
              {authedUser?.username === username ? 
              <PostActions id={post.id} title={post.title} />
              : null}
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
  );
}