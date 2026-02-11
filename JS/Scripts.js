function toggleMenu() {
    const sideMenu = document.getElementById("side-menu");
    sideMenu.classList.toggle("open");
    document.body.classList.toggle("menu-open");
}

document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.getElementById("chatInput");
    if (chatInput) {
        chatInput.onkeypress = (e) => {
            if (e.key === "Enter") sendMessage();
        };
    }
    // Cria o chat inicial
    createNewChat();
});
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("chatInput");
    if (input) {
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); // Evita que a página recarregue
                sendMessage();
            }
        });
    }
});