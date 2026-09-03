import SignInForm from "../components/SignInForm";
import SiteHeader from "../components/SiteHeader";
import styles from "./page.module.css";

export default async function LoginPage() {
  return (
    <main className={styles.page}>
      <SiteHeader />
      <section className={styles.content}>
        <p className={styles.eyebrow}>Welcome back</p>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.intro}>Pick up where you left off.</p>
        <SignInForm />
        <p className={styles.switchPrompt}>
          New here? <a href="/register">Create an account</a>
        </p>
      </section>
    </main>
  );
}