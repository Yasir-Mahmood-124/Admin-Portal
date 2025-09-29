// src/theme/theme.ts

// Type definitions (optional but recommended)
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
      "4xl": string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: string;
      snug: string;
      normal: string;
      relaxed: string;
      loose: string;
    };
  };
  spacing: (factor: number) => string;
  radii: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
  container: {
    padding: string;
    maxWidth: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      "2xl": string;
    };
  };
}

export const theme: Theme = {
  colors: {
    primary: "#2563eb", // Blue-600
    secondary: "#9333ea", // Purple-600
    accent: "#f59e0b", // Amber-500
    background: "#f9fafb", // Gray-50
    surface: "#ffffff", // White
    text: {
      primary: "#111827", // Gray-900
      secondary: "#374151", // Gray-700
      muted: "#6b7280", // Gray-500
      inverse: "#ffffff",
    },
    border: "#e5e7eb", // Gray-200
    error: "#dc2626", // Red-600
    success: "#16a34a", // Green-600
    warning: "#ca8a04", // Yellow-600
    info: "#0284c7", // Sky-600
  },

  typography: {
    fontFamily: `'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: "1.1",
      snug: "1.3",
      normal: "1.5",
      relaxed: "1.7",
      loose: "2",
    },
  },

  spacing: (factor: number) => `${0.25 * factor}rem`,

  radii: {
    none: "0",
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 15px rgba(0,0,0,0.15)",
    xl: "0 20px 25px rgba(0,0,0,0.2)",
  },

  breakpoints: {
    xs: "480px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  container: {
    padding: "1rem",
    maxWidth: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
};
