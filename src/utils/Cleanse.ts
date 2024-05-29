import * as DBModels from "@prisma/client";
import { title } from "process";

export const Cleanse = {
  user: (user: DBModels.User) => {
    return {
      uuid: user.uuid,
      username: user.username,
    };
  },

  post: (post: DBModels.Post & { author: DBModels.User }) => {
    return {
      uuid: post.uuid,
      title: post.title,
      content: post.content,
      author: Cleanse.user(post.author),
      createdAt: post.createdAt.valueOf(),
    };
  },

  comment: (comment: DBModels.Comment & { author: DBModels.User }) => {
    return {
      uuid: comment.uuid,
      content: comment.content,
      user: Cleanse.user(comment.author),
      createdAt: comment.createdAt.valueOf(),
    };
  },
};

export type DTOs = {
  [key in keyof typeof Cleanse]: ReturnType<(typeof Cleanse)[key]>;
};
