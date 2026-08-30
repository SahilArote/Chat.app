# ❄️ PULSE MOBILE — DESIGN FREEZE MILESTONE SPECIFICATION

## Overview
- **App Name:** Pulse Chat Mobile
- **Target OS:** Android (React Native 0.81.5, Expo SDK ~54.0.37)
- **Architecture:** Expo Router (File-based Navigation) + Design System Tokens + Repository Pattern (Mock-Backed)
- **Status:** ✅ **DESIGN FROZEN & VERIFIED** (Phases 0–16 Complete)
- **Backend Isolation:** **100% Disconnected** from backend APIs.

---

## 📱 Complete Screen & Route Inventory

| Route | Screen / Component | Features Implemented |
| :--- | :--- | :--- |
| `(auth)/index` | Welcome Screen | Hero logo, tagline, Get Started & Sign In buttons |
| `(auth)/login` | Login Screen | Email/password validation, show password toggle, social buttons |
| `(auth)/register` | Register Screen | Live password strength meter, validation rules |
| `(auth)/otp` | OTP Screen | 6-digit PIN input, 45s countdown timer, auto-verify |
| `(auth)/forgot-password`| Forgot Password | Step 1 (email) $\rightarrow$ Step 2 (new password) flow |
| `(app)/index` | Home / Chats Tab | Story avatar carousel, filter chips (`All`, `Direct`, `Groups`, `Unread`, `Pinned`), conversation cards, long-press action sheet |
| `(app)/calls` | Calls Log Tab | Filter chips (`All Calls`, `Missed`), call direction indicators, duration, instant redial, incoming call simulator |
| `(app)/profile` | My Profile Tab | Avatar with presence dot, camera edit trigger, custom emoji status pill, bio card, encryption card, sign out CTA |
| `(app)/settings/*` | Settings Hub (7 Sub-screens)| `index` (Hub), `account` (2FA, active sessions, delete), `privacy` (Last Seen, read receipts, blocked), `notifications` (tones, previews), `appearance` (themes, 5 accent colors, font size), `storage` (breakdown chart, clear cache), `help` (version 1.0.0, licenses) |
| `chat/[conversationId]`| Chat Room Screen | Master MessageBubble delegator (Text, Image, Audio waveform with 1x/1.5x/2x speed, Docs, System), Swipe-to-reply, emoji reactions, composer with mic, attachment picker, lightbox |
| `group/[conversationId]`| Group Info Screen | Hero avatar, Channel mode banner, quick actions, member list with role badges (Owner, Admin, Member), admin promotion/demotion, leave/delete group |
| `group/create` | Group Creation Wizard | Group vs Broadcast Channel switch, contact multiselect |
| `user/[userId]` | Contact Profile Screen | Online presence timer, quick call/message actions, bio, Shared Media Grid (Photos, Docs, Links), Mute/Block/Report |
| `search` | Global Search Screen | Categorized tabs (`All`, `People`, `Messages`, `Media`, `Files`), substring match highlighting, recent search chips |
| `call/[callId]` | Active Call Screen | Mode toggle: Audio (acoustic pulsing halo) vs Video (fullscreen feed + PIP window), live call timer, floating CallControls (Mute, Speaker, Video, Flip, End) |
| `call/incoming` | Incoming Call Screen | Fullscreen glowing caller avatar, Accept & Decline triggers |

---

## 🎨 Design System Tokens

- **Theme Palette:** Pure AMOLED Dark (`#0A0D14`), Elevated Surfaces (`#121624`, `#1A2035`), Primary Pulse Indigo (`#6366F1`), Online Emerald (`#10B981`), Error Coral (`#EF4444`).
- **Typography:** Display, Screen Titles, Headers, Chat Names, Body, Captions, Labels.
- **Spacing & Radius:** 4px grid (`xs` to `4xl`), Full rounded pills and radius curves (`sm` to `xl`).

---

## 🛡️ Complete State Matrix

1. **Loading State:** Shimmer skeletons for Chat List (`ChatListSkeleton`) and Chat Room (`ChatRoomSkeleton`).
2. **Empty State:** Custom empty illustrations and call-to-action buttons across all feeds.
3. **Error State:** Retryable error banners and cards (`ErrorState`).
4. **Offline Banner:** Animated top network reconnection bar (`OfflineBanner`).
5. **Permission Modal:** Granular permission prompts for Camera, Microphone, Notifications, and Storage (`PermissionPromptModal`).

---

## 🚀 Sign-Off Milestone

- **TypeScript:** 0 Errors (`tsc --noEmit`).
- **Bundling:** Clean Android Metro export.
- **Git Tag:** `v1.0.0-design-freeze`.
