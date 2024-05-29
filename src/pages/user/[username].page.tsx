import { Post } from "../../components/Post";
import { PublicLayoutFrontend } from "../../layouts/public.client";
import { PublicLayoutBackend } from "../../layouts/public.server";
import { Cleanse, DTOs } from "../../utils/Cleanse";
import { db } from "../../utils/prisma";
import styles from "./[username].module.scss";

interface Props {
  user: DTOs["user"];
  posts: DTOs["post"][];
}

export default PublicLayoutFrontend.use<Props>(({ user, posts }) => {
  return {
    seo: { title: `${user.username}'s profile` },
    children: (
      <div>
        <h1>{user.username}'s posts</h1>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Post post={post} key={post.uuid} />
          ))}
        </div>
      </div>
    ),
  };
});

export const getServerSideProps = PublicLayoutBackend.use<Props>({
  layoutGsspOptions: { mustBeLoggedIn: false },
  async getServerSideProps(ctx) {
    const username = ctx.params.username;
    if (typeof username !== "string") throw new Error("expected username to be string");
    const user = await db.user.findUnique({ where: { username } });

    if (!user) throw new Error("user not found");

    const posts = await db.post.findMany({
      where: { author: { username } },
      include: { author: true },
    });

    return { props: { user: Cleanse.user(user), posts: posts.map((post) => Cleanse.post(post)) } };
  },
});
