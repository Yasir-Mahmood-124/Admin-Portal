"use client";

import styles from "./page.module.css";
import { theme } from "@/theme/theme";

export default function Home() {
  return (
    <div
      className={styles.page}
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text.primary,
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize.base,
        padding: theme.container.padding,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      Hello
    </div>
  );
}
