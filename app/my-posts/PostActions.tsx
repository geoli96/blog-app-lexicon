"use client";

import { useRouter } from "next/navigation";
import { API_URL } from "../lib/posts";
import styles from "./page.module.css";

export default function PostActions({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  async function deletePost() {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    await fetch(`${API_URL}/posts/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return <div className={styles.actions}><button onClick={deletePost} aria-label={`Delete ${title}`}>Delete</button></div>;
}
