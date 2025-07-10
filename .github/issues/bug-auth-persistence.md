# [BUG] Mobile App Authentication State Persistence

## Bug Description

Mobile app loses authentication state when app is backgrounded or device is restarted, requiring users to log in again.

## Platform Affected

- [x] Mobile (iOS)
- [x] Mobile (Android)

## Steps to Reproduce

1. Log into the mobile app
2. Background the app for extended period (>30 minutes)
3. Return to app
4. Or: Close app completely and restart
5. User is logged out unexpectedly

## Expected Behavior

User should remain logged in across app restarts and backgrounding unless they explicitly log out or token expires.

## Actual Behavior

User is logged out and must re-authenticate frequently.

## Root Cause

- AuthContext not properly persisting to AsyncStorage
- Token refresh logic may not be working
- App state restoration not implemented

## Technical Investigation Needed

- [ ] Check AsyncStorage token persistence
- [ ] Verify token refresh mechanism
- [ ] Review app state restoration in AuthContext
- [ ] Test token expiration handling

## Fix Requirements

- [ ] Implement proper token persistence in AsyncStorage
- [ ] Add automatic token refresh logic
- [ ] Handle app state restoration
- [ ] Add proper error handling for token failures
- [ ] Test across app lifecycle events

## Priority

**High**

## Estimated Effort

**Medium** (2-3 days)
