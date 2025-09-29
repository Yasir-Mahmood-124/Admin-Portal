// src/app/dashboard/page.tsx
"use client";

import { Typography, Box } from "@mui/material";
import { theme } from "@/theme/theme";

export default function DashboardPage() {
  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight={theme.typography.fontWeight.bold}
        color={theme.colors.primary}
        gutterBottom
      >
        Welcome to the Admin Dashboard
      </Typography>
      <Typography variant="body1" color={theme.colors.text.secondary}>
        Choose an option from the sidebar to manage data.
      </Typography>
    </Box>
  );
}
