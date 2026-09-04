import Link from "next/link";
import styles from "./page.module.css";

import { categories } from "../lib/posts";
import SiteHeader, { HeaderLink } from "../components/SiteHeader";
import { publishPost } from "../actions/actions";
import {generateCsrfToken} from "../csrf";

export default async function WritePost() {
    const csrfToken = generateCsrfToken();

  return (
    <main className={styles.page}>
      <SiteHeader actions={<HeaderLink href="/">Back to archive </HeaderLink>} />
      <section className={styles.editor}>
        <Link className={styles.backLink} href="/">← Back to archive</Link>
        <h2 className={styles.title}>Write post</h2>
        <form action={publishPost} >
          <label>Title<input name="title" required placeholder="Give your post a good name" /></label>
          <div className={styles.formRow}>
            <label>Category<select name="category" defaultValue="General">{categories.filter((category) => category !== "All").map((category) => <option value={category} key={category}>{category}</option>)}</select></label>
            <label>Short description<input name="excerpt" required placeholder="What is this post about?" /></label>
          </div>
          <label>Body<textarea name="content" required placeholder="Start writing..."></textarea></label>
          <div className={styles.formFooter}><span>Your post will be saved to the blog database.</span><button type="submit">Publish post </button></div>
            <input type="hidden" name="csrfToken" value={csrfToken} />
        </form>
      </section>
    </main>
  );
}
