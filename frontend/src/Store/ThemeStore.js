import { create } from "zustand";

export const useThemeStore = create((set) => ({
    dark: localStorage.getItem("theme") === "dark" || false, // initial state

    toggleTheme: () =>
        set((state) => {
            const newTheme = !state.dark;

            if (newTheme) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }

            return { dark: newTheme };
        }),
}));
