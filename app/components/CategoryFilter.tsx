"use client";

import { categories } from "@/app/lib/posts";
import styles from "./CategoryFilter.module.css";
import { useRouter } from "next/navigation";

export default function CategoryFilter({ selectedCategory }: { selectedCategory: string }) {
  const router = useRouter()
  function changeCategory(value: string) {
    const url = new URL(window.location.href);
    if (value === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", value);
    url.searchParams.delete("page");
    router.push(url.toString());
  }

  return <label htmlFor="category-select" className={styles.categoryFilter}>Category<select id="category-select" name="category-select" key={selectedCategory} defaultValue={selectedCategory} onChange={(event) => changeCategory(event.target.value)} aria-label="Filter posts by category">{categories.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>;
}
