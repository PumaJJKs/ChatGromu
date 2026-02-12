import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

// Configuração do marked
marked.setOptions({
    breaks: true,
    gfm: true
});

// Converte spoilers ||texto|| em HTML
function parseSpoilers(text) {
    return text.replace(/\|\|(.*?)\|\|/g, '<span class="spoiler">$1</span>');
}

// Normaliza Markdown mal formatado da API
function normalizeMarkdown(text) {
    return text
        .replace(/\s*(#{1,6})\s*/g, '\n\n$1 ')
        .replace(/\s-\s\*\*/g, '\n- **')
        .replace(/([a-zà-ú])\s-\s/gim, '$1\n\n- ')
        .replace(/^[•·]\s?/gm, '- ')
        .replace(/---+/g, '\n\n---\n\n')
        .replace(/\n\|/g, '\n\n|')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

// MUDANÇA: Adicionamos "export" para que o APImensagens.js consiga importar esta função
export function renderMessage(messageText, sender = "user") {
    const chatBox = document.getElementById("chatBox");
    if (!chatBox) return; // Evita erro se o chatBox não existir

    // 🔧 normalização ANTES do marked
    messageText = normalizeMarkdown(messageText);

    let html = marked.parse(messageText);
    html = parseSpoilers(html);

    const messageEl = document.createElement("div");
    
    // MUDANÇA: Ajustei as classes para 'message' + 'user-message'/'bot-message' 
    // para bater com o CSS que você mostrou nos prints anteriores
    const senderClass = sender === "user" ? "user-message" : "bot-message";
    messageEl.classList.add("message", senderClass);
    
    messageEl.innerHTML = html;

    // Ativa spoilers clicáveis
    messageEl.querySelectorAll('.spoiler').forEach(el => {
        el.addEventListener('click', () => {
            el.classList.toggle('revealed');
        });
    });

    chatBox.appendChild(messageEl);
    chatBox.scrollTop = chatBox.scrollHeight;
}