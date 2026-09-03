"use client";

import { signOut } from "next-auth/react";
import styles from "./SiteHeader.module.css";

export default function SignOutButton() {
  return (
    <a className={styles.link} type="button" onClick={() => signOut({ redirectTo: "/" })}>
      Sign out
    </a>
  );
}
