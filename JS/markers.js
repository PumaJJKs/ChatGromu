import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

// Configuração do marked
marked.setOptions({
    breaks: true,
    gfm: true
});

function parseSpoilers(text) {
    return text.replace(/\|\|(.*?)\|\|/g, '<span class="spoiler">$1</span>');
}

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

// Adicionamos EXPORT para que o APImensagens possa usar esta função
export function renderFormattedMessage(messageText, sender = "user") {
    const chatBox = document.getElementById("chatBox");

    // Limpa o markdown da API
    const cleanText = normalizeMarkdown(messageText);

    // Converte para HTML
    let html = marked.parse(cleanText);
    html = parseSpoilers(html);

    const messageEl = document.createElement("div");
    messageEl.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
    messageEl.innerHTML = html;

    // Ativa spoilers
    messageEl.querySelectorAll('.spoiler').forEach(el => {
        el.addEventListener('click', () => el.classList.toggle('revealed'));
    });

    chatBox.appendChild(messageEl);
    chatBox.scrollTop = chatBox.scrollHeight;
}