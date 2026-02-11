// Estas variáveis são globais e serão usadas pela API e pelo Config
var chats = [];
var activeChatId = null;
var chatMessages = {}; 

function renderChatList() {
    const chatList = document.getElementById('chatList');
    if (!chatList) return;
    chatList.innerHTML = '';

    chats.forEach(chat => {
        const item = document.createElement('div');
        item.className = 'chat-item' + (chat.id === activeChatId ? ' active' : '');

        const chatBtn = document.createElement('button');
        chatBtn.className = 'chat-btn';
        chatBtn.textContent = chat.title;
        chatBtn.onclick = () => selectChat(chat.id);

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-chat';
        editBtn.innerHTML = `✏️`; // Podes manter o teu SVG aqui
        editBtn.onclick = (e) => {
            e.stopPropagation();
            enableChatRename(chat, chatBtn);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-chat';
        deleteBtn.innerHTML = `🗑️`;
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteChat(chat.id);
        };

        item.appendChild(chatBtn);
        item.appendChild(editBtn);
        item.appendChild(deleteBtn);
        chatList.appendChild(item);
    });
}

function createNewChat() {
    const chatId = Date.now();
    const newChat = {
        id: chatId,
        title: `Chat ${chats.length + 1}`
    };
    chats.push(newChat);
    chatMessages[chatId] = []; 
    activeChatId = chatId;

    renderChatList();
    renderMessages(); // Esta função está no APImensagens.js
    document.getElementById('chatInput').focus();
}

function selectChat(chatId) {
    activeChatId = chatId;
    renderChatList();
    renderMessages();
}

function deleteChat(chatId) {
    chats = chats.filter(chat => chat.id !== chatId);
    delete chatMessages[chatId];
    if (activeChatId === chatId) {
        activeChatId = chats.length > 0 ? chats[0].id : null;
    }
    renderChatList();
    renderMessages();
}

function enableChatRename(chat, buttonElement) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'chat-rename-input';
    input.value = chat.title;

    buttonElement.replaceWith(input);
    input.focus();

    const save = () => {
        const newTitle = input.value.trim();
        if (newTitle) chat.title = newTitle;
        renderChatList();
    };

    input.onblur = save;
    input.onkeydown = (e) => {
        if (e.key === 'Enter') save();
        if (e.key === 'Escape') renderChatList();
    };
}