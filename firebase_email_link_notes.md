# Firebase passwordless invitation notes

The verified implementation approach is Firebase Authentication email-link sign-in. Firebase requires the Email/Password provider and the Email Link (passwordless) provider to be enabled in the project. The final sign-in link must be completed in the browser application with the matching recipient email; the email must not be passed in the redirect URL. The production return URL must use HTTPS and be added to Firebase Authentication's authorized domains.

The Firebase Admin SDK can generate email action links in a secure server environment, but generating a link does not itself deliver an email. Firebase's client SDK can request Firebase's template-based email sending, while a custom branded email requires an email-delivery service. The operational build must therefore record whether an approved invitation has been created and whether it has been delivered, and it must never expose the invitation link or any password in the Admin Portal.

Sources: https://firebase.google.com/docs/auth/admin/email-action-links and https://firebase.google.com/docs/auth/web/email-link-auth
