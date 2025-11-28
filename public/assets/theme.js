function updateTheme() {
	try {
		const theme = localStorage.getItem("theme") || "system";
		const systemDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		const isDark =
			theme === "dark" || (theme === "system" && systemDark);

		document.documentElement.classList.toggle("dark", isDark);
		document.documentElement.setAttribute("data-theme", theme);
	} catch (err) {
		// localStorage might be disabled, fall back to system preference
		const systemDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		document.documentElement.classList.toggle("dark", systemDark);
	}
}

// Initialize
updateTheme();

// Listen for system theme changes
window
	.matchMedia("(prefers-color-scheme: dark)")
	.addEventListener("change", updateTheme);