import Link from "next/link";
import styles from "./page.module.css";
import { getPost } from "../../lib/posts";
import SiteHeader, { HeaderLink } from "../../components/SiteHeader";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return <main className={styles.state}><h1>Post not found</h1><Link href="/">Return to the blog</Link></main>;
  }

  return (
    <main className={styles.page}>
      <SiteHeader actions={<HeaderLink href="/">Back to archive <span>↗</span></HeaderLink>} />
      <article className={styles.article}>
        <Link className={styles.backLink} href="/">← Back to archive</Link>
        <div className={styles.meta}><span>{post.category}</span><i />{post.date}<i />{post.readTime}</div>
        <h1>{post.title}</h1>
        <p className={styles.lead}>{post.excerpt}</p>
        <div className={styles.body}>{post.content.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <Link className={styles.editLink} href={`/edit-post/${post.id}`}>Edit this post <span>↗</span></Link>
      </article>
    </main>
  );
}
