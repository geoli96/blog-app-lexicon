"use client"
import { useState } from "react"
import styles from "./ProfileForm.module.css"
import { updateUser } from "../actions/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileForm({user}: {user: any}) {
  const router = useRouter();
  const {update} = useSession();
  const [username, setUsername] = useState(user.username || "");
  const [name, setName] = useState(user.name || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!username) {
      alert("Please fill in all fields.");
      return;
    }
    const formData = new FormData(e.target as HTMLFormElement);
    await updateUser(formData);
    await update(null);
    router.refresh();
    alert("Profile updated successfully!");
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
      <label htmlFor="name">
        Name
        </label>
        <input name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
      <button type="submit">Update Profile</button>
    </form>
  )
}