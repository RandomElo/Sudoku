const store = window.localStorage;
let dark = JSON.parse(store.getItem("dark"));
const toggle = document.querySelector(".toggle-track");
const setDarkMode = () => {
    document.documentElement.classList[dark ? "add" : "remove"]("dark-mode");
    toggle.setAttribute("title", (dark ? "Light" : "Dark") + " mode");
};
if (dark !== null) {
    setDarkMode();
} else {
    const prefers = "(prefers-color-scheme: dark)";
    const match = window.matchMedia;
    dark = !!(match && match(prefers).matches);
    match(prefers).addEventListener("change", function (event) {
        dark = !!event.matches;
        setDarkMode();
    });
    setDarkMode();
}

toggle.addEventListener("click", () => {
    dark = !dark;
    setDarkMode();
    store.setItem("dark", dark.toString());
    toggle.blur();
});
