# Token Expiration Auto-Logout Implementation

## Tasks

- [x] Update AuthService to add token expiration checking
  - [x] Add `isTokenExpired()` method
  - [x] Add `startTokenExpirationMonitor()` method
  - [x] Add `stopTokenExpirationMonitor()` method
  - [x] Add `handleTokenExpiration()` method
  - [x] Update `hasValidToken()` to check expiration
  - [x] Update constructor to start monitoring
  - [x] Update `logout()` to stop monitoring

- [x] Update Auth Interceptor to check token expiration
  - [x] Check token validity before adding to requests
  - [x] Handle expired tokens appropriately

- [x] Update App Component to ensure monitoring is active
  - [x] Initialize token monitoring on app start

- [ ] Test the implementation
  - [ ] Verify automatic logout works
  - [ ] Verify toast notification appears
  - [ ] Verify redirect to login page

## Implementation Summary

### What was implemented:

1. **AuthService Enhancements:**
   - Added `isTokenExpired()` method to check if the stored token has expired
   - Added `startTokenExpirationMonitor()` to periodically check token expiration (every 30 seconds)
   - Added `stopTokenExpirationMonitor()` to clean up the monitoring interval
   - Added `handleTokenExpiration()` to handle the logout process when token expires
   - Updated `hasValidToken()` to also check for token expiration
   - Updated constructor to start monitoring if user is authenticated
   - Updated `login()` and `register()` methods to start monitoring after successful authentication
   - Updated `logout()` to stop monitoring

2. **Auth Interceptor Updates:**
   - Added token expiration check before adding token to requests
   - If token is expired, triggers logout and shows notification
   - Prevents expired tokens from being sent with requests

3. **App Component Updates:**
   - Added AuthService injection to ensure service is instantiated when app starts
   - This ensures token monitoring begins immediately for authenticated users

### How it works:

1. When a user logs in or registers, the token expiration time is stored in localStorage
2. A monitoring system checks every 30 seconds if the token has expired
3. Additionally, a timeout is set for the exact expiration time
4. When the token expires:
   - The user is automatically logged out
   - All auth data is cleared from storage
   - A warning toast notification is shown
   - The user is redirected to the login page
5. If a user tries to make an API request with an expired token, the interceptor will catch it and trigger logout

### Testing Instructions:

To test the implementation:
1. Log in to the application
2. Check localStorage for `tokenExpiresAt` value
3. Manually modify the `tokenExpiresAt` in localStorage to a past date/time
4. Wait up to 30 seconds or trigger an API call
5. Verify that:
   - User is logged out automatically
   - Toast notification appears with "Session Expired" message
   - User is redirected to login page
