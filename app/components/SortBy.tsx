"use client";

import { sortKeyMapper, sortKeys } from "@/app/lib/posts";
import styles from "./CategoryFilter.module.css";
import { useRouter } from "next/navigation";

export default function SortBy({ selectedSort = "-dateInMs", _sortKeys }: { selectedSort: string; _sortKeys?: string[] }) {
  const router = useRouter()
  function changeSort(value: string) {
    const url = new URL(window.location.href);
    if (value === "-dateInMs") url.searchParams.delete("sortBy");
    else url.searchParams.set("sortBy", value);
    url.searchParams.delete("page");
    router.push(url.toString());
  }

  return <label htmlFor="sort-by" className={styles.categoryFilter}>Sort by<select id="sort-by" key={selectedSort} defaultValue={selectedSort} onChange={(event) => changeSort(event.target.value)} aria-label="Sort posts by attribute">{(_sortKeys || sortKeys).map((sortKey) => <option value={sortKey} key={sortKey}>{sortKeyMapper[sortKey]}</option>)}</select></label>;
}
