// src/theme/theme.ts

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
    border: {
      solid: string;
      gradient: string;
    };
    gradients: {
      ill: string;
      background1: string;
      background2: string;
    };
    states: {
      error: string;
      success: string;
      warning: string;
      info: string;
    };
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
    primary: "#3EA2FF", // Bright Blue
    secondary: "#FF3C80", // Pink

    background: "#FFFFFF",
    surface: "#FFFFFF",

    text: {
      primary: "#111827", // Gray-900
      secondary: "#374151", // Gray-700
      muted: "#6B7280", // Gray-500
      inverse: "#FFFFFF",
    },

    border: {
      solid: "#E5E7EB", // Light Gray
      gradient: "linear-gradient(90deg, #3EA2FF 0%, #FF3C80 100%)",
    },

    gradients: {
      ill: `
        radial-gradient(741.08% 81.63% at 77.28% -93.49%, #F7D4E7 0%, rgba(255, 255, 255, 0) 100%),
        linear-gradient(180deg, #BFDCFE 28.84%, #EBF3FD 100%)
      `,
      background1: `
        radial-gradient(235.78% 49.76% at -12.5% 110.55%, rgba(251, 86, 145, 0.20) 0%, rgba(255, 255, 255, 0) 100%),
        radial-gradient(150.9% 61.56% at 89.65% -24.61%, rgba(95, 176, 254, 0.20) 0%, rgba(255, 255, 255, 0) 100%),
        #FFFFFF
      `,
      background2: `
        radial-gradient(20% 20% at center, #5FB0FE 0%, #FFFFFF 100%),
        radial-gradient(20% 20% at center, #FB5691 0%, #FFFFFF 100%)
      `,
    },

    states: {
      error: "#DC2626", // Red-600
      success: "#16A34A", // Green-600
      warning: "#CA8A04", // Yellow-600
      info: "#0284C7", // Sky-600
    },
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
