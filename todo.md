# Repair TODO

- [x] Diagnose and fix the Vercel preview server error on `repair/pwlif-secure-rebuild` before merging the pull request.
- [ ] Confirm the updated Vercel preview returns a successful public home-page response before merging pull request #1.
- [x] Capture and resolve the remaining Vercel preview runtime error reported after commit `dac859c`.
- [x] Determine why Vercel has not created a preview deployment for pushed commit `4e2c382` and trigger a preview-only rebuild.
- [x] Resolve the Vercel `jose` ESM dependency runtime error introduced after Firebase Admin began loading successfully.
- [x] Restore the familiar main-branch homepage and shared-header visual language while preserving the validated runtime and server-side security repairs.
- [x] Replace the approximate restored homepage and header with the exact original main-branch visual components, retaining only isolated security and runtime changes.
- [x] Validate the restored original-style public interface and its safe-content boundaries with an automated regression test.
- [x] Capture the live production UI and interaction baseline route by route without changing any visual or behavioral detail.
- [x] Compare the repair branch against the live baseline and limit changes to unsafe implementation paths only.
- [x] Restore the original live route components, Navbar, layout shell, and visual styling without changing their render structure or class-level presentation.
- [x] Replace only the original browser-side authentication, database authority, hard-coded credential, and form-submission paths with server-enforced equivalents.
- [x] Verify no direct Firestore client write, mock credential, weak MFA, or unauthenticated private-data path remains after restoration.
