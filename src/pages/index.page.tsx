import { PublicLayoutFrontend } from "../layouts/public.client";
import { PublicLayoutBackend } from "../layouts/public.server";

import styles from "./index.module.scss";
import { Cleanse, DTOs } from "../utils/Cleanse";
import Link from "next/link";
import { db } from "../utils/prisma";
import { Post } from "../components/Post";

interface PageProps {
  posts: DTOs["post"][];
}

export default PublicLayoutFrontend.use<PageProps>(({ posts }) => {
  return {
    seo: { title: "Home" },
    children: (
      <div>
        <header className={styles.header}>{}</header>
        {posts.length == 0 ? (
          <div className={styles.empty}>
            <h3>
              No posts yet. <Link href="/post/create">Create one.</Link>
            </h3>
          </div>
        ) : (
          <div className={styles.posts}>
            {posts.map((post) => (
              <Post post={post} key={post.uuid} />
            ))}
          </div>
        )}
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
