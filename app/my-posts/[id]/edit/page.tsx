import Link from "next/link";
import { getPost } from "../../../lib/posts";
import EditForm from "../../../edit-post/[id]/EditForm";
import SiteHeader, { HeaderLink } from "../../../components/SiteHeader";
import styles from "../../../edit-post/[id]/page.module.css";

export default async function EditMyPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) return <main className={styles.state}><h1>Post not found</h1><Link href="/my-posts">Return to my posts</Link></main>;

  return <main className={styles.page}>
    <SiteHeader  />
    <section className={styles.editor}>
      <Link className={styles.backLink} href={`/my-posts/${id}`}>← Back to post</Link>
      <EditForm post={post} returnTo={`/my-posts/${id}`} />
    </section>
  </main>;
}
