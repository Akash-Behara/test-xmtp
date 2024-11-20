/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			black90: '#0E0E0E',
  			black70: '#181818',
  			black60: '#212121',
  			black40: '#252525',
  			black20: '#2B2B2B',
  			white32: '#FFFFFF52',
  			white88: '#FFFFFFE0',
  			white48: '#FFFFFF7A',
  			white7: '#FFFFFF12',
  			white64: '#FFFFFFA3',
  			white4: '#FFFFFF0A',
  			white12: '#FFFFFF1F',
  			redLight: '#FF7373',
  			redDark: '#F03D3D',
  			greenText: '#0ED065'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

