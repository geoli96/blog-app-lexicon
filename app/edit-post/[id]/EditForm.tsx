"use client"

import {  categories, Post } from "../../lib/posts";
import styles from "./page.module.css";
import { updatePost } from "../../actions/actions";
import ImageInput from "@/app/components/ImageInput";
import { useRouter } from "next/navigation";

export default function EditForm({ post}: { post: Post;}) {
  const router = useRouter();
  return<><h2 className={styles.title}>{post.title}</h2><form onSubmit={async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)
    await updatePost(formData);
    router.back();
  }}>
    <input type="hidden" name="id" value={post.id} />
    <label htmlFor="title">Title<input id="title" name="title" required defaultValue={post.title} /></label>
    <div className={styles.formRow}><label htmlFor="category">Category<select id="category" name="category" defaultValue={post.category}>{!categories.includes(post.category) && <option value={post.category}>{post.category}</option>}{categories.filter((category) => category !== "All").map((category) => <option value={category} key={category}>{category}</option>)}</select></label><label>Short description<input name="excerpt" required defaultValue={post.excerpt} /></label></div>
    <label htmlFor="content">Body<textarea id="content" name="content" required defaultValue={post.content}></textarea></label>
    <ImageInput imgUrl={post.imageUrl} imgCaption={post.imageCaption}/>
    <div className={styles.formFooter}><span>Originally published {post.date}.</span><button type="submit">Save changes </button></div>
    <input type="hidden" name="createdBy" value={post.createdBy} />
    <input type="hidden" name="createdAt" value={post.createdAt} />
    <input type="hidden" name="date" value={post.date} />
  </form> </>;
}
