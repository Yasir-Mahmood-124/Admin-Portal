"use client";

import styles from "./page.module.css";
import { theme } from "@/theme/theme";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
  return <div>

  </div>;
}
