"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { API_URL, categories, Post } from "../../lib/posts";
import styles from "./page.module.css";

export default function EditForm({ post, returnTo = `/posts/${post.id}` }: { post: Post; returnTo?: string }) {
  const router = useRouter();

  function updatePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const content = String(formData.get("content") || "").trim();
    const updatedPost = {
      ...post,
      title: String(formData.get("title") || "").trim(),
      excerpt: String(formData.get("excerpt") || "").trim(),
      content,
      category: String(formData.get("category") || "General").trim(),
      readTime: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 180))} min read`,
      updatedAt: new Date().toISOString(),
    };
    fetch(`${API_URL}/posts/${post.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatedPost) })
      .then(() => router.push(returnTo));
  }

  return <form onSubmit={updatePost}>
    <label>Title<input name="title" required defaultValue={post.title} /></label>
    <div className={styles.formRow}><label>Category<select name="category" defaultValue={post.category}>{!categories.includes(post.category) && <option value={post.category}>{post.category}</option>}{categories.filter((category) => category !== "All").map((category) => <option value={category} key={category}>{category}</option>)}</select></label><label>Short description<input name="excerpt" required defaultValue={post.excerpt} /></label></div>
    <label>Body<textarea name="content" required defaultValue={post.content}></textarea></label>
    <div className={styles.formFooter}><span>Originally published {post.date}.</span><button type="submit">Save changes <b>↗</b></button></div>
  </form>;
}
