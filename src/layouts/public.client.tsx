import { implementLayoutFrontend, GenerateLayoutOptionsImpl } from "@scinorandex/layout";
import { NextSeo, NextSeoProps } from "next-seo";
import styles from "./public.module.scss";
import { Button } from "../components/Button";
import Link from "next/link";
import { DTOs } from "../utils/Cleanse";

export interface PublicLayoutOptions extends GenerateLayoutOptionsImpl {
  // the page can return NextSeoProps to define the SEO meta tags of the page
  ClientSideLayoutProps: { seo?: NextSeoProps };
  // the layout needs the username of the currently logged in user
  ServerSideLayoutProps: { user: DTOs["user"] | null };
  LayoutGSSPOptions: {
    mustBeLoggedIn: boolean;
  };
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
            title: "Home",
            description: "The back page of the internet",
            titleTemplate: "%s | LiReddit",
            ...layoutProps.seo,
          }}
        />

        <div className={styles.root}>
          <header className={styles.header}>
            <Link href="/">
              <h2>LiReddit</h2>
            </Link>

            {internalProps.user ? (
              <Link className={styles.username} href={"/user/" + internalProps.user.username}>
                {internalProps.user.username}
              </Link>
            ) : (
              <Button.Default onClick={{ href: "/login" }}>Login</Button.Default>
            )}
          </header>

          <main className={styles.main}>{layoutProps.children}</main>
        </div>
      </>
    );
  },
});
