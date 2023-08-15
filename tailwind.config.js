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
      // grey: "#595959",
      // blue: "#009FB7",
      // white: "#F2F2F2",

      orange: "#ec7357ff;",
      green: "#72b01dff",
      black: "#343633ff",
      white: "#ffffff",
      gray: "#a5b5bfff",
    },
    container: {
      center: true,
    },
  },
  plugins: [],
};
