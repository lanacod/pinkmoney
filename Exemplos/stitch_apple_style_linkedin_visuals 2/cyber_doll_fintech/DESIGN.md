---
name: Cyber-Doll Fintech
colors:
  surface: '#280619'
  surface-dim: '#280619'
  surface-bright: '#552c3f'
  surface-container-lowest: '#220313'
  surface-container-low: '#320f21'
  surface-container: '#371325'
  surface-container-high: '#441d30'
  surface-container-highest: '#50283b'
  on-surface: '#ffd8e6'
  on-surface-variant: '#dfbec8'
  inverse-surface: '#ffd8e6'
  inverse-on-surface: '#4b2336'
  outline: '#a78992'
  outline-variant: '#584048'
  surface-tint: '#ffb0cc'
  primary: '#ffb0cc'
  on-primary: '#640038'
  primary-container: '#ff4fa3'
  on-primary-container: '#5d0034'
  inverse-primary: '#b7046c'
  secondary: '#ffb1c2'
  on-secondary: '#66002b'
  secondary-container: '#b20150'
  on-secondary-container: '#ffc1cd'
  tertiary: '#f2b5d0'
  on-tertiary: '#4c2338'
  tertiary-container: '#bb849d'
  on-tertiary-container: '#471f34'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd9e4'
  primary-fixed-dim: '#ffb0cc'
  on-primary-fixed: '#3e0021'
  on-primary-fixed-variant: '#8d0051'
  secondary-fixed: '#ffd9df'
  secondary-fixed-dim: '#ffb1c2'
  on-secondary-fixed: '#3f0018'
  on-secondary-fixed-variant: '#8f003f'
  tertiary-fixed: '#ffd8e7'
  tertiary-fixed-dim: '#f2b5d0'
  on-tertiary-fixed: '#330e22'
  on-tertiary-fixed-variant: '#65394f'
  background: '#280619'
  on-background: '#ffd8e6'
  surface-variant: '#50283b'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  numeric-xl:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 24px
  element-gap: 16px
  section-gap: 32px
---

## Brand & Style
The brand personality is a high-energy fusion of "Barbiecore" luxury and "Kawaii" futurism. It targets a trend-conscious, digitally native audience that views personal finance as an extension of their lifestyle and aesthetic identity. The UI should feel like a premium digital accessory—optimistic, playful, yet undeniably sophisticated.

The design style is **Futuristic Glassmorphism**. It utilizes multi-layered translucent surfaces, vibrant neon accents, and soft, luminous glows to create a sense of depth and tactility. The aesthetic incorporates Y2K-inspired motifs, such as sparkling star patterns and soft-focus gradients, grounded by a clean, modern fintech structure to maintain financial credibility.

## Colors
The palette is dominated by a range of pinks, set against a deep magenta-black foundation to ensure the "Cyber-Doll" aesthetic remains premium rather than childish.

- **Primary (Neon Pink):** Used for interactive elements, primary actions, and critical data visualizations.
- **Secondary (Dark Pink):** Used for structural accents and depth-building gradients.
- **Tertiary (Light Pink):** Reserved for soft backgrounds and subtle text variations.
- **Surface (Deep Magenta):** The base layer of the app, providing a dark, high-contrast canvas for glass effects.
- **Details (Sparkling White):** Used for high-contrast text and luminous "star" accents.

Gradients should transition from `#C2185B` to `#1A000D` for background surfaces to create an atmospheric, infinite depth.

## Typography
The typography system prioritizes roundness and legibility with a futuristic edge. **Plus Jakarta Sans** provides a friendly, welcoming feel for the majority of the interface. For data-heavy areas, balance totals, and technical labels, **Geist** is used to introduce a precise, "tech-first" monospaced rhythm.

Headlines should occasionally feature a subtle external glow (`drop-shadow`) in Neon Pink to emphasize the futuristic aesthetic. Numeric values are emphasized to give users immediate clarity on their financial status.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous margins to allow the glassmorphic elements "room to breathe."

- **Mobile:** 4-column grid with 24px side margins and 16px gutters. 
- **Desktop:** 12-column grid centered at a max-width of 1200px.

Spacing is strictly based on an 8px scale. To enhance the "kawaii" feel, internal padding within cards and containers is increased (24px - 32px) to create an airy, plush appearance.

## Elevation & Depth
Depth is achieved through **Glassmorphism** rather than traditional shadows. 

1. **Base Layer:** Deep magenta gradient.
2. **Surface Layer:** Semi-transparent white or pink (10-15% opacity) with a 20px backdrop blur.
3. **Accent Layer:** High-opacity borders (0.5px to 1px) in Light Pink to define the edges of "glass" cards.
4. **Luminous Depth:** Soft "blobs" of Neon Pink glow placed behind glass surfaces to create focal points and signify hierarchy.

Avoid heavy black shadows; instead, use outer glows in Primary Neon Pink for elevated interactive elements.

## Shapes
The shape language is defined by extreme "Pill-shaped" roundedness. All primary containers, buttons, and input fields must use a minimum radius of 1rem (16px) or fully rounded corners (pill-shape) for smaller elements. This softness contrasts with the technical nature of fintech, reinforcing the "kawaii" and approachable aesthetic.

## Components
- **Buttons:** Primary buttons are solid Neon Pink with white text and a soft pink outer glow. Secondary buttons use the "glass" style with a thin Light Pink stroke.
- **Glass Cards:** The centerpiece of the UI. Must feature `backdrop-filter: blur(20px)`, a 1px Light Pink border, and a subtle star-patterned background overlay.
- **Input Fields:** Semi-transparent dark pink backgrounds with pill-shaped corners. The cursor and focus-state border should be "White Sparkle."
- **Chips:** Small, fully rounded capsules used for transaction categories, featuring high-saturation pink backgrounds.
- **Star Pattern:** A repeating, low-opacity Y2K star motif used as a background element for empty states or dashboard headers.
- **Progress Bars:** Thick, rounded tracks with a "glow-pulse" animation on the active segment.