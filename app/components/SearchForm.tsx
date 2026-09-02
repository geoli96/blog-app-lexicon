import styles from "./SearchForm.module.css";
import Link from "next/link";

export default function SearchForm({ value, action, clearHref = action, hiddenFields = {} }: { value: string; action: string; clearHref?: string; hiddenFields?: Record<string, string> }) {
  return <form className={styles.search} method="get" action={action}>
    <span aria-hidden="true">⌕</span>
    <input name="search" defaultValue={value} placeholder="Search posts" aria-label="Search posts" />
    {Object.entries(hiddenFields).map(([name, fieldValue]) => <input type="hidden" name={name} value={fieldValue} key={name} />)}
    <button type="submit">Search</button>
    {value && <Link className={styles.clear} href={clearHref}>Clear</Link>}
  </form>;
}
