# Talent Video Playback Diagnosis — 2026-08-22

## Confirmed observations

- Two private Supabase video objects exist and respond to signed `HEAD` requests with `200`, non-zero content lengths, and `video/mp4` content types.
- The current public preview renders the approved-video section for the reported Talent profile.
- With a valid temporary Vercel preview-access session, a direct request to `/api/talent-video/zl4UARHFebxjiRXJOD1r` returns `404 {"error":"Talent video not found."}`.

## Conclusion

The zero-duration player is not caused by absent Supabase storage or an empty video object. The immediate fault is in the application-level public record-to-video-asset lookup or consent-aware serialization used by the public delivery route. No production merge is permitted until that mismatch is repaired and end-to-end playback is verified.
