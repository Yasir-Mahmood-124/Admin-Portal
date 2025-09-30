// src/app/dashboard/page.tsx
"use client";

import { Typography, Box, CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { theme } from "@/theme/theme";
import { useGetAdminAnalyticsQuery } from "@/redux/services/get_admin_analytics";

export default function DashboardPage() {
  const { data, error, isLoading } = useGetAdminAnalyticsQuery();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center">
        Failed to load analytics
      </Typography>
    );
  }

  // Labels + Data
  const categories = ["Users", "Organizations", "Projects", "Review Docs"];
  const values = [
    data?.users_count ?? 0,
    data?.organizations_count ?? 0,
    data?.projects_count ?? 0,
    data?.reviewDocuments_count ?? 0,
  ];

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
      <Typography variant="body1" color={theme.colors.text.secondary} gutterBottom>
        Here’s a quick overview of your system analytics.
      </Typography>

      {/* Bar Chart */}
      <Box mt={4}>
        <BarChart
          xAxis={[{ scaleType: "band", data: categories }]}
          series={[
            {
              data: values,
              label: "Count",
              color: theme.colors.primary,
            },
          ]}
          height={350}
        />
      </Box>
    </Box>
  );
}
