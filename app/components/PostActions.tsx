"use client";

import { useRouter } from "next/navigation";
import styles from "./PostActions.module.css";
import { deletePost } from "../actions/actions";

export default function PostActions({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  async function confirmDeletion() {
    if (!window.confirm(`Delete ${title}?`)) return;
    await deletePost(id);
    router.refresh();
  }

  return <div className={styles.actions}><button onClick={confirmDeletion} aria-label={`Delete ${title}`}>Delete</button></div>;
}
