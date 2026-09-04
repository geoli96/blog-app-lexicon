"use client"
import { useState } from "react"
import styles from "./RegisterForm.module.css"
import { createUser } from "../actions/actions";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [completedRegistration, setCompletedRegistration] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    setErrorMsg("")
    e.preventDefault();
    if(password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      setSaving(true);
      await new Promise(res => setTimeout(() => res(null), 4000));
      await createUser(formData);
      setCompletedRegistration(true); 
    } catch (error) {
      console.error(error);
      setErrorMsg("Error occured while creating user")
    } finally{
      setSaving(false)
    }
  }

  if(completedRegistration) {
    return (
      <div >
        <p>Registration Successful!</p>
        <a href="/login" className={styles.loginLink}>
          Click here to login
        </a>
      </div>
    );
  }

  return (
    <>
    <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
      <label htmlFor="username">
        Username
        </label>
        <input name="username" minLength={2} maxLength={100} type="text" value={username} onChange={(e) => setUsername(e.target.value.trim())} required />
        </div>
        <div className={styles.formGroup}>
      <label htmlFor="password">
        Password
        </label>
        <input name="password" minLength={6} maxLength={100} type="password" value={password} onChange={(e) => setPassword(e.target.value.trim())} required />
        </div>
        <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">
        Confirm Password
        </label>
        <input name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value.trim())} required />
        </div>
        {errorMsg && (
            <>
              <p className={styles.error}>{errorMsg}</p>
            </>
          )}
          {!errorMsg && (
            <>
              <p className={styles.errorHidden}></p>
            </>
          )}
      <button type="submit" disabled={saving}>{saving ? "Saving" : "Register"}</button>
    </form>
      <p className={styles.switchPrompt}>
          Already have an account? <a href="/login">Log in</a>
        </p>
    </>
  )
}