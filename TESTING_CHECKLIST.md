# Testing & Verification Checklist

Use this checklist to verify all bugs are fixed. Test both on **localhost** and **Render deployment**.

---

## 🧪 Environment Setup

- [ ] Code changes applied
- [ ] `npm install` completed
- [ ] `.env` configured with MongoDB URI
- [ ] Sendgrid email config ready
- [ ] Running on localhost: `npm start`
- [ ] Render deployment ready

---

## 🔴 Test Bug 1: OTP Screen After Register

**Steps:**
1. Open app → Click "Register" tab
2. Fill in: username, email, password (6+ chars)
3. Click "Create account"

**Expected Result:**
- [ ] API call succeeds (no error message)
- [ ] Register form disappears
- [ ] OTP form appears with message: "OTP sent to user@email.com"
- [ ] 6 empty input boxes visible
- [ ] "Resend in 30s" button appears
- [ ] Tab bar is hidden
- [ ] Cursor focused in first OTP box

**If NOT working:**
- Check browser console for errors
- Verify API response: `curl http://localhost:3000/api/auth/register`
- Check `showOTPScreen(email)` is being called in app.js

---

## 🔴 Test Bug 2: Correct User After OTP

**Steps:**
1. Complete OTP registration flow (from Bug 1 test)
2. Check email for 6-digit OTP
3. Enter OTP (or copy-paste to all 6 boxes)
4. Click "Verify & Continue"

**Expected Result:**
- [ ] OTP boxes get disabled during verification
- [ ] Button shows "Verifying..."
- [ ] Chat screen loads
- [ ] **IMPORTANT**: Top-left shows YOUR username (not wrong user)
- [ ] Avatar initial matches YOUR first letter
- [ ] Browser console shows: "Socket connected!"
- [ ] Conversations list appears

**If NOT working:**
- [ ] Check browser console for "currentUser" value: `console.log(currentUser)`
- [ ] Verify API response includes `{ token, user: { _id, username, email, ... } }`
- [ ] Check localStorage: `localStorage.getItem('token')`

---

## 🔴 Test Bug 3: Pre-save Hook Mongoose Error

**Steps:**
1. Test registration flow (from Bug 1)
2. Watch browser console during OTP verification
3. Watch server logs during registration

**Expected Result:**
- [ ] **NO** "next is not a function" error in server logs
- [ ] **NO** database errors during user creation
- [ ] User successfully created in MongoDB
- [ ] User document has correct hashed password

**If ERROR appears:**
- Check `src/models/User.js` line 50
- Should be: `userSchema.pre('save', async function() {`
- Should NOT have: `async function(next) {` or `return next()`

**Verification:**
```bash
# Connect to MongoDB and check user
db.users.findOne({email: "test@example.com"})
# Should show isVerified: false, otp: null after verification
```

---

## 🔴 Test Bug 4: Socket Only After Valid Token

**Test 4A: Socket connects on successful login**

Steps:
1. Register & verify OTP (from Bug 1 & 2)
2. Open browser DevTools → Console

Expected Result:
- [ ] Console shows: `Socket connected!`
- [ ] **NO** "Socket error: Authentication required"
- [ ] **NO** repeated connection attempts
- [ ] Messages appear/send in real-time

---

**Test 4B: Socket does NOT connect without token**

Steps:
1. Open new incognito/private browser window
2. Go to `http://localhost:3000` (fresh, no token)
3. Open browser DevTools → Console
4. Watch for socket connection attempts

Expected Result:
- [ ] **NO** socket connection errors in console
- [ ] **NO** "Socket error" messages
- [ ] **NO** console spam
- [ ] Only sees auth screen

---

**Test 4C: Auto-login with stored token**

Steps:
1. Complete full registration flow
2. Close browser completely
3. Reopen browser to same URL
4. Don't log in manually

Expected Result:
- [ ] Chat screen loads automatically
- [ ] NO login form appears
- [ ] User data already loaded
- [ ] Socket connects successfully
- [ ] Can send/receive messages

---

**Test 4D: Invalid token handling**

Steps:
1. Store fake token: `localStorage.setItem('token', 'fake123')`
2. Refresh page
3. Watch browser console

Expected Result:
- [ ] Token cleared from localStorage
- [ ] Auth screen appears
- [ ] NO socket error spam
- [ ] Can log in normally

---

## 🔵 Full Auth Flow Tests

### Test 5: Complete Registration → Login Cycle

**Scenario: New User**
1. [ ] Register with new email
2. [ ] OTP screen appears
3. [ ] Verify OTP
4. [ ] Chat loads
5. [ ] Logout
6. [ ] Can login with same credentials
7. [ ] Chat loads immediately (no OTP)

**Scenario: Unverified Login**
1. [ ] Register new user (DON'T complete OTP)
2. [ ] Delete OTP from browser/DB to simulate failure
3. [ ] Try to login with that email
4. [ ] OTP screen should appear
5. [ ] Complete OTP verification

---

### Test 6: Error Handling

- [ ] Wrong OTP: Shows "Invalid OTP" error
- [ ] Expired OTP: Shows "OTP expired, please register again"
- [ ] Wrong password: Shows "Invalid email or password"
- [ ] Duplicate email: Shows "Email already registered"
- [ ] Invalid email format: Validation error
- [ ] Short password: Shows "Password must be at least 6 characters"

---

### Test 7: UI/UX

- [ ] OTP input boxes auto-focus next box
- [ ] Backspace deletes and moves to previous box
- [ ] Copy-paste OTP fills all boxes
- [ ] Auto-submit when all 6 filled
- [ ] Resend button disabled for 30s
- [ ] "Back to register" button works
- [ ] Error messages clear when retrying
- [ ] All buttons have proper disabled state

---

### Test 8: Socket/Real-time Features

- [ ] Send message → appears in real-time
- [ ] Typing indicator shows
- [ ] User online/offline status updates
- [ ] Multiple tabs: Both receive messages
- [ ] Logout: Socket disconnects

---

## 📱 Test on Multiple Devices

- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## 🌐 Test on Render Deployment

**Before deploying, test locally:**
1. [ ] All bugs fixed locally
2. [ ] All tests pass
3. [ ] No console errors

**After deploying:**
1. [ ] Visit `https://chat-app-r36i.onrender.com`
2. [ ] Run same tests as localhost
3. [ ] Verify socket connects on Render domain
4. [ ] Check CORS if needed (socket auth)

---

## 🔍 Debugging Commands

### Browser Console
```javascript
// Check current user
console.log('currentUser:', currentUser);

// Check token
console.log('token:', token);
console.log('localStorage token:', localStorage.getItem('token'));

// Check socket status
console.log('socket connected:', socket?.connected);
console.log('socket auth:', socket?.auth);

// Clear and logout
localStorage.removeItem('token');
location.reload();
```

### Server Logs
```bash
# Watch MongoDB operations
# Should see no "next is not a function" errors
# Socket auth errors should NOT appear on page load

# Check user document
db.users.findOne({email: "test@example.com"})
```

---

## ✅ Sign-off Checklist

When all tests pass, check these:

```
FUNCTIONALITY:
☐ Registration → OTP flow works
☐ OTP verification sets correct user
☐ No "next is not a function" errors
☐ Socket connects only after auth
☐ Auto-login on page refresh
☐ Logout clears data

EDGE CASES:
☐ Wrong credentials show errors
☐ Expired OTP handled correctly
☐ Unverified users shown OTP on login
☐ Invalid token cleared on load

DEPLOYMENT:
☐ Tests pass on localhost
☐ Tests pass on Render
☐ No console errors
☐ Socket uses correct domain
☐ Email sending works

PRODUCTION:
☐ Code committed and pushed
☐ Render auto-deployed
☐ HTTPS working
☐ Database connected
☐ Email service active
```

---

## 🚨 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| OTP screen doesn't appear | `showOTPScreen()` not called | Check register() at line 93 |
| Wrong user shown | currentUser not set | Check verifyOTP() line 410 |
| "next is not a function" | Old pre-save hook | Update User.js line 50 |
| Socket error spam | Socket connecting without token | Check connectSocket() line 39 |
| OTP not submitting | verifyOTP() not called on 6th digit | Check otpInput() logic |
| Auto-login fails | Token invalid/expired | Check localStorage/JWT expiry |

---

## 📞 Support

If tests fail, check in this order:
1. **Browser Console** - Any JavaScript errors?
2. **Network Tab** - Are API calls succeeding?
3. **Server Logs** - Any Mongoose/DB errors?
4. **Code Changes** - Are all fixes applied?
5. **MongoDB** - Can you manually query users?

For each failure: Screenshot error + copy console output + share context.

---

**All tests passing? You're ready for production! 🎉**
