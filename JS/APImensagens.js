async function sendMessage() {
    const input = document.getElementById("chatInput");
    const text = input.value.trim();

    if (!text) return;
    if (!activeChatId) createNewChat();

    // Adiciona a mensagem do utilizador
    chatMessages[activeChatId].push({ "role": "user", "content": text });
    renderMessages();
    input.value = "";

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "HTTP-Referer": "http://localhost:5500", 
                "X-Title": "Chat Gromu",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // O "router/auto" tenta encontrar um modelo disponível automaticamente
                "model": "openrouter/aurora-alpha", 
                "messages": chatMessages[activeChatId]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            const botReply = data.choices[0].message.content;
            chatMessages[activeChatId].push({ "role": "assistant", "content": botReply });
            renderMessages();
        } else {
            // Se o erro persistir, vamos mostrar a mensagem real da API
            const msgErro = data.error?.message || "Erro desconhecido na API";
            throw new Error(msgErro);
        }

    } catch (error) {
        console.error("Erro no envio:", error);
        chatMessages[activeChatId].push({ 
            "role": "assistant", 
            "content": `⚠️ Erro: ${error.message}` 
        });
        renderMessages();
    }
}

function renderMessages() {
    const box = document.getElementById('chatBox'); // ID do teu HTML
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