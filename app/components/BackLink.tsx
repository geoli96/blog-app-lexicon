"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import styles from "./BackLink.module.css";

export default function BackLink({ fallback = "/my-posts", children = "← Back" }: { fallback?: string; children?: ReactNode }) {
  const router = useRouter();


  function goBack() {
    if (window.history.length > 1){
      router.back();
    }
    else{ 
      router.push(fallback);
    }
  }

  return <button className={styles.link} onClick={goBack}>wedwe{children}</button>;
}
