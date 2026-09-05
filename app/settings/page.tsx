import { auth } from "@/auth";
import ProfileForm from "../components/ProfileForm";
import SiteHeader from "../components/SiteHeader";
import styles from "./page.module.css";
import { SessionProvider } from "next-auth/react";
import SettingsForm from "../components/SettingsForm";

export default async function SettingsPage() {
    const user = (await auth())?.user;
    const session = await auth();
  return (
    <main className={styles.page}>
      <SiteHeader />
      <section className={styles.content}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.intro}>Manage your settings.</p>
        <SessionProvider session={session}>
            <SettingsForm user={user} />
        </SessionProvider>
      </section>
    </main>
  );
}