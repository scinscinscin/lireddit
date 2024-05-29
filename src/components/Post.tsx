import Link from "next/link";
import { DTOs } from "../utils/Cleanse";
import styles from "./Post.module.scss";
import { formatRelative } from "date-fns";

export function Post({ post }: { post: DTOs["post"] }) {
  return (
    <div className={styles.post}>
      <div className={styles.top}>
        <Link href={"/user/" + post.author.username}>{post.author.username}</Link>
        <p>{formatRelative(new Date(post.createdAt), new Date())}</p>
      </div>

      <main className={styles.main}>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
      </main>

      <footer className={styles.footer}>
        <Link href={"/post/" + post.uuid}>View Post</Link>
      </footer>
    </div>
  );
}
