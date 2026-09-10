"use client";

import { searchFilters, searchFilterLabelMapper } from "@/app/lib/posts";
import styles from "./SearchFilter.module.css";
import { useRouter } from "next/navigation";

export default function CategoryFilter({ selectedSearchFilter }: { selectedSearchFilter: string }) {
  const router = useRouter()
  function changeCategory(value: string) {
    const url = new URL(window.location.href);
    if (value === "title") url.searchParams.delete("searchFilter");
    else url.searchParams.set("searchFilter", value);
    url.searchParams.delete("page");
    router.push(url.toString());
  }

  return <label htmlFor="search-filter" className={styles.searchFilter}>Search by<select id="search-filter" defaultValue={selectedSearchFilter} onChange={(event) => changeCategory(event.target.value)} aria-label="Filter posts by category">{searchFilters.map((option) => <option value={option} key={option}>{searchFilterLabelMapper[option]}</option>)}</select></label>;
}
