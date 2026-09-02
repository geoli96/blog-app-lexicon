import SignInForm from "../components/SignInForm";
import SiteHeader from "../components/SiteHeader";
import styles from "./page.module.css";

export default async function LoginPage() {
  return (
    <main className={styles.page}>
        <SiteHeader  />
        <section className={styles.content}>
      <h1 className={styles.title}>Login</h1>
      <SignInForm />
      </section>
    </main>
  );
}