import Link from "next/link";
import { getPost } from "../../lib/posts";
import SiteHeader from "../../components/SiteHeader";
import styles from "./page.module.css";
import { auth } from "@/auth";
import BackLink from "@/app/components/BackLink";

export default async function MyPost({ params }: { params: Promise<{ id: string }> }) {
  const user:any = (await auth())?.user;
  const { id } = await params;
  const post = await getPost(id);

  if (!post) return <main className={styles.state}><h1>Post not found</h1><Link href="/my-posts">Return to my posts</Link></main>;

  return <main className={styles.page}>
    <SiteHeader />
    <article className={styles.article}>
      <BackLink>← Back to my posts</BackLink>
      <div className={styles.meta}><span>{post.category}</span><i />{post.date}<i />{post.readTime}<span>By {post.createdBy}</span></div>
      <h1>{post.title}</h1>
      <p className={styles.lead}>{post.excerpt}</p>
      <div className={styles.body}>{post.content.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      {user?.username === post.createdBy ? (
        <Link className={styles.editLink} href={`/my-posts/${post.id}/edit`}>Edit this post </Link>
      ) : null}
    </article>
  </main>;
}
