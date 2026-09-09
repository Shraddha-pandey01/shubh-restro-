---
name: Cinematic Noir
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#c6c7c2'
  on-secondary: '#2f312e'
  secondary-container: '#484a46'
  on-secondary-container: '#b8b9b4'
  tertiary: '#d0cdcd'
  on-tertiary: '#313030'
  tertiary-container: '#b4b2b2'
  on-tertiary-container: '#454544'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e3e3de'
  secondary-fixed-dim: '#c6c7c2'
  on-secondary-fixed: '#1a1c19'
  on-secondary-fixed-variant: '#454744'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 84px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.8'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.2em
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 24px
  section-gap: 160px
---

## Brand & Style
The design system is anchored in a cinematic editorial aesthetic, evoking the atmosphere of a Michelin-starred establishment at dusk. It targets a discerning audience that values exclusivity, craftsmanship, and high-sensory experiences.

The visual style is a fusion of **Minimalism** and **Glassmorphism**, leaning heavily into "The Great Gatsby" levels of sophistication but refined for a modern digital era. The interface acts as a quiet stage for high-end photography, utilizing expansive whitespace (or "dark space") to create a sense of breath and luxury. Design elements are razor-sharp, punctuated by delicate gold accents and soft, deep shadows that provide a physical presence to the UI without feeling heavy.

## Colors
The palette is centered on high-contrast luxury. 
- **Primary (Gold):** Used sparingly for interactive elements, highlights, and delicate borders. It represents the "sparkle" of the brand.
- **Secondary (Cream):** The primary text color for readability against dark backgrounds, providing a softer contrast than pure white.
- **Surface (Charcoal & Black):** The foundation of the UI. `#0A0A0A` is used for deep backgrounds, while `#1A1A1A` defines elevated surfaces and containers.

## Typography
The typography follows an editorial hierarchy. **Playfair Display** provides the romantic, high-society character for headlines. **Montserrat** is used for body copy and labels, specifically in lighter weights (300/400) to maintain a modern, airy feel.

Large-scale display text should be used for section transitions and hero areas. For body text, generous line height (1.8) is mandatory to ensure the layout feels "expensive" and unhurried. Use the `label-caps` style for navigation items and small subtitles to create a structured, professional look.

## Layout & Spacing
This design system utilizes a **12-column fixed grid** for desktop (max-width 1440px) and a fluid single-column grid for mobile. 

Luxury is defined by "wasted" space. Vertical gaps between sections should be significant (160px+) to encourage a slow, scrolling experience. Components should be aligned to a strict 8px baseline grid, but within containers, padding should be asymmetrical to create an editorial, off-balance visual interest. Photography should often break the grid or bleed to the edges of the viewport to enhance the cinematic effect.

## Elevation & Depth
Depth is achieved through **Tonal Layers** and **Glassmorphism**. 
- **Base:** The deepest layer is `#0A0A0A`.
- **Raised Surfaces:** Cards and menus use `#1A1A1A` with a subtle 1px border of `#D4AF37` at 20% opacity.
- **Overlays:** Modals and navigation bars use a backdrop filter (`blur(20px)`) combined with a semi-transparent black (`rgba(10, 10, 10, 0.7)`).
- **Shadows:** Use extremely soft, long-spread shadows (`offset: 0 20px, blur: 40px, color: rgba(0,0,0,0.5)`) to suggest elements are floating over a dimly lit table.

## Shapes
The shape language is **Sharp**. To maintain a high-fashion and architectural feel, rounding is avoided. Rectangular buttons, input fields, and images create a sense of precision and stability. Rare exceptions are made for purely decorative elements like "View Detail" circles, which should be perfectly round to contrast the dominant 90-degree angles.

## Components
- **Navigation:** A floating, glassmorphic bar. Links use `label-caps`. The "Book a Table" CTA is a primary gold button with a sharp 0px radius.
- **Buttons:** 
  - *Primary:* Gold background, black text, sharp corners. On hover, background shifts to Cream.
  - *Secondary:* Ghost style with a 1px gold border.
- **Menu Listings:** Editorial layout with an image on the left/right and the dish name in `headline-md`. Price is set in gold `body-md`. Use a thin 1px gold divider between items.
- **Forms:** Input fields are bottom-border only (1px gold). Labels float above in `label-caps`. Focus states should intensify the border glow.
- **Reservation Dashboard:** Uses a dark-mode card interface. Data points are presented with high-contrast typography. Use subtle gold icons for status indicators.
- **Feedback Cards:** Quote-style layouts. The review text is in `headline-md` (italicized Playfair), with the author name in `label-caps` gold.
- **Interactive Motion:** Elements should "fade and slide" up into view. Hovering over a menu item should trigger a subtle zoom-in on the dish photography.