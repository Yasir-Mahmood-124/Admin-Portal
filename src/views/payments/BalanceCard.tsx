"use client";

import React from "react";
import {
  Box,
  Card,
  Typography,
  Stack,
  Skeleton,
} from "@mui/material";
import {
  TrendingUp,
  AccountBalanceWallet,
  AccessTime,
} from "@mui/icons-material";
import { useGetBalanceQuery } from "@/redux/services/get-balance";

const BalanceCard: React.FC = () => {
  const { data, error, isLoading } = useGetBalanceQuery();

  const balanceItems = [
    {
      label: "Available Balance",
      value: data?.available || "0.00 USD",
      icon: <AccountBalanceWallet sx={{ fontSize: 24 }} />,
      gradient: "linear-gradient(135deg, #3EA2FF 0%, #5FB0FE 100%)",
      color: "#3EA2FF",
    },
    {
      label: "Pending Balance",
      value: data?.pending || "0.00 USD",
      icon: <AccessTime sx={{ fontSize: 24 }} />,
      gradient: "linear-gradient(135deg, #FF3C80 0%, #FB5691 100%)",
      color: "#FF3C80",
    },
    {
      label: "Total Balance",
      value: data?.total || "0.00 USD",
      icon: <TrendingUp sx={{ fontSize: 24 }} />,
      gradient: "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
      color: "#16A34A",
    },
  ];

  if (error) {
    return (
      <Card
        sx={{
          p: 3,
          borderRadius: "1rem",
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
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: "#111827",
          letterSpacing: "-0.02em",
        }}
      >
        Financial Overview
      </Typography>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{ mb: 4 }}
      >
        {balanceItems.map((item, index) => (
          <Card
            key={index}
            sx={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              borderRadius: "1rem",
              border: "1px solid #E5E7EB",
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
                  color: "#6B7280",
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
                    color: "#111827",
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
    </Box>
  );
};

export default BalanceCard;