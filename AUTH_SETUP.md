# Firebase Authentication Custom Domain Setup

This document explains how to properly configure Firebase Authentication to use your custom domain for password reset emails and other authentication flows.

## Why Do This?

By default, Firebase Authentication uses the firebase-hosted URL (e.g., `we-are-geniuses-v0.firebaseapp.com`) for password reset and other authentication actions. This creates a poor user experience because:

1. The URL doesn't match your application's domain
2. Users might be confused by the different domain
3. The long URL with parameters looks suspicious

## Configuration Steps

### 1. Update Firebase Console Settings

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** > **Settings** > **Authorized Domains**
4. Add your custom domain (e.g., `wearegeniuses.com`) to the authorized domains list

### 2. Configure Custom Action URL in Firebase Authentication Templates

1. In Firebase Console, go to **Authentication** > **Templates** > **Password reset**
2. Customize the password reset email template
3. Make sure the **Customize action URL** option is enabled
4. Set the action URL to your custom domain (e.g., `https://wearegeniuses.com/reset-password`)

### 3. Update DNS Settings (if needed)

If you haven't already, make sure your domain is properly pointing to your hosting solution:

1. Add an A record or CNAME record pointing to your hosting provider
2. If using Firebase Hosting, follow the [Add a custom domain](https://firebase.google.com/docs/hosting/custom-domain) guide

### 4. SSL Certificate

Ensure your domain has a valid SSL certificate for secure connections, as Firebase Authentication requires HTTPS.

## Verification

After configuration:

1. Test the password reset flow
2. Verify that the reset email contains a link to your custom domain
3. Test that clicking the link takes you to your application's reset password page
4. Ensure the password reset works correctly

## Troubleshooting

### Links Still Point to Firebase Domain

If your password reset links still point to the Firebase domain:

1. Check that the action code settings in your code match your domain:
   ```javascript
   // In firebase.js
   export const actionCodeSettings = {
     url: 'https://wearegeniuses.com/reset-password',
     handleCodeInApp: true
   };
   ```

2. Verify that you're using the custom reset password function:
   ```javascript
   // In AuthContext.js
   const resetPassword = (email) => {
     return sendPasswordResetWithConfig(email);
   };
   ```

3. Make sure your domain is correctly added to the authorized domains list in Firebase Console.

### Invalid Action Code Errors

If users receive "invalid action code" errors:

1. Ensure your ResetPassword component correctly extracts the oobCode parameter
2. Verify that the reset password form is correctly calling confirmPasswordReset
3. Check that the action code hasn't expired (they typically expire after 1 hour)

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Customizing Email Actions in Firebase](https://firebase.google.com/docs/auth/web/passing-state-in-email-actions) 