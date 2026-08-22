# PWLIF High-Media Launch Plan

## Purpose

PWLIF needs a public site that can present a growing collection of approved photos, selected video, and safe Sponsor Talent media without exposing private records or requiring a full rebuild of the existing Firebase authorization system. This plan preserves the security repair branch and stages media infrastructure separately from visual work.

> **No production merge or deployment is included in this plan.** The repair branch remains the testing environment until the Foundation explicitly approves launch.

## Original Hero Direction: “Potential in Motion”

The homepage hero should be original rather than editorial or imitative. The proposed concept is a wide, immersive **Potential in Motion** field: deep PWLIF navy as the base, a network of softly moving green, blue, gold, and magenta light paths, and a central composition that frames approved community imagery only when it is available. The design can gracefully use an abstract form when approved photography is unavailable.

The hero headline should be concise and mission-led, such as **“Potential does not wait for permission.”** A short supporting paragraph should explain PWLIF’s purpose without personal names, unsupported numbers, or sensitive stories. The two actions would be **Book Sponsor Orientation** and **Explore Sponsor Talent**, with the latter applying the current public visibility controls.

The visual system will use the official PWLIF palette, the supplied logo, rounded but structured panels, subtle motion that respects reduced-motion settings, and a high-contrast layout. It will not reuse Allan Children Foundation wording, handwritten treatment, page layout, imagery, or identity.

| Page area | Proposed original treatment | Safety condition |
|---|---|---|
| Homepage hero | Animated abstract pathways plus optional approved visual tile | No identifying images unless the profile and photo are both public |
| Sponsor Talent introduction | “How private partnership works” sequence with three calm steps | No payment, public sponsorship, or private pipeline details |
| Media section | Curated photo mosaic with a “View approved updates” link | Only administrator-published, approved media |
| Video | One approved introduction embed with a poster state | Use an approved unlisted video host initially; no raw large-file upload |
| Foundation updates | Optional category-based update collection | No named children, financial reports, or unsupported impact claims |

## Durable Media Architecture

The temporary Firestore image fallback should not be used for a media-heavy launch. The recommended architecture keeps the completed Firebase security model and adds **Supabase Storage as a dedicated media layer**.

| Responsibility | Service | Implementation boundary |
|---|---|---|
| Sponsor and administrator identity | Firebase Authentication | Existing passwordless invitation workflow and Firebase claims remain unchanged |
| CMS data and public/private flags | Firestore | Existing server-authorized CMS routes remain unchanged |
| Images, galleries, approved documents | Supabase Storage | Private bucket, server-only upload credentials, and object-level access policy |
| Public media access | Next.js server route | The route checks that the record and the relevant media field are public before issuing/redirecting to a short-lived asset link |
| Sponsor/private media access | Next.js server route | The route validates a fresh Firebase token and approved sponsor or administrator status before delivery |
| Large introduction video | Approved unlisted embed to start | Keeps large video files and streaming outside the initial storage budget |

Supabase currently lists 1 GB file storage, 5 GB egress, a 50 MB maximum file upload, and custom access controls on its Free plan. It also pauses Free projects after one week without activity, so it is appropriate for initial galleries but should be monitored before it becomes the sole long-term archival service. [1] Supabase Storage is private by default until Row Level Security policies explicitly permit an operation. [2]

## Work Sequence

| Stage | My repair-branch work | What PWLIF needs to provide | Completion evidence |
|---|---|---|---|
| 1. Media foundation | Add server-only Supabase media client, private buckets, access policies, safe upload routes, and media metadata fields; remove the temporary Firestore image fallback from the active editor. | Create a free Supabase project and securely provide its project URL and service-role key through the project’s secure settings prompt. | Admin can upload an approved photo; public/sponsor/admin visibility tests pass. |
| 2. Creative public refresh | Build the original Potential in Motion hero and the media-led section rhythm while retaining the public navigation and PWLIF brand. | Approve the hero concept and provide only consented, non-identifying images or confirm that the abstract-only opening should launch first. | Desktop and mobile visual review on Preview. |
| 3. High-media CMS | Add gallery selection, captions, alt text, individual publication controls, and a safe approved-updates archive. | Supply approved media and short non-identifying captions. | Admin changes propagate through the existing server routes. |
| 4. Launch readiness | Final booking-to-approval-to-invitation test, protected media test, environment review, and preview sign-off. | Complete the dashboard settings in the launch checklist and give explicit production approval. | PR remains open until formal approval; only then is a production merge considered. |

## Your Immediate Actions

You do not need to change Firebase, move the database, or pay for Firebase Storage. If you approve the architecture, do only the following actions in order.

1. Create a free account at [Supabase](https://supabase.com/) using an account the Foundation can retain access to.
2. Create one project named `pwlif-media`. Select a region that is practical for the Foundation’s main administrators; accept the Free plan.
3. Do not create public buckets or write any access policies yourself. I will provide those through the controlled implementation after the server connection is prepared.
4. In the Supabase project, open **Project Settings → API**. Supply the project URL and service-role key only through the secure project settings prompt when I request them. Do not paste the service-role key into chat, GitHub, Vercel, screenshots, or source code. The key bypasses Storage access controls and must stay server-only. [2]
5. Reply with **“Supabase project created”**. I will then request the two secure values through the correct protected fields and start Stage 1.

## Decisions Still Needed Before Production

| Decision | Recommended initial choice |
|---|---|
| Hero imagery at first launch | Abstract Potential in Motion design, with optional consented, non-identifying imagery added later |
| Media hosting | Supabase Storage for photos/documents; unlisted embed for the first introduction video |
| Public content | Approved summaries and selected media only; all Sponsor Talent fields remain private unless explicitly enabled |
| Video library | Defer raw video hosting until actual volume and a sustainable budget are known |
| Production release | Wait until media delivery, sponsor invitation flow, Firebase domains, and approved content are tested in Preview |

## References

[1] [Supabase Pricing](https://supabase.com/pricing)

[2] [Supabase Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control)
