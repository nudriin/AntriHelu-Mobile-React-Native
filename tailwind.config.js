/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './screens/**/*.{js,jsx,ts,tsx}'],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                poppinsR: ['Poppins-Regular', 'sans-serif'],
                poppinsB: ['Poppins-Bold', 'sans-serif'],
                poppinsEB: ['Poppins-ExtraBold', 'sans-serif'],
                poppinsBK: ['Poppins-Black', 'sans-serif'],
                futura: ['Futur', 'sans-serif']
            },
            colors: {
                purple: '#892CDC',
                blck: '#0D0D0D',
                darkGrey: '#242425',
                lightGrey: '#868686',
                blues: '#1364FF',
                lime: '#C6FE1E',
                ash: '#EAF0F8'
            }
        },
    },
    plugins: [],
};
