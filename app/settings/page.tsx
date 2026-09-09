import { auth } from "@/auth";
import SiteHeader from "../components/SiteHeader";
import styles from "./page.module.css";
import { SessionProvider } from "next-auth/react";
import SettingsForm from "../components/SettingsForm";

export default async function SettingsPage() {
    const user = (await auth())?.user;
    if(!user){
      return <main className={styles.page}><h1>Not signed in</h1></main>  
    }
    const session = await auth();
  return (
    <main className={styles.page}>
      <SiteHeader />
      <section className={styles.content}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.intro}>Manage your settings.</p>
        <SessionProvider session={session}>
            <SettingsForm />
        </SessionProvider>
      </section>
    </main>
  );
}