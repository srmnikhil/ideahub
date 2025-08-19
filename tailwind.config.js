/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./App.{js,jsx}",       // root App file
    "./**/*.{js,jsx}",      // all JS/JSX files in the project
    "!./node_modules",      // ignore node_modules
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
