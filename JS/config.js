const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");

settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("hidden");
});

function closeSettings() {
    settingsPanel.classList.add("hidden");
}
const languageSelect = document.getElementById("languageSelect");

languageSelect.addEventListener("change", () => {
    const lang = languageSelect.value;
    localStorage.setItem("lang", lang);
    applyLanguage(lang);
});

function applyLanguage(lang) {
    if (lang === "en") {
        document.querySelector("h2").innerText = "Settings";
        settingsBtn.innerText = "⚙️ Settings";
    }

    if (lang === "pt") {
        document.querySelector("h2").innerText = "Configurações";
        settingsBtn.innerText = "⚙️ Configurações";
    }
}

// carregar idioma salvo
const savedLang = localStorage.getItem("lang");
if (savedLang) {
    languageSelect.value = savedLang;
    applyLanguage(savedLang);
}
function openLogin() {
    alert("Abrir login (futuro)");
}

function openRegister() {
    alert("Abrir criar conta (futuro)");
}
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

function applyTheme(theme) {
    if (theme === "light") {
        body.classList.add("light-theme");
        themeToggle.innerText = "☀️ Modo claro";
    } else {
        body.classList.remove("light-theme");
        themeToggle.innerText = "🌙 Modo escuro";
    }
}

themeToggle.addEventListener("click", () => {
    const isLight = body.classList.contains("light-theme");
    const newTheme = isLight ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
});

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);
function logout() {
    localStorage.removeItem("user");
    alert("Sessão terminada");
    closeSettings();
}
