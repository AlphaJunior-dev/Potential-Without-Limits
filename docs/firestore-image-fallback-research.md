# Firestore Image Fallback Constraints

Source reviewed on 2026-08-20: https://firebase.google.com/docs/firestore/quotas

- Cloud Firestore standard documents have a hard maximum size of **1 MiB (1,048,576 bytes)**.
- The Firebase free quota includes **1 GiB stored data**, **50,000 document reads per day**, **20,000 document writes per day**, and **10 GiB outbound transfer per month**.
- A Firestore-backed image fallback must therefore be limited to a small, unindexed image document and must never be used for videos or arbitrary file storage.
- The implementation should store a strict maximum of 200 KiB of validated image bytes per record, exclude the raw byte field from indexes, and serve images only through server-authorized routes that enforce the existing public and approved-sponsor visibility boundaries.

Related official pricing reference: https://firebase.google.com/docs/firestore/pricing
