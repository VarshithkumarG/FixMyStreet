# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the FixMyStreet application.

## Step 1: Create Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity API

## Step 2: Configure OAuth Consent Screen

1. In the Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Fill in the required information:
   - App name: "FixMyStreet"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
5. Add test users (for development)

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:8080` (for development)
   - `https://yourdomain.com` (for production)
5. **Important**: Do NOT add redirect URIs for this setup
6. Copy the Client ID (you don't need the Client Secret for this implementation)

## Step 4: Configure Environment Variables

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Update the `.env` file with your Google OAuth credentials:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id
   ```

## Step 5: Update Frontend Configuration

1. Open `login.html` and `register.html`
2. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID:
   ```javascript
   const GOOGLE_CLIENT_ID = 'your-actual-google-client-id';
   ```

## Step 6: Test the Integration

1. Start the backend server:
   ```bash
   npm run dev
   ```

2. Open the frontend in your browser:
   ```
   http://localhost:8080/login.html
   ```

3. Click the "Sign in with Google" button
4. Complete the Google OAuth flow
5. You should be redirected to the dashboard upon successful login

## Production Deployment

For production deployment:

1. Update the OAuth consent screen to "Published"
2. Add your production domain to authorized redirect URIs
3. Update environment variables with production URLs
4. Ensure your domain is verified in Google Cloud Console

## Troubleshooting

### Common Issues:

1. **"Invalid client" error**: Check that your Client ID is correct
2. **"Redirect URI mismatch"**: Ensure the redirect URI in Google Console matches your environment variable
3. **"Access blocked"**: Make sure the OAuth consent screen is properly configured
4. **CORS errors**: Ensure your frontend URL is added to CORS configuration

### Debug Steps:

1. Check browser console for JavaScript errors
2. Check backend logs for authentication errors
3. Verify environment variables are loaded correctly
4. Test the Google OAuth flow in Google's OAuth 2.0 Playground

## Security Notes

- Never commit your `.env` file to version control
- Use different Client IDs for development and production
- Regularly rotate your Client Secret
- Monitor OAuth usage in Google Cloud Console
- Implement proper error handling for OAuth failures

## Additional Resources

- [Google Identity Documentation](https://developers.google.com/identity)
- [OAuth 2.0 for Client-side Applications](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)
- [Google Sign-In JavaScript Library](https://developers.google.com/identity/sign-in/web)
