async function sendMessage() {
    const input = document.getElementById("chatInput");
    const text = input.value.trim();
    if (!text) return;
    if (!activeChatId) createNewChat();

    // Adiciona mensagem do usuário
    chatMessages[activeChatId].push({ role: "user", content: text });
    renderMessages();
    input.value = "";

    // Indicador de typing direto no DOM
    const chatBox = document.getElementById("chatBox");
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot-message";
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span><span></span><span></span>
        </div>
    `;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "HTTP-Referer": "http://127.0.0.1:5500",
                "X-Title": "Chat Gromu",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b:free",
                messages: chatMessages[activeChatId] // só mensagens reais
            })
        });

        const data = await response.json();
        typingDiv.remove();

        if (data.choices && data.choices[0]) {
            const botReply = data.choices[0].message.content;
            chatMessages[activeChatId].push({ role: "assistant", content: botReply });
            renderMessages();
        } else {
            throw new Error(data.error?.message || "Erro desconhecido na API");
        }

    } catch (error) {
        typingDiv.remove();
        console.error("Erro no envio:", error);
        chatMessages[activeChatId].push({ role: "assistant", content: `⚠️ Erro: ${error.message}` });
        renderMessages();
    }
}


function renderMessages() {
    const box = document.getElementById('chatBox');
    if (!box) return;

    box.innerHTML = '';
    const currentMsgs = chatMessages[activeChatId] || [];

    currentMsgs.forEach(msg => {
        const div = document.createElement("div");
        div.className = `message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`;
        div.innerHTML = `<p>${msg.content}</p>`;
        box.appendChild(div);
    });

    box.scrollTop = box.scrollHeight;
}
