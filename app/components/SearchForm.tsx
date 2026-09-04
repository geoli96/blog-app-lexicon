"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./SearchForm.module.css";
import Link from "next/link";

export default function SearchForm({ value, action, clearHref = action, hiddenFields = {} }: { value: string; action: string; clearHref?: string; hiddenFields?: Record<string, string> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearParams = new URLSearchParams(searchParams);
  clearParams.delete("search");
  return <div className={styles.search} >
    <span aria-hidden="true">⌕</span>
    <input key={value} id="search" name="search" defaultValue={value} placeholder="Search posts" aria-label="Search posts" />
    {Object.entries(hiddenFields).map(([name, fieldValue]) => <input type="hidden" name={name} value={fieldValue} key={name} />)}
    <button onClick={() => {
      const value = (document.getElementById("search") as HTMLInputElement)!.value;
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("page");
      if(value){
        nextParams.set("search", value);
      }else{
        nextParams.delete("search");
      }
      router.push(action + (nextParams.size ? "?" + nextParams.toString() : ""), {scroll:false})
    }
    } type="submit">Search</button>
    {value && <Link scroll={false} className={styles.clear} href={clearHref + (clearParams.size ? "?" + clearParams.toString() : "")}>Clear</Link>}
  </div>;
}
