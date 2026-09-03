"use client"
import { useState } from "react"
import styles from "./RegisterForm.module.css"
import { createUser } from "../actions/actions";

export default function RegisterForm({user}: {user?: any}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [completedRegistration, setCompletedRegistration] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!username || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if(password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    const formData = new FormData(e.target as HTMLFormElement);
    await createUser(formData);
    setCompletedRegistration(true);
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
        <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">
        Confirm Password
        </label>
        <input name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
      <button type="submit">Register</button>
    </form>
  )
}