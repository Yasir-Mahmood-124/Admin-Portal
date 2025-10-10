"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import { useGetBalanceQuery } from "@/redux/services/get-balance";

const BalanceCard: React.FC = () => {
  const { data, error, isLoading } = useGetBalanceQuery();

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #F0F7FF 0%, #FFFFFF 100%)",
        borderRadius: "1rem",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
        p: 2,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, color: "#111827" }}
        >
          Account Balance
        </Typography>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">
            Failed to load balance. Please try again.
          </Typography>
        ) : (
          data && (
            <Stack spacing={1.5}>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Available:</Typography>
                <Typography fontWeight={600} color="text.primary">
                  {data.available}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Pending:</Typography>
                <Typography fontWeight={600} color="text.primary">
                  {data.pending}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Total:</Typography>
                <Typography fontWeight={700} color="#3EA2FF">
                  {data.total}
                </Typography>
              </Box>
            </Stack>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
