import Link from "next/link";
import { ReactNode } from "react";
import styles from "./SiteHeader.module.css";
import SignOutButton from "./SignOutButton";
import { auth } from "@/auth"

export default async function SiteHeader({ actions }: { actions?: ReactNode }) {
  const session = await auth();
  const user = session?.user;
  const isLoggedIn = !!user;

  return <header className={styles.header}>
    <HeaderLink href="/">Posts</HeaderLink>
    <nav className={styles.actions} aria-label="Main navigation">
      {actions}
      {isLoggedIn ? (
        <HeaderLink href="/write-post" primary>Write post</HeaderLink>
      ) : null}
       {isLoggedIn ? (
        <HeaderLink href="/my-posts">My blog posts</HeaderLink>
      ) : null}
      {isLoggedIn ? (
        <HeaderLink href="/profile">Profile</HeaderLink>
      ) : null}
      {isLoggedIn ? (
        <HeaderLink href="/settings">Settings</HeaderLink>
      ) : null}
      {isLoggedIn ? (
        <p className={styles.signedInAs}>Signed in as <b>{user?.username}</b></p>
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
  return <Link className={(primary ? styles.primaryLink + " " + "primaryLink" : styles.link)} href={href}>{children}</Link>;
}
