"use client"
import { useState } from "react"
import styles from "./ProfileForm.module.css"
import { updateUser } from "../actions/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "next-auth";

export default function ProfileForm({user}: {user: User}) {
  const router = useRouter();
  const {update} = useSession();
  const [name, setName] = useState(user.name || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const darkmode = formData.get("darkmode");
    await updateUser(formData);
    if(darkmode){
      localStorage.setItem("darkmode", "true");
      document.getElementsByTagName("html")[0].classList.add("dark-mode-html");
    }else{
      localStorage.removeItem("darkmode");
      document.getElementsByTagName("html")[0].classList.remove("dark-mode-html");
    }

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
        <input id="username" className={styles.username} name="username" type="text" value={user.username} disabled/>
        </div>
        <div className={styles.formGroup}>
      <label htmlFor="name">
        Name
        </label>
        <input name="name" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
      <label htmlFor="darkmode">
        Dark mode
        </label>
        <div className={styles.darkmodeInputContainer}>
        <span>Enable</span>
        <input name="darkmode" defaultChecked={user.darkmode === "true" ? true : false} id="darkmode" type="checkbox"/>
        </div>
        </div>
      <button className="primary-button" type="submit">Update profile</button>
    </form>
  )
}