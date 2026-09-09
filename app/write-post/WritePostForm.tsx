"use client";

import { publishPost } from "../actions/actions";
import ImageInput from "../components/ImageInput";
import { categories } from "../lib/posts";
import styles from './page.module.css';
import { useRouter } from "next/navigation";

export default function WritePostForm({csrfToken}: {csrfToken:string}){
    const router = useRouter();
    return <form onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const res = await publishPost(formData);
        sessionStorage.setItem("pushed","true");
        router.push(`/posts/${res.id}?hideBackLink=true`);
    }}  >
          <label>Title<input name="title" required placeholder="Give your post a good name" /></label>
          <div className={styles.formRow}>
            <label>Category<select name="category" defaultValue="General">{categories.filter((category) => category !== "All").map((category) => <option value={category} key={category}>{category}</option>)}</select></label>
            <label>Short description<input name="excerpt" required placeholder="What is this post about?" /></label>
          </div>
          <label>Body<textarea name="content" required placeholder="Start writing..."></textarea></label>
          <ImageInput></ImageInput>
          <div className={styles.formFooter}><span>Your post will be saved to the blog database.</span><button type="submit">Publish post </button></div>
            <input type="hidden" name="csrfToken" value={csrfToken} />
        </form>
}