import RegisterForm from "../components/RegisterForm";
import SiteHeader from "../components/SiteHeader";
import styles from "./page.module.css";

export default async function RegisterPage() {
  return (
    <main className={styles.page}>
      <SiteHeader />
      <section className={styles.content}>
        <p className={styles.eyebrow}>Join the collection</p>
        <h1 className={styles.title}>Register</h1>
        <p className={styles.intro}>Make a little room for your words.</p>
        <RegisterForm />
        <p className={styles.switchPrompt}>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </section>
    </main>
  );
}