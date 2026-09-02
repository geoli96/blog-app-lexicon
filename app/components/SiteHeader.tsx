import Link from "next/link";
import { ReactNode } from "react";
import styles from "./SiteHeader.module.css";

export default function SiteHeader({ actions }: { actions: ReactNode }) {
  return <header className={styles.header}>
    <Link className={styles.wordmark} href="/" aria-label="Back to the blog">
      <span className={styles.mark}>tb</span>
      <span>the blog</span>
    </Link>
    <nav className={styles.actions} aria-label="Main navigation">{actions}</nav>
  </header>;
}

export function HeaderLink({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  return <Link className={primary ? styles.primaryLink : styles.link} href={href}>{children}</Link>;
}
