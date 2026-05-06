/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./frontend/src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f8f3",
          100: "#dcefe2",
          600: "#2c7a46",
          700: "#22633a",
          900: "#12321f",
        },
        ink: "#17211b",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(44, 71, 50, 0.12)",
      },
    },
  },
  plugins: [],
};
