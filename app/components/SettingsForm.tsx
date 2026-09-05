"use client"
import { useState } from "react"
import styles from "./SettingsForm.module.css"
import { updatePassword } from "../actions/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileForm({user}: {user: any}) {
  const router = useRouter();
  const {update} = useSession();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if(newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      await updatePassword(formData);
      await update(null);
      router.refresh();
      alert("Password updated successfully!"); 
    } catch (error) {
      if(error instanceof Error){
      console.log(error)
      setErrorMessage(error.message)}
    }
  }

  return (
    <div className={styles.container}>
    <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Change password</h2>
        <div className={styles.formGroup}>
     <label htmlFor="password">
        PASSWORD
        </label>
        <input name="password" minLength={6} maxLength={100} type="password" 
        value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
     <label htmlFor="password">
        NEW PASSWORD
        </label>
        <input name="newpassword" minLength={6} maxLength={100} type="password"
         value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
     <label htmlFor="password">
        CONFIRM NEW PASSWORD
        </label>
        <input name="confirmpassword" minLength={6} maxLength={100} type="password"
         value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        {errorMessage && (
            <>
              <p className={styles.error}>{errorMessage}</p>
            </>
          )}
          {(!errorMessage) && (
            <>
              <p className={styles.errorHidden}></p>
            </>
          )}
      <button type="submit">Change password</button>
    </form>
    </div>
  )
}