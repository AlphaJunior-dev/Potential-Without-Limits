# Firestore Image Fallback Constraints

Source reviewed on 2026-08-20: https://firebase.google.com/docs/firestore/quotas

- Cloud Firestore standard documents have a hard maximum size of **1 MiB (1,048,576 bytes)**.
- The Firebase free quota includes **1 GiB stored data**, **50,000 document reads per day**, **20,000 document writes per day**, and **10 GiB outbound transfer per month**.
- A Firestore-backed image fallback must therefore be limited to a small, unindexed image document and must never be used for videos or arbitrary file storage.
- The implementation should store a strict maximum of 200 KiB of validated image bytes per record, exclude the raw byte field from indexes, and serve images only through server-authorized routes that enforce the existing public and approved-sponsor visibility boundaries.

Related official pricing reference: https://firebase.google.com/docs/firestore/pricing

## Durable Media-Provider Findings — 20 August 2026

### Supabase Storage

Supabase's official pricing page lists the Free plan with 1 GB file storage, 5 GB egress, 5 GB cached egress, a 50 MB maximum file upload, and custom access controls. It also states that Free projects are paused after one week of inactivity. Its Pro plan lists 100 GB file storage and 250 GB cached egress, with additional storage billed by use. Source: https://supabase.com/pricing

Supabase documents that Storage uploads are denied by default until Row Level Security policies are created, and that server-side service keys bypass those policies and must never be shared publicly. This supports a server-authorized PWLIF upload route with public, sponsor-private, and administrator-only media boundaries. Source: https://supabase.com/docs/guides/storage/security/access-control

### Cloudinary

Cloudinary's official pricing page confirms image and video APIs, upload tooling, revisions, transformations, adaptive video streaming, and CDN delivery. The basic pricing page does not state a reliable free-plan quota in its extracted content, so no capacity assumption should be made without reviewing the account-specific plan during onboarding. Source: https://cloudinary.com/pricing

### Recommendation implication

Firestore remains suitable for PWLIF record metadata and publication flags but not as a large-media system. For a high-media foundation experience, a separate object/media store with access control is required. Supabase Storage is the strongest first option to evaluate because it can be introduced as a dedicated media layer while retaining the current Firebase Authentication, Firestore, server authorization, and public/private CMS model.
