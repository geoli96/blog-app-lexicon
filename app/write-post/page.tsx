import styles from "./page.module.css";

import SiteHeader, { HeaderLink } from "../components/SiteHeader";
import {generateCsrfToken} from "../csrf";
import WritePostForm from "./WritePostForm";

export default async function WritePost() {
    const csrfToken = generateCsrfToken();

  return (
    <main className={styles.page}>
      <SiteHeader />
      <section className={styles.editor}>
        <h2 className={styles.title}>Write post</h2>
        <WritePostForm csrfToken={csrfToken}/>
      </section>
    </main>
  );
}
