"use client"
import { useActionState, useState } from "react"
import styles from "./SignInForm.module.css"
import { authenticate } from "../actions/actions";

export default function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [, formAction, isPending] = useActionState(
    authenticate as any,
    undefined,
  );

  return (
    <form action={formAction} className={styles.form}>
        <div className={styles.formGroup}>
      <label htmlFor="username">
        Username
        </label>
        <input name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
      <label htmlFor="password">
        Password
        </label>
        <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
      <button type="submit" disabled={isPending}>
        {"Sign In"}
      </button>
    </form>
  )
}