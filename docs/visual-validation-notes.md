# Visual Validation Notes

## 2026-08-20 — Local route isolation

The process already listening on local port `3000` served the separate legacy Manus PWLIF project, not this repair-branch Next.js application. It must not be used to judge the public-interface refresh in this repository. The repair branch will be started and reviewed on an isolated local port before Preview deployment validation.

## 2026-08-20 — Initial isolated public review

The repair branch was reviewed on local port `3001`. The refreshed home page renders the new dark PWLIF hero, clear primary and secondary orientation actions, public-only Sponsor Talent cards, and safeguarding footer. The refreshed Sponsor Talent directory renders the matching editorial hero, public-access note, search and category controls, and non-identifying public cards. Both route views preserve the intended public copy and secure navigation destinations.

The Mission and Vision route renders the shared editorial hero, managed foundation identity content, values sequence, and orientation call to action. The private orientation route renders the refreshed public shell while retaining the existing private request form, consent control, and post-save booking handoff. No public media or sponsor access controls were added or weakened by these visual updates.

## 2026-08-20 — Navigation and new information pages

The `/foundation-updates` route renders the shared editorial shell, the approved public navigation destinations, and an explicit no-updates-yet state without invented announcements or figures. The `/media-gallery` route renders the same shell and an explicit no-public-gallery-items state, making clear that any future material must be approved, permissioned, and non-identifying.

Desktop navigation now exposes the approved public route groups: About Us, Our Approach, News & Updates, Media & Press, Get Involved, and Contact. Portal routes remain separate from this public navigation.
