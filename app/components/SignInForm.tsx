"use client"
import { useState } from "react"
import styles from "./SignInForm.module.css"

export default function SignInForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
      <button type="submit">Sign In</button>
    </form>
  )
}