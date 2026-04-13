// Yeh hona chahiye
const API = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`;
let token = localStorage.getItem('token');
let currentUser = null;
let currentChatId = null;
let socket = null;

// ─── STARTUP ───────────────────────────────────────────
window.onload = async () => {
    if (token) {
        const ok = await loadMe();
        if (ok) {
            showChatScreen();
            connectSocket();
            loadConversations();
        } else {
            showAuthScreen();
        }
    } else {
        showAuthScreen();
    }
};

// ─── SOCKET CONNECT ────────────────────────────────────
function connectSocket() {
    const socketURL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : window.location.origin;

    socket = io(socketURL, {
        auth: { token }
    });

    socket.on('connect', () => {
        console.log('Socket connected!', socket.id);
    });

    socket.on('connect_error', (err) => {
        console.log('Socket error:', err.message);
    });

    socket.on('message_received', ({ message, conversationId }) => {
        if (currentChatId === conversationId) {
            addMessage({
                content: message.content,
                mine: message.senderId._id === currentUser._id,
                username: message.senderId.username,
                time: message.createdAt,
                type: message.type
            });
        }
        updateConversationLastMessage(
            conversationId,
            message.type === 'text' ? message.content : `📎 ${message.type}`
        );
    });

    socket.on('user_typing', ({ username, conversationId }) => {
        if (currentChatId === conversationId) {
            document.getElementById('chat-status').textContent = `${username} typing...`;
        }
    });

    socket.on('user_stop_typing', ({ conversationId }) => {
        if (currentChatId === conversationId) {
            document.getElementById('chat-status').textContent = '';
        }
    });

    socket.on('user_online', ({ userId }) => {
        updateUserStatus(userId, 'online');
    });

    socket.on('user_offline', ({ userId, lastSeen }) => {
        updateUserStatus(userId, 'offline', lastSeen);
    });

    socket.on('error', (err) => {
        console.log('Socket error:', err.message);
    });
}

// ─── AUTH ──────────────────────────────────────────────
function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
    document.getElementById('auth-error').textContent = '';
}

async function register() {
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    if (!username || !email || !password) {
        return showError('Please fill all fields');
    }

    try {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();
        if (!res.ok) return showError(data.error);

        token = data.token;
        localStorage.setItem('token', token);
        currentUser = data.user;
        showChatScreen();
        connectSocket();
        loadConversations();

    } catch (err) {
        showError('Server error, try again');
    }
}

async function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) return showError('Please fill all fields');

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) return showError(data.error);

        token = data.token;
        localStorage.setItem('token', token);
        currentUser = data.user;
        showChatScreen();
        connectSocket();
        loadConversations();

    } catch (err) {
        showError('Server error, try again');
    }
}

async function logout() {
    try {
        await fetch(`${API}/auth/logout`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (e) {}

    if (socket) socket.disconnect();
    token = null;
    currentUser = null;
    currentChatId = null;
    localStorage.removeItem('token');
    showAuthScreen();
}

async function loadMe() {
    try {
        const res = await fetch(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) return false;
        currentUser = data.user;
        return true;
    } catch {
        return false;
    }
}

// ─── CONVERSATIONS ─────────────────────────────────────
async function loadConversations() {
    try {
        const res = await fetch(`${API}/conversations`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) return;
        renderConversations(data.conversations);
    } catch (e) {}
}

function renderConversations(conversations) {
    const list = document.getElementById('chats-list');
    list.innerHTML = '';

    if (!conversations.length) {
        list.innerHTML = '<p style="padding:16px;color:#555;font-size:13px">No chats yet — search a user to start!</p>';
        return;
    }

    conversations.forEach(conv => {
        const name = getConvName(conv);
        const lastMsg = conv.lastMessage?.content || 'No messages yet';
        const lastMsgDisplay = conv.lastMessage?.type !== 'text' ? `📎 ${conv.lastMessage?.type}` : lastMsg;
        const initial = name[0].toUpperCase();

        const div = document.createElement('div');
        div.className = `chat-item ${currentChatId === conv._id ? 'active' : ''}`;
        div.id = `conv-${conv._id}`;
        div.innerHTML = `
            <div class="avatar">${initial}</div>
            <div class="chat-item-info">
                <p>${name}</p>
                <span id="last-msg-${conv._id}">${lastMsgDisplay}</span>
            </div>
        `;
        div.onclick = () => openChat(conv);
        list.appendChild(div);
    });
}

function getConvName(conv) {
    if (conv.type === 'group') return conv.name;
    const other = conv.members.find(m => m._id !== currentUser._id);
    return other?.username || 'Unknown';
}

function updateConversationLastMessage(convId, content) {
    const el = document.getElementById(`last-msg-${convId}`);
    if (el) el.textContent = content;
}

function updateUserStatus(userId, status, lastSeen) {
    if (currentChatId) {
        const statusEl = document.getElementById('chat-status');
        if (statusEl) {
            statusEl.textContent = status === 'online' ? 'online' : 'offline';
            statusEl.style.color = status === 'online' ? '#22c55e' : '#aaa';
        }
    }
}

// ─── OPEN CHAT ─────────────────────────────────────────
async function openChat(conv) {
    currentChatId = conv._id;

    document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
    const convEl = document.getElementById(`conv-${conv._id}`);
    if (convEl) convEl.classList.add('active');

    const name = getConvName(conv);
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('active-chat').style.display = 'flex';
    document.getElementById('active-chat').style.flexDirection = 'column';
    document.getElementById('active-chat').style.height = '100%';
    document.getElementById('chat-name').textContent = name;
    document.getElementById('chat-avatar').textContent = name[0].toUpperCase();

    if (conv.type === 'dm') {
        const other = conv.members.find(m => m._id !== currentUser._id);
        const statusEl = document.getElementById('chat-status');
        statusEl.textContent = other?.status || 'offline';
        statusEl.style.color = other?.status === 'online' ? '#22c55e' : '#aaa';
    } else {
        document.getElementById('chat-status').textContent = `${conv.members.length} members`;
    }

    if (socket) socket.emit('join_conversation', conv._id);

    await loadMessages(conv._id);

    document.getElementById('search-results').innerHTML = '';
    document.getElementById('search-input').value = '';
}

// ─── MESSAGES ──────────────────────────────────────────
async function loadMessages(conversationId) {
    const container = document.getElementById('messages-container');
    container.innerHTML = '<p style="text-align:center;color:#555;font-size:13px;padding:20px">Loading...</p>';

    try {
        const res = await fetch(`${API}/messages/${conversationId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) return;

        container.innerHTML = '';
        data.messages.forEach(msg => {
            addMessage({
                content: msg.content,
                mine: msg.senderId._id === currentUser._id,
                username: msg.senderId.username,
                time: msg.createdAt,
                type: msg.type
            });
        });

    } catch (e) {
        container.innerHTML = '<p style="text-align:center;color:#f87171;font-size:13px;padding:20px">Failed to load messages</p>';
    }
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();
    if (!content || !currentChatId || !socket) return;

    socket.emit('send_message', {
        conversationId: currentChatId,
        content,
        type: 'text'
    });

    input.value = '';
    stopTyping();
}

function addMessage({ content, mine, username, time, type = 'text' }) {
    const container = document.getElementById('messages-container');
    const div = document.createElement('div');
    div.className = `message ${mine ? 'mine' : 'theirs'}`;

    const timeStr = time
        ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let contentHTML = '';
    if (type === 'image') {
        contentHTML = `<img src="${content}" 
            style="max-width:200px;border-radius:8px;display:block;margin-bottom:4px;cursor:pointer" 
            onclick="window.open('${content}')" />`;
    } else if (type === 'video') {
        contentHTML = `<video src="${content}" controls 
            style="max-width:200px;border-radius:8px;display:block;margin-bottom:4px"></video>`;
    } else if (type === 'file') {
        contentHTML = `<a href="${content}" target="_blank" 
            style="color:#a78bfa;text-decoration:underline">📎 Download File</a>`;
    } else {
        contentHTML = content;
    }

    div.innerHTML = `
        ${!mine ? `<div style="font-size:11px;opacity:0.6;margin-bottom:3px">${username}</div>` : ''}
        ${contentHTML}
        <div class="time">${timeStr}</div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// ─── TYPING ────────────────────────────────────────────
let typingTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('message-input');
    if (input) {
        input.addEventListener('input', () => {
            if (!socket || !currentChatId) return;
            socket.emit('typing', { conversationId: currentChatId });
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(stopTyping, 2000);
        });
    }
});

function stopTyping() {
    if (socket && currentChatId) {
        socket.emit('stop_typing', { conversationId: currentChatId });
    }
    clearTimeout(typingTimeout);
}

// ─── SEARCH USERS ──────────────────────────────────────
async function searchUsers(query) {
    const box = document.getElementById('search-results');
    if (!query.trim()) { box.innerHTML = ''; return; }

    try {
        const res = await fetch(`${API}/users/search?q=${query}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        box.innerHTML = '';
        if (!data.users?.length) {
            box.innerHTML = '<p style="padding:12px 16px;color:#555;font-size:13px">No users found</p>';
            return;
        }

        data.users.forEach(user => {
            const div = document.createElement('div');
            div.className = 'chat-item';
            div.innerHTML = `
                <div class="avatar">${user.username[0].toUpperCase()}</div>
                <div class="chat-item-info">
                    <p>${user.username}</p>
                    <span>${user.status === 'online' ? '🟢 online' : '⚫ offline'}</span>
                </div>
            `;
            div.onclick = () => startDM(user);
            box.appendChild(div);
        });
    } catch (e) {}
}

async function startDM(user) {
    try {
        const res = await fetch(`${API}/conversations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userId: user._id })
        });
        const data = await res.json();
        if (!res.ok) return;

        await loadConversations();
        openChat(data.conversation);

    } catch (e) {}
}

// ─── SCREEN HELPERS ────────────────────────────────────
function showAuthScreen() {
    document.getElementById('auth-screen').style.display = 'block';
    document.getElementById('chat-screen').style.display = 'none';
}

function showChatScreen() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('chat-screen').style.display = 'flex';
    updateMyProfile();
}

function updateMyProfile() {
    if (!currentUser) return;
    document.getElementById('my-username').textContent = currentUser.username;
    document.getElementById('my-avatar').textContent = currentUser.username[0].toUpperCase();
}

function showError(msg) {
    document.getElementById('auth-error').textContent = msg;
}

// ─── FILE UPLOAD ───────────────────────────────────────
async function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;

    if (!currentChatId) {
        alert('Pehle koi chat open karo!');
        return;
    }

    let uploadType = 'file';
    if (file.type.startsWith('image/')) uploadType = 'image';
    else if (file.type.startsWith('video/')) uploadType = 'video';

    const progress = document.getElementById('upload-progress');
    progress.textContent = `Uploading ${file.name}...`;
    progress.classList.add('show');

    try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API}/upload/${uploadType}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            progress.textContent = 'Upload failed: ' + data.error;
            setTimeout(() => progress.classList.remove('show'), 3000);
            return;
        }

        socket.emit('send_message', {
            conversationId: currentChatId,
            content: data.url,
            type: uploadType,
            fileName: file.name,
            fileSize: file.size
        });

        progress.textContent = 'Sent!';
        setTimeout(() => progress.classList.remove('show'), 1500);

    } catch (err) {
        progress.textContent = 'Upload failed!';
        setTimeout(() => progress.classList.remove('show'), 2000);
    } finally {
        input.value = '';
    }
}

// ─── GROUP CREATE ──────────────────────────────────────
let selectedMembers = []; // { _id, username }

function showCreateGroup() {
    selectedMembers = [];
    document.getElementById('group-name').value = '';
    document.getElementById('group-search').value = '';
    document.getElementById('group-search-results').innerHTML = '';
    document.getElementById('selected-members').innerHTML = '';
    document.getElementById('group-error').textContent = '';
    document.getElementById('group-modal').style.display = 'flex';
}

function hideCreateGroup() {
    document.getElementById('group-modal').style.display = 'none';
}

async function searchGroupUsers(query) {
    const box = document.getElementById('group-search-results');
    if (!query.trim()) { box.innerHTML = ''; return; }

    try {
        const res = await fetch(`${API}/users/search?q=${query}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        box.innerHTML = '';

        if (!data.users?.length) {
            box.innerHTML = '<p style="padding:8px;color:#555;font-size:12px">No users found</p>';
            return;
        }

        data.users.forEach(user => {
            // Pehle se selected hai toh skip karo
            if (selectedMembers.find(m => m._id === user._id)) return;

            const div = document.createElement('div');
            div.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px;cursor:pointer;border-radius:6px';
            div.onmouseover = () => div.style.background = '#2a2a2a';
            div.onmouseout = () => div.style.background = 'transparent';
            div.innerHTML = `
                <div style="width:28px;height:28px;border-radius:50%;background:#7c3aed;display:flex;align-items:center;justify-content:center;font-size:12px">${user.username[0].toUpperCase()}</div>
                <span style="font-size:13px">${user.username}</span>
            `;
            div.onclick = () => addMemberToGroup(user);
            box.appendChild(div);
        });
    } catch (e) {}
}

function addMemberToGroup(user) {
    if (selectedMembers.find(m => m._id === user._id)) return;

    selectedMembers.push(user);

    // Selected members dikhao
    const container = document.getElementById('selected-members');
    const pill = document.createElement('div');
    pill.id = `member-${user._id}`;
    pill.style.cssText = 'display:flex;align-items:center;gap:4px;background:#2a2a2a;padding:4px 8px;border-radius:20px;font-size:12px';
    pill.innerHTML = `
        ${user.username}
        <span onclick="removeMemberFromGroup('${user._id}')" style="cursor:pointer;color:#f87171;margin-left:2px">×</span>
    `;
    container.appendChild(pill);

    // Search clear karo
    document.getElementById('group-search').value = '';
    document.getElementById('group-search-results').innerHTML = '';
}

function removeMemberFromGroup(userId) {
    selectedMembers = selectedMembers.filter(m => m._id !== userId);
    const el = document.getElementById(`member-${userId}`);
    if (el) el.remove();
}

async function createGroup() {
    const name = document.getElementById('group-name').value.trim();
    const errEl = document.getElementById('group-error');

    if (!name) {
        errEl.textContent = 'Group name required!';
        return;
    }

    if (selectedMembers.length < 1) {
        errEl.textContent = 'At least 1 member add karo!';
        return;
    }

    try {
        const res = await fetch(`${API}/conversations/group`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                members: selectedMembers.map(m => m._id)
            })
        });

        const data = await res.json();

        if (!res.ok) {
            errEl.textContent = data.error;
            return;
        }

        hideCreateGroup();
        await loadConversations();
        openChat(data.conversation);

    } catch (e) {
        errEl.textContent = 'Something went wrong!';
    }
}