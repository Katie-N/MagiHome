module.exports = {
  content: [
    "./pages/**/*.{vue,js,ts,jsx,tsx}",
    "./components/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        // Add custom font families
        fontFamily: {
            vibur: ['Vibur', 'Comic Sans'],
            whisper: ["Whisper", "Times New Roman"]
        },
    },
  },
  plugins: [],
};