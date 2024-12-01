/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        tall: { raw: "(min-height: 940px)" }, // Custom height breakpoint
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to right, #FFEFEF 0%, #F2FFEF 50%, #F5F7FF 75%, #FFFFFF 100%)",
        "button-gradient":
          "linear-gradient(0deg, #603CEF 0%, #603CEF 6.67%, #613EEF 13.33%, #6441EE 20%, #6746ED 26.67%, #6C4CEC 33.33%, #7153EA 40%, #775AE9 46.67%, #7D62E7 53.33%, #836AE6 60%, #8871E4 66.67%, #8C76E3 73.33%, #907BE2 80%, #927EE2 86.67%, #9380E1 93.33%, #9481E1 100%)",
      },
      boxShadow: {
        "text-shadow": "0px 2px 16px 0px #00000000",
        "button-shadow": "0px 2px 8px 0px rgb(0 0 0 / 12%)",
      },
      fontFamily: {
        runs: ["TTRuns", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      lineClamp: {
        2: "2",
        3: "3",
        4: "4",
      },
      animation: {
        slideIn: "slideIn 0.5s ease-out",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      transitionProperty: {
        transform: "transform",
        opacity: "opacity",
      },
      transitionDuration: {
        500: "500ms",
      },
      transitionTimingFunction: {
        "ease-out": "ease-out",
      },
    },
  },
  variants: {
    // Ensure line-clamp utilities are available in necessary variants
    lineClamp: ["responsive", "hover"],
  },
};
