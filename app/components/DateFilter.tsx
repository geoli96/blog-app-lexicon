"use client";

import { dateFilterLabelMapper, dateFilters } from "@/app/lib/posts";
import styles from "./DateFilter.module.css";
import { useRouter } from "next/navigation";

export default function DateFilter({ dateFilter }: { dateFilter: string }) {
  const router = useRouter()
  function changeDateFilter(value: string) {
    const url = new URL(window.location.href);
    if (value === "all-time") url.searchParams.delete("dateFilter");
    else url.searchParams.set("dateFilter", value);
    url.searchParams.delete("page");
    router.push(url.toString());
  }

  return <label key={dateFilter || "all-time"} htmlFor="category-select" className={styles.dateFilter}>Publish date
        <select id="category-select" name="category-select" key={dateFilter} 
        defaultValue={dateFilter || "all-time"} onChange={(event) => changeDateFilter(event.target.value)}
        aria-label="Filter posts by category">{dateFilters.map((option) => <option value={option} key={option}>{dateFilterLabelMapper[option]}</option>)}
        </select>
   </label>;
}
