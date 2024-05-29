import { PublicLayoutFrontend } from "../layouts/public.client";
import { PublicLayoutBackend } from "../layouts/public.server";

import { Button } from "../components/Button";
import styles from "./index.module.scss";

interface PageProps {}

export default PublicLayoutFrontend.use<PageProps>((args) => {
  return {
    children: (
      <div>
        <header className={styles.header}>
          <h2>Timeline</h2>
          <Button.Default onClick={{ href: "/post/create" }}>Create Post</Button.Default>
        </header>
      </div>
    ),
  };
});

export const getServerSideProps = PublicLayoutBackend.use<PageProps>({});
