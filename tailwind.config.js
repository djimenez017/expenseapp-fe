module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    colors: {
      grey: "#595959",
      blue: "#009FB7",
      white: "#F2F2F2",
      dark: "#0B0033",
      green1: "#84C318",
      yellow: "#ecc93b",
      red: "#d9282a",
    },
    container: {
      center: true,
    },
  },
  plugins: [],
};
