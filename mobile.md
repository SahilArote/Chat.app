# PULSE CHAT — React Native Design-First Implementation Guide
## Phase 0–16 | Antigravity Development Specification

**Platform:** Android-first React Native  
**Expo:** `~54.0.37`  
**Language:** TypeScript  
**Navigation:** Expo Router  
**Backend:** STRICTLY DEFERRED until Design Freeze

---

## 1. Purpose

Build the complete Pulse Chat mobile experience first using mock/local data.

**Do not connect the backend during Phases 0–16.**

After all screens, states, interactions, responsive behavior, animations, and navigation are complete, reach the **DESIGN FREEZE** milestone. Only then begin API and Socket.IO integration.

The product should deliver modern messaging-app reliability and UX while maintaining a completely original visual identity rather than copying WhatsApp.

---

## 2. Non-Negotiable Rules

Antigravity must:

1. Use Expo `~54.0.37`.
2. Use TypeScript.
3. Use Expo Router.
4. Build Android-first and test on Android.
5. Use mock repositories/services during the design stage.
6. NOT connect REST APIs.
7. NOT connect Socket.IO.
8. NOT implement real authentication.
9. NOT hardcode backend URLs.
10. Keep UI independent from data implementation.
11. Build reusable components.
12. Keep screens responsive.
13. Design loading, empty, error, offline and failure states.
14. Give every interaction deliberate visual feedback.
15. Do not copy WhatsApp's visual design.
16. Do not add unrelated architecture changes.
17. Do not install unnecessary packages.
18. Do not implement E2EE or WebRTC during this stage.
19. Do not mark a phase complete until it has been tested.
20. Do not automatically continue to the next phase without verification.

---

# PHASE 0 — PROJECT FOUNDATION

## Objective

Create the clean Expo foundation.

### Tasks

- Configure Expo `~54.0.37`.
- Configure TypeScript.
- Configure Expo Router.
- Configure safe areas and status bar.
- Configure Reanimated.
- Configure Gesture Handler.
- Create the scalable folder architecture.
- Create the application shell.
- Confirm Android startup.

### Completion

```text
Expo starts
Android launches
TypeScript compiles
Router works
No backend dependency
```

---

# PHASE 1 — DESIGN SYSTEM

Create one source of truth for the entire UI.

## Color tokens

```text
primary
primaryPressed
background
surface
surfaceElevated
textPrimary
textSecondary
textMuted
border
success
warning
error
online
unread
messageIncoming
messageOutgoing
```

Do not scatter raw hex values across components.

## Typography

```text
display
screenTitle
sectionTitle
chatName
body
bodySmall
caption
label
button
```

## Spacing

```text
xs  = 4
sm  = 8
md  = 12
lg  = 16
xl  = 20
2xl = 24
3xl = 32
4xl = 40
```

## Radius

```text
sm
md
lg
xl
full
```

Also create reusable shadow/elevation tokens.

---

# PHASE 2 — CORE COMPONENT LIBRARY

Build reusable components before building screens.

```text
AppText
AppButton
AppInput
AppIconButton
Avatar
Badge
Divider
Card
Screen
Header
BottomSheet
Modal
Toast
Loader
Skeleton
EmptyState
ErrorState
Switch
Chip
SearchBar
```

Every component should support appropriate states, accessibility, and responsive sizing.

---

# PHASE 3 — NAVIGATION

Use Expo Router.

Suggested structure:

```text
app/
├── _layout.tsx
├── (auth)/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── register.tsx
│   ├── otp.tsx
│   └── forgot-password.tsx
├── (app)/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── calls.tsx
│   ├── profile.tsx
│   └── settings/
├── chat/
│   └── [conversationId].tsx
├── group/
│   └── [conversationId].tsx
├── user/
│   └── [userId].tsx
└── search.tsx
```

Use mocked authentication state only.

---

# PHASE 4 — AUTHENTICATION UI

Build:

### Splash
- Logo
- Brand animation
- Loading

### Login
- Email
- Password
- Login
- Forgot password
- Create account

### Register
- Username
- Email
- Password
- Confirm password

### OTP
- 6-digit input
- Countdown
- Resend
- Verify

### Forgot Password
- Email
- OTP
- New password
- Success

All verification is mocked.

---

# PHASE 5 — HOME / CHAT LIST

Create the unique Pulse Chat identity.

Suggested hierarchy:

```text
Header
Greeting / product identity
Search
Conversation filters
Conversation list
New-chat action
```

Conversation row:

```text
Avatar
Online indicator
Name
Last message
Timestamp
Unread count
Mute indicator
Pinned indicator
Typing indicator
Message status
```

Interactions:

```text
Tap       → Open chat
Swipe     → Chat actions
Long press → Actions
```

Actions can include:

```text
Mute
Pin
Archive
Delete
Mark unread
```

---

# PHASE 6 — CHAT SCREEN

This is the primary product screen.

## Header

```text
Back
Avatar
Name
Online / last seen
Call
Video
More
```

## Message area

Support:

```text
Date separators
Unread divider
Incoming messages
Outgoing messages
System messages
Typing indicator
Reply previews
Reactions
Message status
```

## Composer

Support:

```text
Attachment
Camera
Text input
Emoji
Voice
Send
```

Composer changes based on whether text exists.

---

# PHASE 7 — MESSAGE COMPONENT SYSTEM

Create separate components:

```text
TextMessage
ImageMessage
VideoMessage
AudioMessage
FileMessage
ReplyMessage
DeletedMessage
SystemMessage
```

Metadata:

```text
timestamp
status
reaction
reply
edited
```

Status:

```text
sending
sent
delivered
read
failed
```

Use mock transitions to demonstrate every state.

---

# PHASE 8 — MESSAGE INTERACTIONS

Implement:

## Long press

```text
React
Reply
Copy
Forward
Star
Pin
Delete
```

Use a custom action sheet.

## Swipe to reply

```text
message
   ← swipe
      ↓
reply composer
```

## Reactions

Provide a custom reaction picker with a consistent Pulse design.

---

# PHASE 9 — GROUP CHAT

## Create Group

```text
Select members
Group name
Group photo
Create
```

## Group Info

```text
Group details
Members
Admins
Media
Links
Documents
Notifications
```

Actions:

```text
Add member
Remove member
Promote admin
Demote admin
Leave group
```

Use mock data.

---

# PHASE 10 — USER PROFILE

Build:

```text
Avatar
Username
About
Online state
```

Actions:

```text
Message
Voice call
Video call
```

Content:

```text
Shared media
Shared files
Shared links
```

Privacy actions:

```text
Block
Report
```

---

# PHASE 11 — SEARCH

Global search:

```text
All
People
Chats
Messages
Media
```

States:

```text
Initial
Typing
Results
No results
Error
```

Use distinct result cards for people, chats and messages.

---

# PHASE 12 — SETTINGS

Create:

```text
Account
Privacy
Notifications
Chats
Appearance
Storage & Data
Devices
Security
About
```

Create dedicated screens for major settings categories.

---

# PHASE 13 — MEDIA EXPERIENCE

Build media UI before real uploads.

## Image
- Picker
- Preview
- Caption
- Send
- Full-screen viewer
- Zoom

## Video
- Thumbnail
- Play/pause
- Duration
- Progress
- Fullscreen

## File
- Icon
- Filename
- Size
- Download state

## Voice
- Recording
- Paused
- Sending
- Playing

All data remains mocked.

---

# PHASE 14 — COMPLETE STATE SYSTEM

Design every important state.

## Network

```text
Online
Offline
Reconnecting
```

## Messages

```text
Sending
Sent
Delivered
Read
Failed
```

## Screens

```text
Loading
Loaded
Empty
Error
```

## Media

```text
Selecting
Uploading
Processing
Ready
Failed
```

Never design only the happy path.

---

# PHASE 15 — ANIMATION & GESTURES

Use Reanimated and Gesture Handler.

Animations:

```text
Splash entrance
Screen transitions
Message appearance
Message send
Reaction selection
Typing indicator
Bottom sheet
Modal
Toast
Online status
```

Gestures:

```text
Swipe message → Reply
Swipe chat → Actions
Long press → Message menu
Pinch → Image zoom
Swipe media → Dismiss
Pull → Refresh
```

Animations should communicate state and remain fast/subtle.

---

# PHASE 16 — RESPONSIVE DESIGN, ACCESSIBILITY & DESIGN FREEZE

## Android testing

Test at minimum:

```text
Small phone
Standard phone
Large phone
```

Handle:

- Safe areas
- Keyboard
- System navigation
- Different font sizes
- Portrait orientation

## Accessibility

Use:

```text
accessibilityLabel
accessibilityRole
accessibilityHint
```

Ensure good contrast, readable text, and adequate touch targets.

---

# MOCK DATA ARCHITECTURE

Create:

```text
src/mock/
├── users.ts
├── conversations.ts
├── messages.ts
└── groups.ts
```

Messages must cover:

```text
text
image
video
audio
file
reply
reaction
deleted
edited
sending
sent
delivered
read
failed
```

Do not put fake data directly inside screens.

---

# MOCK REPOSITORY ARCHITECTURE

Create abstractions:

```text
UserRepository
ConversationRepository
MessageRepository
```

Design-stage implementations:

```text
MockUserRepository
MockConversationRepository
MockMessageRepository
```

The UI must depend on repository interfaces, not directly on mock-data files.

Later implementations can become:

```text
ApiUserRepository
ApiConversationRepository
ApiMessageRepository
```

This makes backend integration much safer.

---

# DESIGN FREEZE CHECKLIST

Before backend integration verify:

## Navigation
- All routes work
- Back behavior works
- Deep navigation works

## UI
- All screens complete
- Components reusable
- No placeholder UI
- No inconsistent colors
- No inconsistent typography

## Chat
- DM works with mock data
- Group works with mock data
- Reply works
- Reactions work
- Delete UI works

## Media
- Image preview works
- Video UI works
- File UI works
- Voice UI works

## States
- Loading
- Empty
- Error
- Offline
- Sending
- Failed

## Performance
- No obvious frame drops
- No unnecessary re-renders
- No memory leaks
- No duplicate listeners

---

# TARGET DESIGN ARCHITECTURE

During design stage:

```text
                 PULSE MOBILE
                      │
                 Expo Router
                      │
             ┌────────┴────────┐
             │                 │
          Screens          Navigation
             │
          Components
             │
       ┌─────┴──────┐
       │            │
    Theme       Mock Services
       │            │
       └─────┬──────┘
             │
          Mock Data
```

After Design Freeze:

```text
                  UI
                   │
             Repository Layer
              /                   Local Database       API
             │               │
          Sync Engine     REST API
             │               │
             └──────┬────────┘
                    │
                Socket.IO
                    │
                Backend
```

---

# ANTIGRAVITY EXECUTION PROTOCOL

For every phase:

```text
1. Inspect current project
2. Identify affected files
3. Explain planned implementation
4. Implement only the current phase
5. Preserve existing functionality
6. Run TypeScript checks
7. Run lint
8. Run Android
9. Test the phase
10. Fix errors
11. Summarize changed files
12. Report remaining issues
```

Do not automatically continue to the next phase.

---

# PHASE COMPLETION REPORT

After every phase, Antigravity must report:

```text
PHASE:
STATUS:

Implemented:
- ...

Files changed:
- ...

Tests:
- TypeScript:
- Lint:
- Android:

Known issues:
- ...

Next phase:
- ...
```

---

# PROHIBITED DURING PHASES 0–16

```text
❌ Backend connection
❌ REST API calls
❌ Socket.IO
❌ Production authentication
❌ Production API URLs
❌ Hardcoded secrets
❌ E2EE
❌ WebRTC
❌ Microservices
❌ Unnecessary dependencies
❌ Large unrelated refactors
```

---

# AFTER DESIGN FREEZE

Only after approval of Phase 16 proceed to:

```text
Phase 17  Mobile architecture hardening
Phase 18  API client
Phase 19  Authentication integration
Phase 20  User integration
Phase 21  Conversation integration
Phase 22  Message REST integration
Phase 23  Socket.IO integration
Phase 24  Delivery/read receipts
Phase 25  Reactions/replies/delete
Phase 26  Groups
Phase 27  Media
Phase 28  Push notifications
Phase 29+ SQLite
Phase 30+ Offline
Phase 31+ Outbox
Phase 32+ Sync
```

---

# FINAL DESIGN-STAGE OBJECTIVE

At the end of Phase 16, the application must demonstrate the complete experience without a backend:

```text
Launch
 ↓
Splash
 ↓
Login / Register
 ↓
Home
 ↓
Search
 ↓
Chat
 ↓
Send mock message
 ↓
Reply
 ↓
React
 ↓
View media
 ↓
Open profile
 ↓
Open group
 ↓
Settings
 ↓
Devices
```

The application should look and behave like a polished production product.

The backend remains completely disconnected.

**This is the Design Freeze milestone.**

