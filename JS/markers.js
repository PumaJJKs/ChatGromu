import { marked } from 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';

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
        // força títulos ###, ##, # para início de linha
        .replace(/\s*(#{1,6})\s*/g, '\n\n$1 ')

        // força listas "- **Algo:**" para nova linha
        .replace(/\s-\s\*\*/g, '\n- **')

        // força parágrafo antes de listas normais
        .replace(/([a-zà-ú])\s-\s/gim, '$1\n\n- ')

        // converte bullets unicode em listas markdown
        .replace(/^[•·]\s?/gm, '- ')

        // separadores
        .replace(/---+/g, '\n\n---\n\n')

        // tabelas
        .replace(/\n\|/g, '\n\n|')

        // remove excesso de quebras
        .replace(/\n{3,}/g, '\n\n')

        .trim();
}



// Renderiza mensagem no chat
function renderMessage(messageText, sender = "user") {
    const chatBox = document.getElementById("chatBox");

    // 🔧 normalização ANTES do marked
    messageText = normalizeMarkdown(messageText);

    let html = marked.parse(messageText);
    html = parseSpoilers(html);

    const messageEl = document.createElement("div");
    messageEl.classList.add("chat-message", sender);
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
