import Link from "next/link";
import { ReactNode } from "react";
import styles from "./SiteHeader.module.css";
import SignOutButton from "./SignOutButton";
import { auth } from "@/auth"

export default async function SiteHeader({ actions }: { actions?: ReactNode }) {
  const session: any = await auth();
  const isLoggedIn = !!session?.user;

  return <header className={styles.header}>
    <Link className={styles.wordmark} href="/" aria-label="Back to the blog">
      <span className={styles.mark}>tb</span>
      <span>the blog</span>
    </Link>
    <nav className={styles.actions} aria-label="Main navigation">
      {actions}
      {isLoggedIn ? (
        <HeaderLink href="/write-post" primary>Write a post <b>+</b></HeaderLink>
      ) : null}
       {isLoggedIn ? (
        <HeaderLink href="/my-posts">My blog posts</HeaderLink>
      ) : null}
      {isLoggedIn ? (
        <HeaderLink href="/profile">Profile</HeaderLink>
      ) : null}
      {isLoggedIn ? (
        <p className={styles.signedInAs}>Signed in as <b>{session?.user?.username}</b></p>
      ) : null}
      {isLoggedIn ? (
        <SignOutButton />
      ) : (
        <>
          <HeaderLink href="/register">Register</HeaderLink>
          <HeaderLink href="/login">Login</HeaderLink>
        </>
      )}
    </nav>
  </header>;
}

export function HeaderLink({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  return <Link className={primary ? styles.primaryLink : styles.link} href={href}>{children}</Link>;
}
