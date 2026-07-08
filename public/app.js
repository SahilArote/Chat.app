const API = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`;

let token = localStorage.getItem('token');
let currentUser = null;
let currentChatId = null;
let activeChatOtherUserId = null;
let socket = null;

// WhatsApp features globals
let currentFilter = 'all';
let replyingToMessage = null;
let conversationsData = [];
let activeMessagesList = [];

window.onload = async () => {
    if (token) {
        const ok = await loadMe();
        if (ok) {
            showChatScreen();
            connectSocket();
            loadConversations();
        } else {
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

function connectSocket() {
    if (!token) return;
    
    const socketURL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000' : window.location.origin;
    socket = io(socketURL, { auth: { token } });
    
    socket.on('connect', () => console.log('Socket connected!'));
    socket.on('connect_error', err => console.log('Socket error:', err.message));
    
    socket.on('message_received', ({ message, conversationId }) => {
        if (currentChatId === conversationId) {
            activeMessagesList.push(message);
            renderMessage(message);
            // Mark read if we are receiving from someone else in active chat
            if (message.senderId._id !== currentUser._id) {
                socket.emit('mark_read', { messageId: message._id, conversationId });
            }
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
            // Restore actual status
            const activeConv = conversationsData.find(c => c._id === currentChatId);
            if (activeConv) {
                if (activeConv.type === 'dm') {
                    const other = activeConv.members.find(m => m._id !== currentUser._id);
                    document.getElementById('chat-status').textContent = other?.status || 'offline';
                } else {
                    document.getElementById('chat-status').textContent = `${activeConv.members.length} members`;
                }
            }
        }
    });
    
    socket.on('user_online', ({ userId }) => updateUserStatus(userId, 'online'));
    socket.on('user_offline', ({ userId }) => updateUserStatus(userId, 'offline'));
    
    // Realtime action events
    socket.on('message_read', ({ messageId }) => {
        const ticks = document.querySelector(`[data-id="${messageId}"] .msg-ticks`);
        if (ticks) {
            ticks.classList.add('read');
        }
    });

    socket.on('reaction_updated', ({ messageId, reactions }) => {
        // Find message in cache and update reactions
        const msg = activeMessagesList.find(m => m._id === messageId);
        if (msg) msg.reactions = reactions;
        updateMessageReactions(messageId, reactions);
    });

    socket.on('message_deleted_sync', ({ messageId, content }) => {
        const msg = activeMessagesList.find(m => m._id === messageId);
        if (msg) msg.deletedAt = new Date();
        const el = document.querySelector(`[data-id="${messageId}"] .msg-bubble`);
        if (el) {
            const quote = el.querySelector('.msg-quote') || null;
            el.innerHTML = `${quote ? quote.outerHTML : ''}<span class="deleted-msg-text">🚫 This message was deleted</span>`;
            const actions = el.querySelector('.msg-actions');
            if (actions) actions.remove();
        }
    });
}

function switchTab(tab) {
    const indicator = document.getElementById('tab-indicator');
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('login-form').style.display = tab === 'login' ? 'flex' : 'none';
    document.getElementById('register-form').style.display = tab === 'register' ? 'flex' : 'none';
    document.getElementById('auth-error').textContent = '';
    if (tab === 'login') { 
        document.getElementById('tab-login').classList.add('active'); 
        indicator.classList.remove('right'); 
    } else { 
        document.getElementById('tab-register').classList.add('active'); 
        indicator.classList.add('right'); 
    }
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
        showOTPScreen(email);
    } catch { showError('Server error, try again'); }
}

async function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if (!email || !password) return showError('Please fill all fields');
    try {
        const res = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        const data = await res.json();
        if (!res.ok) {
            if (data.needsVerification) {
                showOTPScreen(data.email);
                return;
            }
            return showError(data.error);
        }
        token = data.token;
        localStorage.setItem('token', token);
        currentUser = data.user;
        document.querySelector('.auth-tabs').style.display = 'flex';
        showChatScreen();
        connectSocket();
        loadConversations();
    } catch { showError('Server error, try again'); }
}

async function logout() {
    try { await fetch(`${API}/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); } catch {}
    if (socket) socket.disconnect();
    token = null; currentUser = null; currentChatId = null; activeChatOtherUserId = null;
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
    if (!token) return;
    try {
        const res = await fetch(`${API}/conversations`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) return;
        conversationsData = data.conversations;
        filterChats(currentFilter);
        
        if (conversationsData.length > 0 && !currentChatId) {
            openChat(conversationsData[0]);
        }
    } catch {}
}

function filterChats(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-tab').forEach(el => el.classList.remove('active'));
    
    const targetTab = document.getElementById(`tab-filter-${filter}`);
    if (targetTab) targetTab.classList.add('active');
    
    let filtered = conversationsData;
    if (filter === 'dm') {
        filtered = conversationsData.filter(c => c.type === 'dm');
    } else if (filter === 'group') {
        filtered = conversationsData.filter(c => c.type === 'group');
    }
    renderConversations(filtered);
}

function renderConversations(conversations) {
    const list = document.getElementById('chats-list');
    list.innerHTML = '';
    if (!conversations.length) {
        list.innerHTML = `<p style="padding:24px 16px;color:var(--text3);font-size:13px;text-align:center">No chats under this filter</p>`;
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
    if (activeChatOtherUserId === userId) {
        const el = document.getElementById('chat-status');
        if (el) {
            el.textContent = status === 'online' ? 'online' : 'offline';
            el.className = 'chat-hstatus' + (status === 'online' ? ' online-text' : '');
        }
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
        activeChatOtherUserId = other?._id;
        statusEl.textContent = other?.status || 'offline';
        statusEl.className = 'chat-hstatus' + (other?.status === 'online' ? ' online-text' : '');
    } else {
        activeChatOtherUserId = null;
        statusEl.textContent = `${conv.members.length} members`;
        statusEl.className = 'chat-hstatus';
    }
    
    cancelReply();
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
        activeMessagesList = data.messages;
        data.messages.forEach(msg => renderMessage(msg));
        
        // Auto mark read
        data.messages.forEach(msg => {
            const mine = msg.senderId._id === currentUser._id || msg.senderId === currentUser._id;
            const alreadyRead = msg.readBy && msg.readBy.some(r => r.userId === currentUser._id || r.userId?._id === currentUser._id);
            if (!mine && !alreadyRead) {
                socket.emit('mark_read', { messageId: msg._id, conversationId });
            }
        });
    } catch (err) { 
        console.error(err);
        container.innerHTML = '<p style="text-align:center;color:var(--danger);font-size:13px;padding:24px">Failed to load</p>'; 
    }
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();
    if (!content || !currentChatId || !socket) return;
    
    const payload = { conversationId: currentChatId, content, type: 'text' };
    if (replyingToMessage) {
        payload.replyTo = replyingToMessage._id;
    }
    
    socket.emit('send_message', payload);
    input.value = ''; 
    cancelReply();
    stopTyping();
}

function renderMessage(msg) {
    const container = document.getElementById('messages-container');
    const mine = msg.senderId._id === currentUser._id || msg.senderId === currentUser._id;
    
    const isDeletedForMe = msg.deletedFor && msg.deletedFor.some(id => {
        const stringId = typeof id === 'object' ? (id._id || id).toString() : id.toString();
        return stringId === currentUser._id.toString();
    });
    if (isDeletedForMe) return;

    const username = msg.senderId.username || (mine ? currentUser.username : 'User');
    const time = msg.createdAt;
    const type = msg.type || 'text';
    const content = msg.content;
    
    const wrap = document.createElement('div');
    wrap.className = `msg-wrap ${mine ? 'mine' : 'theirs'}`;
    wrap.setAttribute('data-id', msg._id);
    
    const timeStr = time 
        ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
    let contentHTML = '';
    if (msg.deletedAt) {
        contentHTML = `<span class="deleted-msg-text">🚫 This message was deleted</span>`;
    } else {
        if (type === 'image') contentHTML = `<img src="${content}" onclick="window.open('${content}')" loading="lazy"/>`;
        else if (type === 'video') contentHTML = `<video src="${content}" controls></video>`;
        else if (type === 'file') contentHTML = `<a href="${content}" target="_blank">📎 Download file</a>`;
        else contentHTML = content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    
    // Quoted Reply Preview inside bubble
    let replyHTML = '';
    if (msg.replyTo && !msg.deletedAt) {
        const replyMsg = msg.replyTo;
        const replySender = replyMsg.senderId === currentUser._id || replyMsg.senderId?._id === currentUser._id
            ? 'You' 
            : (replyMsg.senderId?.username || 'User');
        let replyTextSnippet = replyMsg.content || '';
        if (replyMsg.type !== 'text') replyTextSnippet = `📎 ${replyMsg.type}`;
        if (replyMsg.deletedAt) replyTextSnippet = 'This message was deleted';
        
        replyHTML = `
            <div class="msg-quote" onclick="scrollToMessage('${replyMsg._id}')">
                <span class="msg-quote-sender">${replySender}</span>
                <p class="msg-quote-text">${replyTextSnippet}</p>
            </div>
        `;
    }

    // Reactions HTML
    let reactionsHTML = '';
    if (msg.reactions && msg.reactions.length > 0 && !msg.deletedAt) {
        const reactionCounts = {};
        msg.reactions.forEach(r => {
            reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1;
        });
        
        const badges = Object.entries(reactionCounts).map(([emoji, count]) => {
            return `<span class="reaction-badge">${emoji}${count > 1 ? ` ${count}` : ''}</span>`;
        }).join('');
        
        reactionsHTML = `<div class="msg-reactions-wrapper">${badges}</div>`;
    }
    
    // Double Ticks for read status
    let ticksHTML = '';
    if (mine && !msg.deletedAt) {
        const isRead = msg.readBy && msg.readBy.length > 0;
        ticksHTML = `<span class="msg-ticks ${isRead ? 'read' : ''}">✓✓</span>`;
    }

    // Actions Dropdown Menu
    let actionsHTML = '';
    if (!msg.deletedAt) {
        actionsHTML = `
            <div class="msg-actions">
                <button class="msg-actions-trigger" onclick="toggleMessageMenu(event, '${msg._id}')">
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M9 4.5L9 4.51M9 9L9 9.01M9 13.5L9 13.51" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                </button>
                <div class="msg-dropdown" id="menu-${msg._id}">
                    <button onclick="initiateReply('${msg._id}')">Reply</button>
                    <button onclick="showReactionPicker(event, '${msg._id}')">React</button>
                    ${mine ? `<button class="danger" onclick="deleteMessage('${msg._id}', 'everyone')">Delete for everyone</button>` : ''}
                    <button class="danger" onclick="deleteMessage('${msg._id}', 'me')">Delete for me</button>
                </div>
            </div>
        `;
    }
    
    wrap.innerHTML = `
        ${!mine && msg.senderId.username ? `<div class="msg-sender">${username}</div>` : ''}
        <div class="msg-bubble-container">
            <div class="msg-bubble">
                ${replyHTML}
                <div class="msg-content-wrapper">${contentHTML}</div>
                ${actionsHTML}
            </div>
            ${reactionsHTML}
        </div>
        <div class="msg-meta">
            <span class="msg-time">${timeStr}</span>
            ${ticksHTML}
        </div>
    `;
    
    container.appendChild(wrap);
    container.scrollTop = container.scrollHeight;
}

function scrollToMessage(msgId) {
    const el = document.querySelector(`[data-id="${msgId}"]`);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight-flash');
        setTimeout(() => el.classList.remove('highlight-flash'), 1500);
    }
}

function toggleMessageMenu(event, msgId) {
    event.stopPropagation();
    document.querySelectorAll('.msg-dropdown.show').forEach(el => {
        if (el.id !== `menu-${msgId}`) el.classList.remove('show');
    });
    
    const menu = document.getElementById(`menu-${msgId}`);
    if (menu) menu.classList.toggle('show');
}

window.addEventListener('click', () => {
    document.querySelectorAll('.msg-dropdown.show').forEach(el => el.classList.remove('show'));
    const picker = document.getElementById('emoji-picker-popup');
    if (picker) picker.style.display = 'none';
});

function initiateReply(msgId) {
    const msg = activeMessagesList.find(m => m._id === msgId);
    if (!msg) return;
    
    replyingToMessage = msg;
    const preview = document.getElementById('reply-preview-container');
    const userEl = document.getElementById('reply-preview-username');
    const textEl = document.getElementById('reply-preview-text');
    
    userEl.textContent = (msg.senderId._id === currentUser._id || msg.senderId === currentUser._id) ? 'You' : msg.senderId.username;
    textEl.textContent = msg.type === 'text' ? msg.content : `📎 ${msg.type}`;
    
    preview.style.display = 'flex';
    document.getElementById('message-input').focus();
}

function cancelReply() {
    replyingToMessage = null;
    const container = document.getElementById('reply-preview-container');
    if (container) container.style.display = 'none';
}

async function deleteMessage(msgId, deleteFor) {
    try {
        const res = await fetch(`${API}/messages/${msgId}?deleteFor=${deleteFor}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) {
            alert(data.error || 'Failed to delete message');
            return;
        }
        
        if (deleteFor === 'me') {
            const el = document.querySelector(`[data-id="${msgId}"]`);
            if (el) el.remove();
        } else {
            const el = document.querySelector(`[data-id="${msgId}"] .msg-bubble`);
            if (el) {
                const quote = el.querySelector('.msg-quote') || null;
                el.innerHTML = `${quote ? quote.outerHTML : ''}<span class="deleted-msg-text">🚫 This message was deleted</span>`;
                const actions = el.querySelector('.msg-actions');
                if (actions) actions.remove();
            }
            if (socket) {
                socket.emit('message_deleted', { messageId: msgId, conversationId: currentChatId, content: 'This message was deleted' });
            }
        }
    } catch (err) {
        console.error(err);
    }
}

function showReactionPicker(event, msgId) {
    event.stopPropagation();
    document.querySelectorAll('.msg-dropdown.show').forEach(el => el.classList.remove('show'));
    
    let picker = document.getElementById('emoji-picker-popup');
    if (!picker) {
        picker = document.createElement('div');
        picker.id = 'emoji-picker-popup';
        picker.className = 'emoji-picker-popup';
        document.body.appendChild(picker);
    }
    
    const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
    picker.innerHTML = emojis.map(e => `
        <button class="emoji-pick-btn" onclick="sendReaction('${msgId}', '${e}')">${e}</button>
    `).join('');
    
    picker.style.display = 'flex';
    picker.style.left = `${event.pageX - 70}px`;
    picker.style.top = `${event.pageY - 45}px`;
}

async function sendReaction(msgId, emoji) {
    try {
        const res = await fetch(`${API}/messages/${msgId}/react`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ emoji })
        });
        const data = await res.json();
        if (!res.ok) return;
        
        const msg = activeMessagesList.find(m => m._id === msgId);
        if (msg) msg.reactions = data.reactions;
        
        updateMessageReactions(msgId, data.reactions);
        
        if (socket) {
            socket.emit('message_reacted', { 
                messageId: msgId, 
                reactions: data.reactions, 
                conversationId: currentChatId 
            });
        }
    } catch (err) {
        console.error(err);
    }
}

function updateMessageReactions(msgId, reactions) {
    const wrapper = document.querySelector(`[data-id="${msgId}"] .msg-bubble-container`);
    if (!wrapper) return;
    
    let rxEl = wrapper.querySelector('.msg-reactions-wrapper');
    if (rxEl) rxEl.remove();
    
    if (reactions && reactions.length > 0) {
        const reactionCounts = {};
        reactions.forEach(r => {
            reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1;
        });
        
        const badges = Object.entries(reactionCounts).map(([emoji, count]) => {
            return `<span class="reaction-badge">${emoji}${count > 1 ? ` ${count}` : ''}</span>`;
        }).join('');
        
        const rxContainer = document.createElement('div');
        rxContainer.className = 'msg-reactions-wrapper';
        rxContainer.innerHTML = badges;
        wrapper.appendChild(rxContainer);
    }
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
        await loadConversations(); 
        openChat(data.conversation);
    } catch {}
}

function showAuthScreen() { document.getElementById('auth-screen').style.display = 'block'; document.getElementById('chat-screen').style.display = 'none'; }
function showChatScreen() { document.getElementById('auth-screen').style.display = 'none'; document.getElementById('chat-screen').style.display = 'flex'; updateMyProfile(); }
function updateMyProfile() { if (!currentUser) return; document.getElementById('my-username').textContent = currentUser.username; document.getElementById('my-avatar').textContent = currentUser.username[0].toUpperCase(); }
function showError(msg) { document.getElementById('auth-error').textContent = msg; }

// ─── OTP ───────────────────────────────────────────────
let otpEmail = null;
let resendTimer = null;

function showOTPScreen(email) {
    otpEmail = email;
    document.getElementById('otp-email-display').textContent = email;

    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('otp-form').style.display = 'flex';
    document.querySelector('.auth-tabs').style.display = 'none';
    document.getElementById('auth-error').textContent = '';

    setTimeout(() => {
        const targetInput = document.getElementById('otp-0');
        if (targetInput) targetInput.focus();
    }, 100);

    startResendTimer();
}

function startResendTimer() {
    const btn = document.getElementById('resend-btn');
    if (!btn) return;
    let seconds = 30;
    btn.disabled = true;
    btn.textContent = `Resend in ${seconds}s`;

    clearInterval(resendTimer);
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
    input.value = val.replace(/[^0-9]/g, '');

    if (input.value) {
        input.classList.add('filled');
        if (index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        } else {
            verifyOTP();
        }
    } else {
        input.classList.remove('filled');
    }
}

function otpKeyDown(event, index) {
    if (event.key === 'Backspace' && !document.getElementById(`otp-${index}`).value && index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
    }
    if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        navigator.clipboard.readText().then(text => {
            const digits = text.replace(/[^0-9]/g, '').slice(0, 6);
            digits.split('').forEach((d, i) => {
                const el = document.getElementById(`otp-${i}`);
                if (el) { el.value = d; el.classList.add('filled'); }
            });
            if (digits.length === 6) verifyOTP();
            else {
                const targetInput = document.getElementById(`otp-${digits.length}`);
                if (targetInput) targetInput.focus();
            }
        });
    }
}

function getOTPValue() {
    return Array.from({ length: 6 }, (_, i) => document.getElementById(`otp-${i}`).value).join('');
}

function clearOTPInputs() {
    for (let i = 0; i < 6; i++) {
        const el = document.getElementById(`otp-${i}`);
        if (el) {
            el.value = '';
            el.classList.remove('filled');
        }
    }
    const targetInput = document.getElementById('otp-0');
    if (targetInput) targetInput.focus();
}

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

        token = data.token;
        localStorage.setItem('token', token);
        currentUser = data.user;
        
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
        if (!res.ok) { showError(data.error); return; }
        showError('');
        clearOTPInputs();
        startResendTimer();
    } catch { showError('Failed to resend OTP'); }
}

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
        
        if (!res.ok) { 
            progressText.textContent = 'Upload failed'; 
            setTimeout(() => progress.classList.remove('show'), 2000); 
            return; 
        }
        
        const payload = { 
            conversationId: currentChatId, 
            content: data.url, 
            type: uploadType, 
            fileName: file.name, 
            fileSize: file.size 
        };
        if (replyingToMessage) {
            payload.replyTo = replyingToMessage._id;
        }
        
        socket.emit('send_message', payload);
        progressText.textContent = 'Sent!';
        cancelReply();
        setTimeout(() => progress.classList.remove('show'), 1200);
    } catch { 
        progressText.textContent = 'Upload failed'; 
        setTimeout(() => progress.classList.remove('show'), 2000); 
    } finally { 
        input.value = ''; 
    }
}

let selectedMembers = [];
function showCreateGroup() {
    selectedMembers = [];
    ['group-name','group-search'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    ['group-search-results','selected-members'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    });
    const errEl = document.getElementById('group-error');
    if (errEl) errEl.textContent = '';
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
    if (selectedMembers.length < 2) { errEl.textContent = 'Add at least 2 members'; return; }
    try {
        const res = await fetch(`${API}/conversations/group`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ name, members: selectedMembers.map(m => m._id) }) });
        const data = await res.json();
        if (!res.ok) { errEl.textContent = data.error; return; }
        hideCreateGroup(); 
        await loadConversations(); 
        openChat(data.conversation);
    } catch { errEl.textContent = 'Something went wrong'; }
}

function showAddFriend() {
    const searchEl = document.getElementById('friend-search');
    if (searchEl) searchEl.value = '';
    const resultsEl = document.getElementById('friend-search-results');
    if (resultsEl) resultsEl.innerHTML = '';
    document.getElementById('friend-modal').style.display = 'flex';
    
    // Immediately fetch all users by default
    searchFriendUsers('');
}

function hideAddFriend() {
    document.getElementById('friend-modal').style.display = 'none';
}

async function searchFriendUsers(query) {
    const box = document.getElementById('friend-search-results');
    if (!box) return;
    try {
        const res = await fetch(`${API}/users/search?q=${query}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        box.innerHTML = '';
        if (!data.users?.length) { box.innerHTML = '<p style="padding:8px;color:var(--text3);font-size:12px">No users found</p>'; return; }
        data.users.forEach(user => {
            const div = document.createElement('div');
            div.className = 'g-result-item';
            div.innerHTML = `<div class="g-av">${user.username[0].toUpperCase()}</div><span style="font-size:13px">${user.username}</span>`;
            div.onclick = () => {
                startDM(user);
                hideAddFriend();
            };
            box.appendChild(div);
        });
    } catch (err) {
        console.error(err);
    }
}