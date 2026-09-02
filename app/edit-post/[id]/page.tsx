import Link from "next/link";
import { getPost } from "../../lib/posts";
import EditForm from "./EditForm";
import styles from "./page.module.css";
import SiteHeader, { HeaderLink } from "../../components/SiteHeader";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) return <main className={styles.state}><h1>Post not found</h1><Link href="/my-posts">Return to my posts</Link></main>;

  return <main className={styles.page}>
    <SiteHeader actions={<HeaderLink href="/my-posts">My blog posts <span>↗</span></HeaderLink>} />
    <section className={styles.editor}>
      <Link className={styles.backLink} href={`/posts/${post.id}`}>← Back to post</Link>
      <EditForm post={post} />
    </section>
  </main>;
}
