# PWLIF UI Direction — Approval Brief

## Reference qualities observed

The Allan Children Foundation homepage uses a full-bleed, high-media hero; a compact transparent navigation overlay; one clear primary call to action; a secondary video action; large, emotionally direct type; and alternating media-and-copy sections. Its long-form flow moves from an opening statement to a mission section, program themes, stories, and action prompts.

## PWLIF translation — original, not a copy

PWLIF should retain its official logo and navy, green, blue, gold, and restrained magenta palette. Rather than reproducing the reference site’s green photographic overlay, red script wordmark, child-group imagery, donation-first CTA, or editorial structure, PWLIF should use a deep-navy "Potential in Motion" hero with animated light paths in brand colours. The primary action remains **Explore Sponsor Talent**; the secondary action remains **Book Sponsor Orientation**. Public content must remain non-identifying and privacy-first.

## Proposed public-page hierarchy

1. Compact logo-led navigation that remains readable against the hero.
2. Full-viewport Potential in Motion hero, with motion paths and controlled media-safe areas.
3. A short safeguarding and orientation proposition with two actions.
4. Sponsor Talent preview cards populated only through the existing safe public data route.
5. Foundation introduction/video section that presents a ready-state rather than a fictional video.
6. Mission, pathway, team, and FAQ modules using an alternating editorial rhythm.
7. A clear private-orientation call to action and an accessible footer.

## Reference structure translated into PWLIF routes

| Reference page pattern | Original PWLIF route(s) | PWLIF structural translation |
| --- | --- | --- |
| Full-screen hero, compact overlay navigation, two actions | `/` | Potential in Motion visual hero, primary **Explore Sponsor Talent** action, secondary **Book Sponsor Orientation** action, no donation claim. |
| Organization story with alternating media and copy, mission, team, FAQ | `/mission-vision`, `/meet-the-team`, `/faq` | One shared high-media editorial shell with PWLIF mission, selectively visible team records, and the existing privacy-first FAQ. |
| Numbered, alternating story modules | `/talents`, `/portfolio/[id]` | Sponsor Talent pathway with safe non-identifying cards; public portfolio details remain gated by existing per-record visibility controls. |
| Long-form article and category-led editorial grid | `/our-pilot`, `/partnership`, `/volunteer` | PWLIF pathway/partner/volunteer information expressed as original short-form editorial modules, not invented impact reporting. |
| Contact page with image-led header and simple inquiry action | `/support`, `/orientation`, `/book-a-call` | Orientation and support routes retain their private intake behavior but receive the shared visual shell and image-led page opener. |
| Utility legal pages | `/security-standards`, `/privacy`, `/privacy-policy`, `/terms`, `/terms-of-service` | A restrained, legible legal-page variation with the shared header/footer; no decorative media that harms readability. |

## Additional reference observations

The reference story page uses a small label, large display heading, numbered feature stories, media-and-copy alternation, and repeated action placement. Its news page uses a category-led editorial opener and a dense scroll of long-form posts. PWLIF can take the hierarchy and paced alternation, but must not reproduce those specific stories, named individuals, impact figures, photography, or donation pathways.

The reference volunteer and partner pages pair image-led openers with a short mission statement, a visual grid, and one clear next action. Its media/press material uses a simple coverage listing and long-form editorial modules. PWLIF will use these page categories only where it already has appropriate routes: `/volunteer`, `/partnership`, and the future foundation-introduction/video area. The rebuild will not invent volunteer profiles, partner logos, press coverage, impact counts, or endorsements.

## Source pages reviewed

- https://www.allanchildrenfoundation.org/
- https://www.allanchildrenfoundation.org/about
- https://www.allanchildrenfoundation.org/success-stories
- https://www.allanchildrenfoundation.org/news-stories
- https://www.allanchildrenfoundation.org/contact
- https://www.allanchildrenfoundation.org/volunteer
- https://www.allanchildrenfoundation.org/partner
- https://www.allanchildrenfoundation.org/media
- https://www.allanchildrenfoundation.org/press

## Approved PWLIF component architecture

The public refresh will use a shared `PublicHero` with a CSS-only Potential in Motion backdrop, a reusable page-intro masthead, a numbered editorial story block, a media frame that only renders permitted PWLIF media, a concise CTA band, and a unified public header/footer. This will keep every public route structurally consistent without introducing a shared layout into `/admin` or `/sponsor`.

The visual system will use cream page ground, deep navy story fields, the official green as the interaction colour, and sparse blue/gold/magenta motion lines as PWLIF-only accents. Montserrat remains the display face and Inter remains the reading face. Curves, asymmetrical media crops, wide breathing room, small all-caps eyebrows, and repeated numbered modules give the public pages a comparable long-scroll rhythm without reproducing the reference-site artwork or treatment.

Public data rules remain unchanged: `TalentPhoto` is used for every Talent image; a public profile needs `profileVisible`; a public photo also needs `photoVisible`; and no person-identifying placeholder, impact figure, testimonial, partnership, or press item will be fabricated to fill a visual module.

## Non-negotiable safeguards

- Do not copy Allan Children Foundation copy, images, logo, claims, donation language, or page layout.
- Do not add named children, fabricated impact figures, reviews, or testimonials.
- Preserve the server-enforced public visibility and protected sponsor/admin boundaries.
- Do not present the browser-only local video picker as persistent uploaded media.
- Do not merge or deploy to Production until the user explicitly approves after final checks.

## Approval requested

Approve the PWLIF-specific direction above before any user-interface implementation begins.
