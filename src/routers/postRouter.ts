import { Cleanse } from "../utils/Cleanse";
import { authProcedure, baseProcedure } from "../utils/auth";
import { db } from "../utils/prisma";
import { unTypeSafeRouter } from "./index.js";
import { z } from "zod";

const CreatePostValidator = z.object({
  title: z.string(),
  content: z.string(),
});

const CreateCommentValidator = z.object({
  content: z.string(),
});

export const postRouter = unTypeSafeRouter.sub("/post", {
  "/create": {
    post: authProcedure.input(CreatePostValidator).use(async (req, res, { user, input }) => {
      console.log(user, input);
      // create a new post and attribute it to the user
      const newPost = await db.post.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: user.uuid,
        },
        include: { author: true },
      });

      return { newPost: Cleanse.post(newPost) };
    }),
  },

  "/:uuid/comment": {
    post: authProcedure.input(CreateCommentValidator).use(async (req, res, { input, user }) => {
      const newComment = await db.comment.create({
        data: { content: input.content, authorId: user.uuid, postId: req.params.uuid },
        include: { author: true },
      });

      return { newComment: Cleanse.comment(newComment) };
    }),
  },
});
