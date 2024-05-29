import React from "react";
import styles from "./Button.module.scss";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  onClick: (() => void) | "reset" | "submit" | { href: string };
  maxWidth?: boolean;
  disabled?: boolean;
}

export const Button = {
  Default: (props: ButtonProps) => {
    if (typeof props.onClick === "object") {
      return (
        <Link href={props.onClick.href} className={styles.Default}>
          {props.children}
        </Link>
      );
    }

    return (
      <button
        disabled={props.disabled}
        style={{ width: props.maxWidth ? "100%" : undefined }}
        onClick={typeof props.onClick === "function" ? props.onClick : undefined}
        type={typeof props.onClick === "function" ? "button" : props.onClick}
        className={styles.Default}
      >
        {props.children}
      </button>
    );
  },
};
