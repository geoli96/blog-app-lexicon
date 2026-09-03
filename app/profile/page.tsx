import { auth } from "@/auth";
import ProfileForm from "../components/ProfileForm";
import SiteHeader from "../components/SiteHeader";
import styles from "./page.module.css";
import { SessionProvider } from "next-auth/react";

export default async function ProfilePage() {
    const user = (await auth())?.user;
    const session = await auth();
  return (
    <main className={styles.page}>
      <SiteHeader />
      <section className={styles.content}>
        <p className={styles.eyebrow}>Join the collection</p>
        <h1 className={styles.title}>Profile</h1>
        <p className={styles.intro}>Manage your profile information.</p>
        <SessionProvider session={session}>
            <ProfileForm user={user} />
        </SessionProvider>
      </section>
    </main>
  );
}