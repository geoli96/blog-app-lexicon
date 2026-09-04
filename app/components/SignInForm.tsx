"use client"
import { useActionState, useEffect, useState } from "react"
import styles from "./SignInForm.module.css"
import { authenticate } from "../actions/actions";
import {useRouter} from "next/navigation";

export default function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [errorMessage, formAction, isPending] = useActionState(
    authenticate as any,
    undefined,
  );

  useEffect(() => {
    if(errorMessage === "success"){
      router.push("/");
  }
  })

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
        {errorMessage && errorMessage !== "success" && (
            <>
              <p className={styles.error}>{errorMessage}</p>
            </>
          )}
          {(!errorMessage || errorMessage === "success") && (
            <>
              <p className={styles.errorHidden}></p>
            </>
          )}
      <button type="submit" disabled={isPending}>
        {"Sign In"}
      </button>
    </form>
  )
}