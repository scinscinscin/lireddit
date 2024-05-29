import { PublicLayoutFrontend } from "../../layouts/public.client";
import { PublicLayoutBackend } from "../../layouts/public.server";
import { Cleanse, DTOs } from "../../utils/Cleanse";
import { db } from "../../utils/prisma";
import styles from "./[uuid].module.scss";
import common from "../common.module.scss";
import { cn } from "../../utils/cn";
import { useForm } from "react-hook-form";
import { Button } from "../../components/Button";
import { client } from "../../utils/apiClient";
import { useState } from "react";
import { toast } from "react-toastify";
import { formatRelative } from "date-fns";
import Link from "next/link";
import { Router } from "express";
import { useRouter } from "next/router";

interface Props {
  post: DTOs["post"];
  comments: DTOs["comment"][];
}

function Comment({ comment }: { comment: DTOs["comment"] }) {
  return (
    <div className={styles.comment}>
      <div className={styles.comment_author}>
        <Link href={"/user/" + comment.user.username}>{comment.user.username}</Link>
        <p>{formatRelative(comment.createdAt, Date.now())}</p>
      </div>
      <p>{comment.content}</p>
    </div>
  );
}

export default PublicLayoutFrontend.use<Props>(({ post, comments: _comments, user }) => {
  const router = useRouter();
  const Form = useForm<{ content: string }>();
  const [comments, setComments] = useState(_comments);

  async function submitComment(data: { content: string }) {
    try {
      if (user == null) {
        toast.error("You need to be logged in to comment");
        setTimeout(() => router.push(`"/login?redirect=/post/${post.uuid}`), 3000);
      }
      const { newComment } = await client["/post"]["/:uuid/comment"].post({ body: data, path: { uuid: post.uuid } });
      setComments([...comments, newComment]);
    } catch {
      toast.error("Failed to create comment");
    } finally {
      Form.reset({});
    }
  }

  return {
    children: (
      <div>
        <header className={styles.header}>
          <Link href="/user/[username]" as={"/user/" + post.author.username}>
            {post.author.username}
          </Link>

          <p>{formatRelative(post.createdAt, Date.now())}</p>
        </header>

        <article className={styles.article}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>

        <div className={styles.comments_container}>
          <h2>Comments</h2>

          <form className={cn(common.form, styles.comment_form)} onSubmit={Form.handleSubmit(submitComment)}>
            <textarea {...Form.register("content", { required: true })} placeholder="Write a comment" />
            <Button.Default onClick="submit">Submit Comment</Button.Default>
          </form>

          {comments.length === 0 ? (
            <p className={styles.cta}>No comments yet. Submit one to start the conversation.</p>
          ) : (
            <div className={styles.comments}>
              {comments.map((c) => (
                <Comment comment={c} key={c.uuid} />
              ))}
            </div>
          )}
        </div>
      </div>
    ),
  };
});

export const getServerSideProps = PublicLayoutBackend.use<Props>({
  layoutGsspOptions: { mustBeLoggedIn: false },
  async getServerSideProps(ctx) {
    const uuid = ctx.params.uuid;
    if (typeof uuid !== "string") return { notFound: true };

    const post = await db.post.findUnique({
      where: { uuid },
      include: {
        author: true,
        comments: { include: { author: true } },
      },
    });

    if (!post) return { notFound: true };

    return {
      props: {
        post: Cleanse.post(post),
        comments: post.comments.map((c) => Cleanse.comment(c)),
      },
    };
  },
});
