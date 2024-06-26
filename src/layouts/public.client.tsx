import { implementLayoutFrontend, GenerateLayoutOptionsImpl } from "@scinorandex/layout";
import { NextSeo, NextSeoProps } from "next-seo";
import styles from "./public.module.scss";
import { Button } from "../components/Button";
import Link from "next/link";
import { DTOs } from "../utils/Cleanse";
import { useEffect } from "react";
import { useRouter } from "next/router";
import NProgress from "nprogress";

export interface PublicLayoutOptions extends GenerateLayoutOptionsImpl {
  ClientSideLayoutProps: { seo?: NextSeoProps };
  ServerSideLayoutProps: { user: DTOs["user"] | null };
  ExportedInternalProps: { user: DTOs["user"] | null };
  LayoutGSSPOptions: { mustBeLoggedIn: boolean };
}

export const PublicLayoutFrontend = implementLayoutFrontend<PublicLayoutOptions>({
  layoutComponent({ internalProps, layoutProps }) {
    const router = useRouter();
    useEffect(() => {
      // setup nprogress
      router.events.on("routeChangeStart", () => NProgress.start());
      router.events.on("routeChangeComplete", () => NProgress.done());
      router.events.on("routeChangeError", () => NProgress.done());
    }, []);

    return (
      <>
        <NextSeo
          {...{
            description: "The back page of the internet",
            titleTemplate: "%s | LiReddit",
            defaultTitle: "LiReddit",
            ...layoutProps.seo,
          }}
        />

        <div className={styles.root}>
          <header className={styles.header}>
            <Link href="/">
              <h2>LiReddit</h2>
            </Link>

            {internalProps.user ? (
              <span className={styles.navbar}>
                <Link href={"/post/create"}>Create Post</Link>
                <Link href={"/user/" + internalProps.user.username}>{internalProps.user.username}</Link>
              </span>
            ) : (
              <Button.Default onClick={{ href: "/login" }}>Login</Button.Default>
            )}
          </header>

          <main className={styles.main}>{layoutProps.children}</main>
        </div>
      </>
    );
  },

  generateExportedInternalProps: ({ user }) => ({ user }),
});
