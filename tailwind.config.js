module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: "#c45c38",
        green: "#2f6b45",
        black: "#1e2a22",
        gray: "#8d867c",
        ink: "#1e2a22",
        paper: "#f6f1e8",
        clay: "#c45c38",
        line: "#e7dfd2",
        muted: "#6f6a62",
        danger: "#9b3d32",
      },
    },
    container: {
      center: true,
    },
  },
  plugins: [],
};
