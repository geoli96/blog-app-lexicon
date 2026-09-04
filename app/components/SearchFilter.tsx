"use client";

import { searchFilters } from "@/app/lib/posts";
import styles from "./SearchFilter.module.css";

export default function CategoryFilter({ selectedSearchFilter }: { selectedSearchFilter: string }) {
  function changeCategory(value: string) {
    const url = new URL(window.location.href);
    if (value === "title") url.searchParams.delete("searchFilter");
    else url.searchParams.set("searchFilter", value);
    url.searchParams.delete("page");
    window.location.assign(url.toString());
  }

  return <label className={styles.searchFilter}>Search by<select defaultValue={selectedSearchFilter} onChange={(event) => changeCategory(event.target.value)} aria-label="Filter posts by category">{searchFilters.map((option) => <option value={option} key={option}>{option[0].toUpperCase()+option.substring(1)}</option>)}</select></label>;
}
