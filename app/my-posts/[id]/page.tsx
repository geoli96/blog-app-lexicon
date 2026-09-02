import Link from "next/link";
import { getPost } from "../../lib/posts";
import SiteHeader, { HeaderLink } from "../../components/SiteHeader";
import styles from "./page.module.css";

export default async function MyPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) return <main className={styles.state}><h1>Post not found</h1><Link href="/my-posts">Return to my posts</Link></main>;

  return <main className={styles.page}>
    <SiteHeader actions={<HeaderLink href="/my-posts">My blog posts <span>↗</span></HeaderLink>} />
    <article className={styles.article}>
      <Link className={styles.backLink} href="/my-posts">← Back to my posts</Link>
      <div className={styles.meta}><span>{post.category}</span><i />{post.date}<i />{post.readTime}</div>
      <h1>{post.title}</h1>
      <p className={styles.lead}>{post.excerpt}</p>
      <div className={styles.body}>{post.content.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <Link className={styles.editLink} href={`/my-posts/${post.id}/edit`}>Edit this post <span>↗</span></Link>
    </article>
  </main>;
}
