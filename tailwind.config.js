// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
    "node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "base-layer": "#E8E8FD",
        "accent-red": "#EE4D38",
        "main-bg": "#FFFFFF",
        "sidebar-bg": "#F8F8FF",
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "2.8125rem",
        "3xl": "1.875rem",
      },
      width: {
        sidebar: "15vw",
        "main-content": "94%",
        "main-content-md": "calc(100% - 25vw)",
        "main-content-lg": "calc(100% - 22vw)",
        "main-content-xl": "calc(100% - 20vw)",
      },
      height: {
        "red-rectangle": "96vh",
        "main-screen": "92vh",
      },
      margin: {
        "red-rect-right": "8vw",
        "red-rect-top": "8vh",
        "main-right": "14vw",
        "main-top": "16vh",
        "main-top-md": "5vh",
        "main-top-lg": "4vh",
        "main-top-xl": "3vh",
      },
      maxHeight: {
        "table-sm": "40vh",
        "table-md": "50vh",
        "table-lg": "60vh",
        "table-xl": "70vh",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
