const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");

settingsBtn.onclick = () => settingsPanel.classList.toggle("hidden");

function closeSettings() {
    settingsPanel.classList.add("hidden");
}

// Idioma e Tema
const themeToggle = document.getElementById("themeToggle");
themeToggle.onclick = () => {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    themeToggle.innerText = isLight ? "☀️ Modo claro" : "🌙 Modo escuro";
    localStorage.setItem("theme", isLight ? "light" : "dark");
};

// Ao carregar
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-theme");
    themeToggle.innerText = "☀️ Modo claro";
}