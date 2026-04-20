/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'rich-black': '#021A1A',
        'dark-green': '#032221',
        'bangladesh-green': '#03624C',
        'mountain-meadow': '#2CC295',
        'caribbean-green': '#00DF81',
        'anti-flash-white': '#F1F7F6',
        'pine': '#06302B',
        'basil': '#0B453A',
        'forest': '#095544',
        'frog': '#17876D',
        'mint': '#2FA98C',
        'stone': '#707D7D',
        'pistachio': '#AACBC4',
      },
      backgroundColor: {
        'primary': '#00DF81',
        'secondary': '#032221',
        'dark': '#021A1A',
      },
      textColor: {
        'primary': '#00DF81',
        'secondary': '#F1F7F6',
        'muted': '#707D7D',
      },
      borderColor: {
        'primary': '#00DF81',
        'secondary': '#03624C',
      },
    },
  },
  plugins: [],
}