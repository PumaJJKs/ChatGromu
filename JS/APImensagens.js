console.log("Enviando modelo:", "mistralai/mistral-7b-instruct:free");

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
                "HTTP-Referer": "https://pumajjks.github.io/ChatGromu/",
                "X-Title": "Chat Gromu",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "arcee-ai/trinity-large-preview:free",
                messages: chatMessages[activeChatId]
            })
        });

        const data = await response.json();
        typingDiv.remove();

        // 🔎 Se a resposta não for OK
        if (!response.ok) {
            throw new Error(data.error?.message || "Erro na OpenRouter");
        }

        // ✅ Se veio resposta válida
        if (data.choices && data.choices.length > 0) {
            const botReply = data.choices[0].message.content;

            chatMessages[activeChatId].push({
                role: "assistant",
                content: botReply
            });

            renderMessages();
        } else {
            throw new Error("Resposta inválida da API");
        }

    } catch (error) {
        typingDiv?.remove();

        console.error("Erro no envio:", error);

        chatMessages[activeChatId].push({
            role: "assistant",
            content: `⚠️ Erro: ${error.message}`
        });

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
