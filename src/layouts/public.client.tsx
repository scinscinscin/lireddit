import { implementLayoutFrontend, GenerateLayoutOptionsImpl } from "@scinorandex/layout";
import { NextSeo, NextSeoProps } from "next-seo";
import styles from "./public.module.scss";

export interface PublicLayoutOptions extends GenerateLayoutOptionsImpl {
  // the page can return NextSeoProps to define the SEO meta tags of the page
  ClientSideLayoutProps: { seo?: NextSeoProps };
  // the layout needs the username of the currently logged in user
  ServerSideLayoutProps: { username: string | null };
}

export const PublicLayoutFrontend = implementLayoutFrontend<PublicLayoutOptions>({
  /**
   * Create a layout that prints the currently logged in user
   */
  layoutComponent({ internalProps, layoutProps }) {
    return (
      <>
        <NextSeo
          {...{
            title: "@scinorandex/ssr Layout Example",
            description: "A page made with @scinorandex/ssr",
            ...layoutProps.seo,
          }}
        />

        <div className={styles.root}>
          <header className={styles.header}>
            <h2>LiReddit</h2>
          </header>

          <main className={styles.main}>{layoutProps.children}</main>
        </div>
      </>
    );
  },
});
