const API = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`;

let token = localStorage.getItem('token');
let currentUser = null;
let currentChatId = null;
let socket = null;

window.onload = async () => {
    if (token) {
        const ok = await loadMe();
        if (ok) { showChatScreen(); connectSocket(); loadConversations(); }
        else showAuthScreen();
    } else showAuthScreen();
};

function openSidebar() {
    document.getElementById('sidebar').classList.remove('hidden');
    document.getElementById('chat-area').classList.remove('active');
}
function openChatArea() {
    document.getElementById('sidebar').classList.add('hidden');
    document.getElementById('chat-area').classList.add('active');
}

function connectSocket() {
    const socketURL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000' : window.location.origin;
    socket = io(socketURL, { auth: { token } });
    socket.on('connect', () => console.log('Socket connected!'));
    socket.on('connect_error', err => console.log('Socket error:', err.message));
    socket.on('message_received', ({ message, conversationId }) => {
        if (currentChatId === conversationId) {
            renderMessage({ content: message.content, mine: message.senderId._id === currentUser._id, username: message.senderId.username, time: message.createdAt, type: message.type });
        }
        updateLastMsg(conversationId, message.type === 'text' ? message.content : `📎 ${message.type}`);
    });
    socket.on('user_typing', ({ username, conversationId }) => {
        if (currentChatId === conversationId) {
            const el = document.getElementById('chat-status');
            el.textContent = `${username} typing...`;
            el.classList.add('online-text');
        }
    });
    socket.on('user_stop_typing', ({ conversationId }) => {
        if (currentChatId === conversationId) {
            document.getElementById('chat-status').classList.remove('online-text');
        }
    });
    socket.on('user_online', ({ userId }) => updateUserStatus(userId, 'online'));
    socket.on('user_offline', ({ userId }) => updateUserStatus(userId, 'offline'));
}

function switchTab(tab) {
    const indicator = document.getElementById('tab-indicator');
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('login-form').style.display = tab === 'login' ? 'flex' : 'none';
    document.getElementById('register-form').style.display = tab === 'register' ? 'flex' : 'none';
    document.getElementById('auth-error').textContent = '';
    if (tab === 'login') { document.getElementById('tab-login').classList.add('active'); indicator.classList.remove('right'); }
    else { document.getElementById('tab-register').classList.add('active'); indicator.classList.add('right'); }
}

async function register() {
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    if (!username || !email || !password) return showError('Please fill all fields');
    try {
        const res = await fetch(`${API}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, email, password }) });
        const data = await res.json();
        if (!res.ok) return showError(data.error);
        token = data.token; localStorage.setItem('token', token); currentUser = data.user;
        showChatScreen(); connectSocket(); loadConversations();
    } catch { showError('Server error, try again'); }
}

async function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if (!email || !password) return showError('Please fill all fields');
    try {
        const res = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        const data = await res.json();
        if (!res.ok) return showError(data.error);
        token = data.token; localStorage.setItem('token', token); currentUser = data.user;
        showChatScreen(); connectSocket(); loadConversations();
    } catch { showError('Server error, try again'); }
}

async function logout() {
    try { await fetch(`${API}/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); } catch {}
    if (socket) socket.disconnect();
    token = null; currentUser = null; currentChatId = null;
    localStorage.removeItem('token'); showAuthScreen();
}

async function loadMe() {
    try {
        const res = await fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) return false;
        currentUser = data.user; return true;
    } catch { return false; }
}

async function loadConversations() {
    try {
        const res = await fetch(`${API}/conversations`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) return;
        renderConversations(data.conversations);
        if (data.conversations.length > 0) {
            openChat(data.conversations[0]);
        }
    } catch {}
}

function renderConversations(conversations) {
    const list = document.getElementById('chats-list');
    list.innerHTML = '';
    if (!conversations.length) {
        list.innerHTML = '<p style="padding:24px 16px;color:var(--text3);font-size:13px;text-align:center">No conversations yet<br>Search someone to start!</p>';
        return;
    }
    conversations.forEach(conv => {
        const name = getConvName(conv);
        const lastMsg = conv.lastMessage ? (conv.lastMessage.type !== 'text' ? `📎 ${conv.lastMessage.type}` : conv.lastMessage.content) : 'No messages yet';
        const div = document.createElement('div');
        div.className = `chat-item ${currentChatId === conv._id ? 'active' : ''}`;
        div.id = `conv-${conv._id}`;
        div.innerHTML = `
            <div class="chat-item-av">${name[0].toUpperCase()}</div>
            <div class="chat-item-body">
                <div class="chat-item-name">${name}</div>
                <div class="chat-item-last" id="last-msg-${conv._id}">${lastMsg}</div>
            </div>`;
        div.onclick = () => openChat(conv);
        list.appendChild(div);
    });
}

function getConvName(conv) {
    if (conv.type === 'group') return conv.name;
    const other = conv.members.find(m => m._id !== currentUser._id);
    return other?.username || 'Unknown';
}

function updateLastMsg(convId, content) {
    const el = document.getElementById(`last-msg-${convId}`);
    if (el) el.textContent = content;
}

function updateUserStatus(userId, status) {
    const el = document.getElementById('chat-status');
    if (el) {
        el.textContent = status === 'online' ? 'online' : 'offline';
        el.className = 'chat-hstatus' + (status === 'online' ? ' online-text' : '');
    }
}

async function openChat(conv) {
    currentChatId = conv._id;
    document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
    const convEl = document.getElementById(`conv-${conv._id}`);
    if (convEl) convEl.classList.add('active');
    const name = getConvName(conv);
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('active-chat').style.display = 'flex';
    document.getElementById('chat-name').textContent = name;
    document.getElementById('chat-avatar').textContent = name[0].toUpperCase();
    const statusEl = document.getElementById('chat-status');
    if (conv.type === 'dm') {
        const other = conv.members.find(m => m._id !== currentUser._id);
        statusEl.textContent = other?.status || 'offline';
        statusEl.className = 'chat-hstatus' + (other?.status === 'online' ? ' online-text' : '');
    } else {
        statusEl.textContent = `${conv.members.length} members`;
        statusEl.className = 'chat-hstatus';
    }
    if (socket) socket.emit('join_conversation', conv._id);
    await loadMessages(conv._id);
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('search-input').value = '';
    openChatArea();
}

async function loadMessages(conversationId) {
    const container = document.getElementById('messages-container');
    container.innerHTML = '<p style="text-align:center;color:var(--text3);font-size:13px;padding:24px">Loading...</p>';
    try {
        const res = await fetch(`${API}/messages/${conversationId}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) return;
        container.innerHTML = '';
        data.messages.forEach(msg => renderMessage({ content: msg.content, mine: msg.senderId._id === currentUser._id, username: msg.senderId.username, time: msg.createdAt, type: msg.type }));
    } catch { container.innerHTML = '<p style="text-align:center;color:var(--danger);font-size:13px;padding:24px">Failed to load</p>'; }
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();
    if (!content || !currentChatId || !socket) return;
    socket.emit('send_message', { conversationId: currentChatId, content, type: 'text' });
    input.value = ''; stopTyping();
}

function renderMessage({ content, mine, username, time, type = 'text' }) {
    const container = document.getElementById('messages-container');
    const wrap = document.createElement('div');
    wrap.className = `msg-wrap ${mine ? 'mine' : 'theirs'}`;
    const timeStr = time ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let contentHTML = '';
    if (type === 'image') contentHTML = `<img src="${content}" onclick="window.open('${content}')" loading="lazy"/>`;
    else if (type === 'video') contentHTML = `<video src="${content}" controls></video>`;
    else if (type === 'file') contentHTML = `<a href="${content}" target="_blank">📎 Download file</a>`;
    else contentHTML = content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    wrap.innerHTML = `
        ${!mine ? `<div class="msg-sender">${username}</div>` : ''}
        <div class="msg-bubble">${contentHTML}</div>
        <div class="msg-time">${timeStr}</div>`;
    container.appendChild(wrap);
    container.scrollTop = container.scrollHeight;
}

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
    if (socket && currentChatId) socket.emit('stop_typing', { conversationId: currentChatId });
    clearTimeout(typingTimeout);
}

async function searchUsers(query) {
    const box = document.getElementById('search-results');
    if (!query.trim()) { box.innerHTML = ''; return; }
    try {
        const res = await fetch(`${API}/users/search?q=${query}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        box.innerHTML = '';
        if (!data.users?.length) { box.innerHTML = '<p style="padding:12px 16px;color:var(--text3);font-size:13px">No users found</p>'; return; }
        data.users.forEach(user => {
            const div = document.createElement('div');
            div.className = 's-result-item';
            div.innerHTML = `<div class="s-av">${user.username[0].toUpperCase()}</div><div><div class="s-name">${user.username}</div><div class="s-sub">${user.status === 'online' ? '🟢 online' : '⚫ offline'}</div></div>`;
            div.onclick = () => startDM(user);
            box.appendChild(div);
        });
    } catch {}
}

async function startDM(user) {
    try {
        const res = await fetch(`${API}/conversations`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ userId: user._id }) });
        const data = await res.json();
        if (!res.ok) return;
        await loadConversations(); openChat(data.conversation);
    } catch {}
}

function showAuthScreen() { document.getElementById('auth-screen').style.display = 'block'; document.getElementById('chat-screen').style.display = 'none'; }
function showChatScreen() { document.getElementById('auth-screen').style.display = 'none'; document.getElementById('chat-screen').style.display = 'flex'; updateMyProfile(); }
function updateMyProfile() { if (!currentUser) return; document.getElementById('my-username').textContent = currentUser.username; document.getElementById('my-avatar').textContent = currentUser.username[0].toUpperCase(); }
function showError(msg) { document.getElementById('auth-error').textContent = msg; }

async function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;
    if (!currentChatId) { alert('Open a chat first!'); return; }
    let uploadType = 'file';
    if (file.type.startsWith('image/')) uploadType = 'image';
    else if (file.type.startsWith('video/')) uploadType = 'video';
    const progress = document.getElementById('upload-progress');
    const progressText = document.getElementById('upload-progress-text');
    progressText.textContent = `Uploading ${file.name}...`;
    progress.classList.add('show');
    try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API}/upload/${uploadType}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
        const data = await res.json();
        if (!res.ok) { progressText.textContent = 'Upload failed'; setTimeout(() => progress.classList.remove('show'), 2000); return; }
        socket.emit('send_message', { conversationId: currentChatId, content: data.url, type: uploadType, fileName: file.name, fileSize: file.size });
        progressText.textContent = 'Sent!';
        setTimeout(() => progress.classList.remove('show'), 1200);
    } catch { progressText.textContent = 'Upload failed'; setTimeout(() => progress.classList.remove('show'), 2000); }
    finally { input.value = ''; }
}

let selectedMembers = [];
function showCreateGroup() {
    selectedMembers = [];
    ['group-name','group-search'].forEach(id => document.getElementById(id).value = '');
    ['group-search-results','selected-members'].forEach(id => document.getElementById(id).innerHTML = '');
    document.getElementById('group-error').textContent = '';
    document.getElementById('group-modal').style.display = 'flex';
}
function hideCreateGroup() { document.getElementById('group-modal').style.display = 'none'; }

async function searchGroupUsers(query) {
    const box = document.getElementById('group-search-results');
    if (!query.trim()) { box.innerHTML = ''; return; }
    try {
        const res = await fetch(`${API}/users/search?q=${query}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        box.innerHTML = '';
        if (!data.users?.length) { box.innerHTML = '<p style="padding:8px;color:var(--text3);font-size:12px">No users found</p>'; return; }
        data.users.forEach(user => {
            if (selectedMembers.find(m => m._id === user._id)) return;
            const div = document.createElement('div');
            div.className = 'g-result-item';
            div.innerHTML = `<div class="g-av">${user.username[0].toUpperCase()}</div><span style="font-size:13px">${user.username}</span>`;
            div.onclick = () => addToGroup(user);
            box.appendChild(div);
        });
    } catch {}
}

function addToGroup(user) {
    if (selectedMembers.find(m => m._id === user._id)) return;
    selectedMembers.push(user);
    const chips = document.getElementById('selected-members');
    const chip = document.createElement('div');
    chip.className = 'chip'; chip.id = `chip-${user._id}`;
    chip.innerHTML = `${user.username}<span class="chip-remove" onclick="removeFromGroup('${user._id}')">×</span>`;
    chips.appendChild(chip);
    document.getElementById('group-search').value = '';
    document.getElementById('group-search-results').innerHTML = '';
}

function removeFromGroup(userId) {
    selectedMembers = selectedMembers.filter(m => m._id !== userId);
    const el = document.getElementById(`chip-${userId}`);
    if (el) el.remove();
}

async function createGroup() {
    const name = document.getElementById('group-name').value.trim();
    const errEl = document.getElementById('group-error');
    if (!name) { errEl.textContent = 'Group name required'; return; }
    if (selectedMembers.length < 1) { errEl.textContent = 'Add at least 1 member'; return; }
    try {
        const res = await fetch(`${API}/conversations/group`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ name, members: selectedMembers.map(m => m._id) }) });
        const data = await res.json();
        if (!res.ok) { errEl.textContent = data.error; return; }
        hideCreateGroup(); await loadConversations(); openChat(data.conversation);
    } catch { errEl.textContent = 'Something went wrong'; }
}