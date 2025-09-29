// src/app/dashboard/layout.tsx
"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";
import { theme } from "@/theme/theme";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />
      <Box
        component="main"
        flex={1}
        sx={{
          px: theme.spacing(6),
          py: theme.spacing(5),
          background: theme.colors.gradients.background1,
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
