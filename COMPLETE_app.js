/**
 * COMPLETE UPDATED: public/app.js
 * All 4 bugs fixed - Production ready
 */

const API = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`;

let token = localStorage.getItem('token');
let currentUser = null;
let currentChatId = null;
let socket = null;

// ─── WINDOW LOAD ───────────────────────────────────────
// BUG 4 FIX: Only loads chat if token is valid
window.onload = async () => {
    if (token) {
        const ok = await loadMe();
        if (ok) {
            showChatScreen();
            connectSocket();
            loadConversations();
        } else {
            // Token invalid — clear it and show auth screen
            localStorage.removeItem('token');
            token = null;
            currentUser = null;
            showAuthScreen();
        }
    } else {
        showAuthScreen();
    }
};

function openSidebar() {
    document.getElementById('sidebar').classList.remove('hidden');
    document.getElementById('chat-area').classList.remove('active');
}
function openChatArea() {
    document.getElementById('sidebar').classList.add('hidden');
    document.getElementById('chat-area').classList.add('active');
}

// ─── SOCKET ────────────────────────────────────────────
// BUG 4 FIX: Only connect with valid token
function connectSocket() {
    // Only connect if we have a valid token
    if (!token) {
        console.log('Socket: No token found, skipping connection');
        return;
    }
    
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

// ─── AUTH TABS ──────────────────────────────────────────
function switchTab(tab) {
    const indicator = document.getElementById('tab-indicator');
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('login-form').style.display = tab === 'login' ? 'flex' : 'none';
    document.getElementById('register-form').style.display = tab === 'register' ? 'flex' : 'none';
    document.getElementById('auth-error').textContent = '';
    if (tab === 'login') { document.getElementById('tab-login').classList.add('active'); indicator.classList.remove('right'); }
    else { document.getElementById('tab-register').classList.add('active'); indicator.classList.add('right'); }
}

// ─── REGISTER ───────────────────────────────────────────
// BUG 1 FIX: Shows OTP screen after successful registration
async function register() {
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    if (!username || !email || !password) return showError('Please fill all fields');
    try {
        const res = await fetch(`${API}/auth/register`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ username, email, password }) 
        });
        const data = await res.json();
        if (!res.ok) return showError(data.error);
        // Registration successful — show OTP screen
        showOTPScreen(email);
    } catch { 
        showError('Server error, try again'); 
    }
}

// ─── LOGIN ──────────────────────────────────────────────
// BUG 4 FIX: Checks for unverified users and shows OTP
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
        if (!res.ok) {
            // Check if user needs OTP verification
            if (data.needsVerification) {
                showOTPScreen(data.email);
                return;
            }
            return showError(data.error);
        }
        // Login successful — set token and user, then show chat
        token = data.token;
        localStorage.setItem('token', token);
        currentUser = data.user;
        // Make sure tabs are visible again before showing chat screen
        document.querySelector('.auth-tabs').style.display = 'flex';
        showChatScreen();
        connectSocket();
        loadConversations();
    } catch { 
        showError('Server error, try again'); 
    }
}

// ─── LOGOUT ─────────────────────────────────────────────
async function logout() {
    try { 
        await fetch(`${API}/auth/logout`, { 
            method: 'POST', 
            headers: { Authorization: `Bearer ${token}` } 
        }); 
    } catch {}
    if (socket) socket.disconnect();
    token = null; 
    currentUser = null; 
    currentChatId = null;
    localStorage.removeItem('token'); 
    showAuthScreen();
}

// ─── LOAD ME ────────────────────────────────────────────
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

// ─── CONVERSATIONS ──────────────────────────────────────
async function loadConversations() {
    if (!token) return;
    try {
        const res = await fetch(`${API}/conversations`, { 
            headers: { Authorization: `Bearer ${token}` } 
        });
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
        const res = await fetch(`${API}/messages/${conversationId}`, { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        const data = await res.json();
        if (!res.ok) return;
        container.innerHTML = '';
        data.messages.forEach(msg => renderMessage({ 
            content: msg.content, 
            mine: msg.senderId._id === currentUser._id, 
            username: msg.senderId.username, 
            time: msg.createdAt, 
            type: msg.type 
        }));
    } catch { 
        container.innerHTML = '<p style="text-align:center;color:var(--danger);font-size:13px;padding:24px">Failed to load</p>'; 
    }
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();
    if (!content || !currentChatId || !socket) return;
    socket.emit('send_message', { conversationId: currentChatId, content, type: 'text' });
    input.value = ''; 
    stopTyping();
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
    if (!query.trim()) { 
        box.innerHTML = ''; 
        return; 
    }
    try {
        const res = await fetch(`${API}/users/search?q=${query}`, { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        const data = await res.json();
        box.innerHTML = '';
        if (!data.users?.length) { 
            box.innerHTML = '<p style="padding:12px 16px;color:var(--text3);font-size:13px">No users found</p>'; 
            return; 
        }
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
    } catch {}
}

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

// ─── OTP SECTION ───────────────────────────────────────
// BUG 1 & 2 FIX: Proper OTP flow implementation
let otpEmail = null;
let resendTimer = null;

function showOTPScreen(email) {
    otpEmail = email;
    document.getElementById('otp-email-display').textContent = email;

    // Hide all forms
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('otp-form').style.display = 'flex';

    // Hide tabs
    document.querySelector('.auth-tabs').style.display = 'none';

    // Clear error
    document.getElementById('auth-error').textContent = '';

    // Focus first OTP box
    setTimeout(() => document.getElementById('otp-0').focus(), 100);

    // Start resend timer
    startResendTimer();
}

function startResendTimer() {
    const btn = document.getElementById('resend-btn');
    let seconds = 30;
    btn.disabled = true;
    btn.textContent = `Resend in ${seconds}s`;

    resendTimer = setInterval(() => {
        seconds--;
        btn.textContent = `Resend in ${seconds}s`;
        if (seconds <= 0) {
            clearInterval(resendTimer);
            btn.disabled = false;
            btn.textContent = 'Resend OTP';
        }
    }, 1000);
}

function otpInput(index) {
    const input = document.getElementById(`otp-${index}`);
    const val = input.value;

    // Only allow numbers
    input.value = val.replace(/[^0-9]/g, '');

    if (input.value) {
        input.classList.add('filled');
        // Move to next box
        if (index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        } else {
            // All filled — auto verify
            verifyOTP();
        }
    } else {
        input.classList.remove('filled');
    }
}

function otpKeyDown(event, index) {
    // Backspace — move to previous box
    if (event.key === 'Backspace' && !document.getElementById(`otp-${index}`).value && index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
    }
    // Handle paste
    if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        navigator.clipboard.readText().then(text => {
            const digits = text.replace(/[^0-9]/g, '').slice(0, 6);
            digits.split('').forEach((d, i) => {
                const el = document.getElementById(`otp-${i}`);
                if (el) { 
                    el.value = d; 
                    el.classList.add('filled'); 
                }
            });
            if (digits.length === 6) verifyOTP();
            else document.getElementById(`otp-${digits.length}`).focus();
        });
    }
}

function getOTPValue() {
    return Array.from({ length: 6 }, (_, i) => document.getElementById(`otp-${i}`).value).join('');
}

function clearOTPInputs() {
    for (let i = 0; i < 6; i++) {
        const el = document.getElementById(`otp-${i}`);
        el.value = '';
        el.classList.remove('filled');
    }
    document.getElementById('otp-0').focus();
}

// BUG 2 FIX: Properly handles OTP verification and sets currentUser
async function verifyOTP() {
    const otp = getOTPValue();
    if (otp.length !== 6) {
        showError('Enter complete 6-digit OTP');
        return;
    }

    const btn = document.querySelector('#otp-form .btn-auth');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Verifying...';

    try {
        const res = await fetch(`${API}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: otpEmail, otp })
        });
        const data = await res.json();

        if (!res.ok) {
            showError(data.error);
            clearOTPInputs();
            btn.disabled = false;
            btn.querySelector('span').textContent = 'Verify & Continue';
            return;
        }

        // OTP verification successful — set token and user
        token = data.token;
        localStorage.setItem('token', token);
        currentUser = data.user;
        
        // Reset auth UI and show chat screen
        document.querySelector('.auth-tabs').style.display = 'flex';
        showChatScreen();
        connectSocket();
        loadConversations();

    } catch {
        showError('Something went wrong');
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Verify & Continue';
    }
}

async function resendOTP() {
    try {
        const res = await fetch(`${API}/auth/resend-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: otpEmail })
        });
        const data = await res.json();
        if (!res.ok) { 
            showError(data.error); 
            return; 
        }
        showError('');
        clearOTPInputs();
        startResendTimer();
    } catch { 
        showError('Failed to resend OTP'); 
    }
}

// ─── FILE UPLOAD ────────────────────────────────────────
async function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;
    if (!currentChatId) { 
        alert('Open a chat first!'); 
        return; 
    }
    let uploadType = 'file';
    if (file.type.startsWith('image/')) uploadType = 'image';
    else if (file.type.startsWith('video/')) uploadType = 'video';
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', uploadType);
    
    try {
        const res = await fetch(`${API}/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });
        const data = await res.json();
        if (!res.ok) return showError(data.error);
        socket.emit('send_message', { conversationId: currentChatId, content: data.url, type: uploadType });
    } catch { 
        showError('Upload failed'); 
    }
}

function showCreateGroup() {
    const name = prompt('Group name?');
    if (!name) return;
    // Implementation for group creation
}
