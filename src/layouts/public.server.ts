import { implementLayoutBackend } from "@scinorandex/layout";
import type { PublicLayoutOptions } from "./public.client";
import { Cleanse } from "../utils/Cleanse";

export const PublicLayoutBackend = implementLayoutBackend<PublicLayoutOptions>({
  /**
   * Fetch the created users from the database and return to the layout component
   */
  async getServerSideProps(ctx, opts) {
    const user = ctx.res.locals.user;
    if (opts.mustBeLoggedIn && !user)
      return {
        redirect: { destination: `/login?redirect=${ctx.req.path}`, permanent: false },
      };

    return {
      props: { layout: { user: user ? Cleanse.user(user) : null } },
    };
  },
});
