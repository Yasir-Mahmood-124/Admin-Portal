"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { Box, Typography, IconButton } from "@mui/material";
import { theme } from "@/theme/theme";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const currentTime = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box display="flex" minHeight="100vh" sx={{ background: "#F9FAFB" }}>
      <Sidebar />
      <Box
        component="main"
        flex={1}
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "#FFFFFF",
            borderBottom: `1px solid ${theme.colors.border.solid}`,
            px: theme.spacing(6),
            py: theme.spacing(2),
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTimeIcon sx={{ fontSize: "1rem", color: theme.colors.text.muted }} />
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text.muted,
                fontSize: "0.875rem",
              }}
            >
              Last updated: {currentTime}
            </Typography>
          </Box>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            px: theme.spacing(6),
            py: theme.spacing(5),
            background: "#F9FAFB",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}