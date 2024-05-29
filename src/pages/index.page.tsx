import { PublicLayoutFrontend } from "../layouts/public.client";
import { PublicLayoutBackend } from "../layouts/public.server";

import { Button } from "../components/Button";
import styles from "./index.module.scss";
import { Cleanse, DTOs } from "../utils/Cleanse";
import Link from "next/link";
import { db } from "../utils/prisma";
import { format, formatRelative } from "date-fns";
import { useRouter } from "next/router";

interface PageProps {
  posts: DTOs["post"][];
}

function Post({ post }: { post: DTOs["post"] }) {
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

export default PublicLayoutFrontend.use<PageProps>(({ posts }) => {
  return {
    children: (
      <div>
        <header className={styles.header}>{}</header>
        <div className={styles.posts}>
          {posts.length == 0 ? (
            <div className={styles.empty}>
              <h3>
                No posts yet. <Link href="/post/create">Create one.</Link>
              </h3>
            </div>
          ) : (
            posts.map((post) => <Post post={post} />)
          )}
        </div>
      </div>
    ),
  };
});

export const getServerSideProps = PublicLayoutBackend.use<PageProps>({
  layoutGsspOptions: { mustBeLoggedIn: false },
  async getServerSideProps(ctx) {
    const posts = await db.post.findMany({
      include: { author: true },
    });

    return { props: { posts: posts.map((post) => Cleanse.post(post)) } };
  },
});
