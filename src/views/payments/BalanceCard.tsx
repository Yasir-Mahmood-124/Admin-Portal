
"use client";

import React, { useMemo } from "react";
import {
  Box,
  Card,
  Typography,
  Stack,
  Skeleton,
  Chip,
  Avatar,
} from "@mui/material";
import {
  TrendingUp,
  AccountBalanceWallet,
  AccessTime,
  Person,
  Language,
  Workspaces,
} from "@mui/icons-material";
import { useGetBalanceQuery } from "@/redux/services/get-balance";
import { useGetPaymentHistoryQuery } from "@/redux/services/payment-history";
import { theme } from "@/theme/theme";

const BalanceCard: React.FC = () => {
  const { data: balanceData, error, isLoading } = useGetBalanceQuery();
  const { data: paymentData } = useGetPaymentHistoryQuery();

  // Calculate statistics from payment data
  const stats = useMemo(() => {
    if (!paymentData?.data) return { totalCustomers: 0, uniqueCountries: 0, totalPlans: 0 };

    const allRecords = Object.values(paymentData.data).flatMap((user: any) => user.records);
    const uniqueEmails = new Set(allRecords.map((r: any) => r.email));
    const uniqueCountries = new Set(allRecords.map((r: any) => r.country));
    const uniquePlans = new Set(allRecords.map((r: any) => r.plan_name));

    return {
      totalCustomers: uniqueEmails.size,
      uniqueCountries: uniqueCountries.size,
      totalPlans: uniquePlans.size,
    };
  }, [paymentData]);

  const balanceItems = [
    {
      label: "Available Balance",
      value: balanceData?.available || "0.00 USD",
      icon: <AccountBalanceWallet sx={{ fontSize: 24 }} />,
      gradient: "linear-gradient(135deg, #3EA2FF 0%, #5FB0FE 100%)",
      color: "#3EA2FF",
    },
    {
      label: "Pending Balance",
      value: balanceData?.pending || "0.00 USD",
      icon: <AccessTime sx={{ fontSize: 24 }} />,
      gradient: "linear-gradient(135deg, #FF3C80 0%, #FB5691 100%)",
      color: "#FF3C80",
    },
    {
      label: "Total Balance",
      value: balanceData?.total || "0.00 USD",
      icon: <TrendingUp sx={{ fontSize: 24 }} />,
      gradient: "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
      color: "#16A34A",
    },
  ];

  const additionalStats = [
    {
      label: "Total Customers",
      value: stats.totalCustomers,
      icon: <Person sx={{ fontSize: 20 }} />,
      color: "#0284C7",
    },
    {
      label: "Countries",
      value: stats.uniqueCountries,
      icon: <Language sx={{ fontSize: 20 }} />,
      color: "#7C3AED",
    },
    {
      label: "Active Plans",
      value: stats.totalPlans,
      icon: <Workspaces sx={{ fontSize: 20 }} />,
      color: "#CA8A04",
    },
  ];

  if (error) {
    return (
      <Card
        sx={{
          p: 3,
          borderRadius: theme.radii.xl,
          background: "#FEF2F2",
          border: "1px solid #FCA5A5",
        }}
      >
        <Typography color="#DC2626" fontWeight={500}>
          ⚠️ Failed to load balance. Please try again later.
        </Typography>
      </Card>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: theme.colors.text.primary,
          letterSpacing: "-0.02em",
        }}
      >
        Financial Overview
      </Typography>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{ mb: 3 }}
      >
        {balanceItems.map((item, index) => (
          <Card
            key={index}
            sx={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              borderRadius: theme.radii.xl,
              border: `1px solid ${theme.colors.border.solid}`,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: item.gradient,
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: `${item.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.color,
                  }}
                >
                  {item.icon}
                </Box>
              </Stack>

              <Typography
                variant="body2"
                sx={{
                  color: theme.colors.text.muted,
                  fontWeight: 500,
                  mb: 0.5,
                  fontSize: "0.875rem",
                }}
              >
                {item.label}
              </Typography>

              {isLoading ? (
                <Skeleton
                  variant="text"
                  width="60%"
                  height={40}
                  sx={{ mt: 1 }}
                />
              ) : (
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: theme.colors.text.primary,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {item.value}
                </Typography>
              )}
            </Box>
          </Card>
        ))}
      </Stack>

      {/* Additional Statistics */}
      <Stack direction="row" spacing={2} flexWrap="wrap">
        {additionalStats.map((stat, index) => (
          <Chip
            key={index}
            icon={
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  background: `${stat.color}20`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </Avatar>
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.text.muted }}>
                  {stat.label}
                </Typography>
              </Box>
            }
            sx={{
              height: 40,
              px: 2,
              background: "#fff",
              border: `1px solid ${theme.colors.border.solid}`,
              borderRadius: theme.radii.lg,
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default BalanceCard;