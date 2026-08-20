# Visual Validation Notes

## 2026-08-20 — Local route isolation

The process already listening on local port `3000` served the separate legacy Manus PWLIF project, not this repair-branch Next.js application. It must not be used to judge the public-interface refresh in this repository. The repair branch will be started and reviewed on an isolated local port before Preview deployment validation.

## 2026-08-20 — Initial isolated public review

The repair branch was reviewed on local port `3001`. The refreshed home page renders the new dark PWLIF hero, clear primary and secondary orientation actions, public-only Sponsor Talent cards, and safeguarding footer. The refreshed Sponsor Talent directory renders the matching editorial hero, public-access note, search and category controls, and non-identifying public cards. Both route views preserve the intended public copy and secure navigation destinations.

The Mission and Vision route renders the shared editorial hero, managed foundation identity content, values sequence, and orientation call to action. The private orientation route renders the refreshed public shell while retaining the existing private request form, consent control, and post-save booking handoff. No public media or sponsor access controls were added or weakened by these visual updates.
