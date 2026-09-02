"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

import { API_URL, categories, Post } from "../lib/posts";
import SiteHeader, { HeaderLink } from "../components/SiteHeader";

export default function WritePost() {
  const router = useRouter();

  function publishPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const content = String(formData.get("content") || "").trim();
    const timestamp = new Date().toISOString();
    const post: Post = {
      id: crypto.randomUUID(),
      title: String(formData.get("title") || "").trim(),
      excerpt: String(formData.get("excerpt") || "").trim(),
      content,
      category: String(formData.get("category") || "General").trim(),
      date: new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(new Date()),
      readTime: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 180))} min read`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    fetch(`${API_URL}/posts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(post) })
      .then((response) => response.json())
      .then((savedPost) => router.push(`/posts/${savedPost.id}`));
  }

  return (
    <main className={styles.page}>
      <SiteHeader actions={<HeaderLink href="/">Back to archive <span>↗</span></HeaderLink>} />
      <section className={styles.editor}>
        <Link className={styles.backLink} href="/">← Back to archive</Link>
        <p className={styles.eyebrow}>New post</p>
        <form onSubmit={publishPost}>
          <label>Title<input name="title" required placeholder="Give your post a good name" /></label>
          <div className={styles.formRow}>
            <label>Category<select name="category" defaultValue="General">{categories.filter((category) => category !== "All").map((category) => <option value={category} key={category}>{category}</option>)}</select></label>
            <label>Short description<input name="excerpt" required placeholder="What is this post about?" /></label>
          </div>
          <label>Body<textarea name="content" required placeholder="Start writing..."></textarea></label>
          <div className={styles.formFooter}><span>Your post will be saved to the blog database.</span><button type="submit">Publish post <b>↗</b></button></div>
        </form>
      </section>
    </main>
  );
}
