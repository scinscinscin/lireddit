import { authProcedure, baseProcedure } from "../utils/auth";
import { unTypeSafeRouter } from "./index.js";
import { z } from "zod";

const CreatePostValidator = z.object({
  title: z.string(),
  content: z.string(),
});

export const postRouter = unTypeSafeRouter.sub("/post", {
  "/create": {
    post: authProcedure.input(CreatePostValidator).use(async (req, res, { user, input }) => {
      console.log(user, input);
      return { testing: "bruh moment" };
    }),
  },
});
