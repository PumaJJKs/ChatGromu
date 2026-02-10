function renderChatList() {
    const chatList = document.getElementById('chatList');
    chatList.innerHTML = '';

    chats.forEach(chat => {
        const item = document.createElement('div');
        item.className = 'chat-item' + (chat.id === activeChatId ? ' active' : '');

        // BOTÃO DO CHAT
        const chatBtn = document.createElement('button');
        chatBtn.className = 'chat-btn';
        chatBtn.textContent = chat.title;
        chatBtn.onclick = () => selectChat(chat.id);

        // BOTÃO EDITAR ✏️
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-chat';
        editBtn.setAttribute('aria-label', 'Editar nome do chat');
        editBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25z"
                      fill="currentColor"/>
            </svg>
        `;
        editBtn.onclick = (e) => {
            e.stopPropagation();
            enableChatRename(chat, chatBtn);
        };

        // BOTÃO APAGAR 🗑️
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-chat';
        deleteBtn.setAttribute('aria-label', 'Apagar chat');
        deleteBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M6 7h12M9 7V5h6v2M10 11v6M14 11v6M5 7l1 14h12l1-14"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
            </svg>
        `;
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteChat(chat.id);
        };

        // ADICIONAR AO DOM
        item.appendChild(chatBtn);
        item.appendChild(editBtn);
        item.appendChild(deleteBtn);
        chatList.appendChild(item);
    });
}
let chats = [];
let activeChatId = null;
let chatMessages = {}; // Store messages per chat

function createNewChat() {
    const chatId = Date.now();

    const newChat = {
        id: chatId,
        title: `Chat ${chats.length + 1}`
    };

    chats.push(newChat);
    activeChatId = chatId;

    renderChatList();
    renderMessages();
    document.getElementById('chatInput').focus();
}




/* Lista de chats(só funciona quando realmente der para criar chats) */



/* carregar chats antigos */

function selectChat(chatId) {
    activeChatId = chatId;
    renderChatList();
    renderMessages();
}


/* Deletar os chats antigos */

function deleteChat(chatId) {
    chats = chats.filter(chat => chat.id !== chatId);
    delete chatMessages[chatId]; // Remove messages for deleted chat

    if (activeChatId === chatId) {
        activeChatId = null;
        renderMessages(); // Clear chat area if active chat was deleted
    }

    renderChatList();
}

/* Renderizar mensagens do chat ativo */
function renderMessages() {
    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML = '';

    if (activeChatId && chatMessages[activeChatId]) {
        chatMessages[activeChatId].forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user-message';
            messageDiv.innerHTML = `<p>${msg}</p>`;
            chatArea.appendChild(messageDiv);
        });

        // Scroll to bottom
        chatArea.scrollTop = chatArea.scrollHeight;
    }
}

/* Enviar mensagem */
function enviarMensagem() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (message === '') return;

    // 🧠 Se não houver chat ativo, cria um automaticamente
    if (!activeChatId) {
        const chatId = Date.now();

        const newChat = {
            id: chatId,
            title: `Chat ${chats.length + 1}`
        };

        chats.push(newChat);
        activeChatId = chatId;
        renderChatList();
    }

    // Inicializa mensagens do chat se necessário
    if (!chatMessages[activeChatId]) {
        chatMessages[activeChatId] = [];
    }

    chatMessages[activeChatId].push(message);
    if (chatMessages[activeChatId].length === 1) {
    const chat = chats.find(c => c.id === activeChatId);
    chat.title = message.slice(0, 20) + '...';
    renderChatList();
}


    renderMessages();
    input.value = '';
}

function enableChatRename(chat, buttonElement) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = chat.title;
    input.className = 'chat-rename-input';

    buttonElement.replaceWith(input);
    input.focus();
    input.select();

    function save() {
        const newTitle = input.value.trim();
        chat.title = newTitle !== '' ? newTitle : chat.title;
        renderChatList();
    }

    input.addEventListener('blur', save);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') save();
        if (e.key === 'Escape') renderChatList();
    });
}
