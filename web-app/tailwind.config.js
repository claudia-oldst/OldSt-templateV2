const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const colors = require('../../libs/ui/styles/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        join(
            __dirname,
            '{src,pages,ui,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
        ),
        ...createGlobPatternsForDependencies(__dirname),
    ],
    theme: {
        fontSize: {
            xs: ['0.625rem', '1rem'],
            sm: ['0.75rem', '1.125rem'],
            base: ['0.875rem', '1.5rem'],
            lg: ['1rem', '1.5rem'],
            xl: ['1.125rem', '1.5rem'],
            '2xl': ['1.5rem', '2rem'],
            '3xl': ['2rem', '3rem'],
            '4xl': ['2.75rem', '3rem']
        },
        dropShadow: {
            'elevation-01': 'inset 0px 1px 2px rgba(75, 85, 101, 0.08)',
            'elevation-02': '0px 8px 16px rgba(75, 85, 101, 0.08)',
            'elevation-03': '0px 16px 32px rgba(75, 85, 101, 0.08)',
            'elevation-04': '0px 20px 40px rgba(75, 85, 101, 0.08)',
            'elevation-05': '0px 24px 48px rgba(75, 85, 101, 0.08)',
        },
        colors: {
            ...colors,
            transparent: 'transparent'
        },
        extend: {
            fontFamily: {
                jakarta: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.serif],
                orienta: ['Orienta', ...defaultTheme.fontFamily.serif]
            },
            keyframes: {
                shimmer: {
                    '0%': {
                        backgroundColor: '#EDEFF5',
                        opacity: '30%'
                    },
                    '100%': {
                        backgroundColor: '#C1C4D6',
                        opacity: '90%'
                    }
                }
            },
            animation: {
                shimmer: 'shimmer 1s linear infinite alternate',
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar-hide'),
        function ({ addUtilities }) {
            addUtilities({
                '.flex-centered': {
                    '@apply flex items-center justify-center gap-2': {},
                },
                '.flex-spaced': {
                    '@apply flex justify-between': {},
                }
            })
        }
    ],
    presets: [require('../../tailwind-workspace-preset.js')],
}
