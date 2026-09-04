import {  categories, Post } from "../../lib/posts";
import styles from "./page.module.css";
import { updatePost } from "../../actions/actions";

export default function EditForm({ post, returnTo = `/posts/${post.id}` }: { post: Post; returnTo?: string }) {
  return<><h2 className={styles.title}>{post.title}</h2><form action={updatePost}>
    <input type="hidden" name="id" value={post.id} />
    <label>Title<input name="title" required defaultValue={post.title} /></label>
    <div className={styles.formRow}><label>Category<select name="category" defaultValue={post.category}>{!categories.includes(post.category) && <option value={post.category}>{post.category}</option>}{categories.filter((category) => category !== "All").map((category) => <option value={category} key={category}>{category}</option>)}</select></label><label>Short description<input name="excerpt" required defaultValue={post.excerpt} /></label></div>
    <label>Body<textarea name="content" required defaultValue={post.content}></textarea></label>
    <div className={styles.formFooter}><span>Originally published {post.date}.</span><button type="submit">Save changes <b>↗</b></button></div>
    <input type="hidden" name="createdBy" value={post.createdBy} />
    <input type="hidden" name="createdAt" value={post.createdAt} />
    <input type="hidden" name="date" value={post.date} />
  </form> </>;
}
