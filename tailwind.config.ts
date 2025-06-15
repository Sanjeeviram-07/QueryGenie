
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// QueryGenie custom colors
				'deep-purple': '#2B0F3A',
				'neon-violet': '#A259FF',
				'soft-blue': '#7FCAFF',
				'crystal-white': '#FFFFFF',
			},
			fontFamily: {
				'poppins': ['Poppins', 'sans-serif'],
				'inter': ['Inter', 'sans-serif'],
			},
			backgroundImage: {
				'query-gradient': 'linear-gradient(135deg, #2B0F3A 0%, #000000 100%)',
				'crystal-gradient': 'linear-gradient(135deg, rgba(162, 89, 255, 0.1) 0%, rgba(127, 202, 255, 0.1) 100%)',
				'glow-gradient': 'radial-gradient(circle at center, rgba(162, 89, 255, 0.3) 0%, transparent 70%)',
			},
			boxShadow: {
				'glow': '0 0 20px rgba(162, 89, 255, 0.3)',
				'glow-lg': '0 0 40px rgba(162, 89, 255, 0.4)',
				'crystal': '0 8px 32px rgba(31, 38, 135, 0.37)',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'sparkle': {
					'0%, 100%': { opacity: '0', transform: 'scale(0)' },
					'50%': { opacity: '1', transform: 'scale(1)' }
				},
				'crystal-fall': {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(-50px) scale(0) rotate(0deg)' 
					},
					'50%': { 
						opacity: '1', 
						transform: 'translateY(0px) scale(1) rotate(180deg)' 
					},
					'100%': { 
						opacity: '0', 
						transform: 'translateY(50px) scale(0) rotate(360deg)' 
					}
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(162, 89, 255, 0.3)' },
					'50%': { boxShadow: '0 0 40px rgba(162, 89, 255, 0.6)' }
				},
				'slide-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'sparkle': 'sparkle 2s ease-in-out infinite',
				'crystal-fall': 'crystal-fall 3s ease-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'slide-in': 'slide-in 0.6s ease-out',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
