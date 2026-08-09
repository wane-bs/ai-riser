
Build a single full-screen (h-screen w-full overflow-hidden) hero page for *nexum* — a dark cinematic AI-ops landing hero with a full-bleed background video, glassmorphism nav/cards, and bottom-anchored content. Stack: React + Tailwind + lucide-react (ChevronDown, Menu, X). No routing. One section only.

### Fonts (exact)

Load from Google Fonts:
https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Silkscreen:wght@400;700&display=swap

- Global body: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif with antialiased smoothing
- Stats number "42,500+" only: fontFamily: "'Silkscreen', cursive", weight normal, tracking-tight
- Everything else is Geist

### Background video (exact URL + behavior)

https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4

- Absolutely positioned inset-0, h-full w-full object-cover
- Attributes: autoPlay, loop, muted, playsInline
- No overlay gradient; content sits directly over the video at z-10

### Page title

Nexum Hero

### Layout architecture

<section> full viewport
  <video> absolute full-bleed
  <div z-10 flex-col h-full>
    <nav> top bar
    [mobile overlay + slide-in panel]
    <main content> mt-auto bottom-anchored
      left: headline + email CTA
      right: two glass cards
