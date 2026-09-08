import Link from "next/link";
import styles from "./page.module.css";
import { getPost } from "../../lib/posts";
import SiteHeader, { HeaderLink } from "../../components/SiteHeader";
import { auth } from "@/auth";
import BackLink from "@/app/components/BackLink";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const user:any = (await auth())?.user;
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return <main className={styles.state}><h1>Post not found</h1><Link href="/">Return to the blog</Link></main>;
  }

  return (
    <main className={styles.page}>
      <SiteHeader />
      <article className={styles.article}>
        <BackLink>← Back to archive</BackLink>
        <div className={styles.meta}><span>{post.category}</span><i />{post.date}<i />{post.readTime}<span>By {post.createdBy}</span></div>
        <h1>{post.title}</h1>
        <p className={styles.lead}>{post.excerpt}</p>
        <figure>
          <img className={styles.image} src={post.imageUrl}/>
          <figcaption>{post.imageCaption}</figcaption>
          </figure>
        <div className={styles.body}>{post.content.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        {user?.username === post.createdBy ? (
          <Link className={styles.editLink} href={`/edit-post/${post.id}`}>Edit this post </Link>
        ) : <Link className={styles.editLink} href={`/user/${post.createdBy}`}>By {post.createdBy}</Link>}
      </article>
    </main>
  );
}
