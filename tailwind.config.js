const { configureColors } = require('tailwindcss-color-suite')

module.exports = {
    purge: [
        './index.html',
        './src/**/*.{js,ts,vue}',
    ],
    mode: 'jit',
    darkMode: false, // or 'media' or 'class'
    theme: {
        base: {
            default: '20px',
            xs: '22px',
            md: '24px'
        },
        colors: configureColors(),
        extend: {
            screens: {
                mouse: {'hover': 'hover'},
                xs: '420px',
            },
            backgroundImage: {
              'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
              'gradient-radial-side': 'radial-gradient(closest-side, var(--tw-gradient-stops))',
            },
            transitionProperty: {
                'opacity-transform': 'opacity, transform',
            },
            transitionTimingFunction: {
                'out-long': 'cubic-bezier(.2,.38,.25,1)'
            },
            zIndex: {
                '-1': '-1',
                'masthead': 99999
            },
            spacing: {
                px: '1px'
            },
            transitionDuration: {
                '25': '25ms', // might as well be instant
                '35': '35ms', // barely perceptible
                '50': '50ms',
                '2000': '2000ms',
                '3000': '3000ms'
            },
            strokeWidth: (theme) => ({
                DEFAULT: '1px',
                '0': '0',
                ...theme('spacing')
            }),
            stroke: (theme) => ({
                ...theme('colors')
            }),
            fill: (theme) => ({
                ...theme('colors')
            }),
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.neutral.200'),
                        marginTop: "var(--twgl-base)",
                        marginBottom: "var(--twgl-base)",
                        '[class~="lead"]': {
                            color: theme('colors.neutral.200'),
                        },
                        a: {
                            color: theme('colors.neutral.200')
                        },
                        strong: {
                            color: theme('colors.neutral.200')
                        },
                        'ol > li::before': {
                            color: theme('colors.neutral.500')
                        },
                        'ul > li::before': {
                            backgroundColor: theme('colors.neutral.400')
                        },
                        hr: {
                            borderColor: theme('colors.neutral.600')
                        },
                        blockquote: {
                            color: theme('colors.neutral.100')
                        },
                        h1: {
                            color: theme('colors.neutral.100'),
                            lineHeight: "calc(var(--twgl-base) * 1.5)",
                            marginTop: "var(--twgl-base)",
                            marginBottom: "calc(var(--twgl-base) * 1.25)"
                        },
                        h2: {
                            color: theme('colors.neutral.100'),
                            marginTop: "var(--twgl-base)",
                            marginBottom: "var(--twgl-base)"
                        },
                        h3: {
                            color: theme('colors.neutral.100')
                        },
                        h4: {
                            color: theme('colors.neutral.100')
                        },
                        'figure figcaption': {
                            color: theme('colors.neutral.500')
                        },
                        code: {
                            color: theme('colors.neutral.100')
                        },
                        'a code': {
                            color: theme('colors.neutral.100')
                        },
                        pre: {
                            color: theme('colors.neutral.200'),
                        },
                        thead: {
                            color: theme('colors.neutral.100'),
                            borderBottomColor: theme('colors.neutral.300')
                        },
                        'tbody tr': {
                            borderBottomColor: theme('colors.neutral.200')
                        },
                    }
                }
            })
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('tailwindcss-gridlines'),
        require('@tailwindcss/typography')
    ],
}