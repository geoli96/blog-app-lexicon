"use client";

import { categories } from "@/app/lib/posts";
import styles from "./CategoryFilter.module.css";

export default function CategoryFilter({ selectedCategory }: { selectedCategory: string }) {
  function changeCategory(value: string) {
    const url = new URL(window.location.href);
    if (value === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", value);
    url.searchParams.delete("page");
    window.location.assign(url.toString());
  }

  return <label className={styles.categoryFilter}>Category<select defaultValue={selectedCategory} onChange={(event) => changeCategory(event.target.value)} aria-label="Filter posts by category">{categories.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>;
}
