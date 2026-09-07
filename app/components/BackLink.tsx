"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./BackLink.module.css";

export default function BackLink({ fallback = "/", children = "← Back" }: { fallback?: string; children?: ReactNode }) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true);
  },[])

  if(!loaded) return <div className={styles.emptyLink} ></div>;

  function goBack() {
    if (window.history.length > 1){
      router.back();
    }
    else{ 
      router.push(fallback);
    }
  }

  return <button className={styles.link} onClick={goBack}>{children}</button>;
}
