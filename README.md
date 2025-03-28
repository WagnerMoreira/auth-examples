# Auth Examples

There are two branches: 
- feat/persistent-auth
- feat/persistent-auth-with-refresh-token

The first branch is a basic auth where the user needs to login again once the jwt token expires, after 30 days.

The second is more interesting, it uses HTTP-only cookies to handle authentication securely, without exposing tokens to JavaScript.
### 🧭 How it works

1. **Login**
   - Client sends username and password to `POST /login`
   - Server responds by setting two cookies:
     - `accessToken` (short-lived, e.g. 15s)
     - `refreshToken` (long-lived, e.g. 30d)

2. **Authenticated Requests**
   - Browser automatically includes the `accessToken` cookie when calling protected endpoints like `GET /me`
   - Server validates the token directly from the cookie

3. **Token Expiration & Refresh**
   - If the `accessToken` is expired, a call to `/me` will fail with 401 or 403
   - The client then calls `POST /refresh`
   - If the `refreshToken` is valid, the server issues a new `accessToken` (again as an HTTP-only cookie)

4. **Logout**
   - Client calls `POST /logout`
   - Server clears both `accessToken` and `refreshToken` cookies