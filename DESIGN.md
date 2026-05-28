---
name: Apex Motorsport Design System
colors:
  surface: '#12131a'
  surface-dim: '#12131a'
  surface-bright: '#383940'
  surface-container-lowest: '#0c0e14'
  surface-container-low: '#1a1b22'
  surface-container: '#1e1f26'
  surface-container-high: '#282a31'
  surface-container-highest: '#33343c'
  on-surface: '#e2e1eb'
  on-surface-variant: '#e6beb2'
  inverse-surface: '#e2e1eb'
  inverse-on-surface: '#2f3037'
  outline: '#ad897e'
  outline-variant: '#5c4037'
  surface-tint: '#ffb59e'
  primary: '#ffb59e'
  on-primary: '#5e1700'
  primary-container: '#ff571a'
  on-primary-container: '#521300'
  inverse-primary: '#ae3200'
  secondary: '#ffb3b1'
  on-secondary: '#680011'
  secondary-container: '#ad0224'
  on-secondary-container: '#ffb8b5'
  tertiary: '#a5c8ff'
  on-tertiary: '#00315e'
  tertiary-container: '#2492ff'
  on-tertiary-container: '#002a53'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#3a0b00'
  on-primary-fixed-variant: '#852400'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b1'
  on-secondary-fixed: '#410007'
  on-secondary-fixed-variant: '#92001c'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#a5c8ff'
  on-tertiary-fixed: '#001c3a'
  on-tertiary-fixed-variant: '#004785'
  background: '#12131a'
  on-background: '#e2e1eb'
  surface-variant: '#33343c'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  nepali-body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.8'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  section-gap: 80px
---

## Brand & Style
This design system is engineered for a premium automotive marketplace in Nepal, targeting high-net-worth individuals and enthusiasts seeking performance and luxury. The brand personality is aggressive yet refined, evoking the adrenaline of a high-speed track combined with the exclusivity of a private showroom.

The aesthetic follows a **High-Performance Dark** style, blending **Glassmorphism** with **Minimalist** precision. The interface relies on deep, layered blacks and charcoals to allow vehicle photography to stand out. Visual interest is generated through semi-transparent blurred overlays, ultra-thin high-contrast borders, and focused "Turbo Orange" accents that guide the user toward key actions. The overall emotional response should be one of uncompromising speed, mechanical precision, and institutional trust.

## Colors
The palette is rooted in the "Midnight Circuit" concept. The primary background is `surface_black`, providing a bottomless depth. UI containers use `surface_charcoal` to create a tiered visual hierarchy.

- **Primary (Turbo Orange):** Used for primary CTAs, performance metrics, and active states. It represents heat and energy.
- **Secondary (Racing Red):** Reserved for alerts, price drops, or high-performance badges (e.g., "Sport" mode filters).
- **Glass System:** Use `accent_glass` for card backgrounds with a 20px backdrop blur. Borders must remain `border_subtle` (1px) to maintain a razor-sharp, technical feel.

## Typography
The typography system balances the geometric power of **Montserrat** for headlines with the utilitarian clarity of **Inter** for data and body text. 

- **Performance Headings:** High-impact "Display" sizes use heavy weights and tight tracking to mimic automotive badging.
- **Bilingual Support:** Nepali text (Devanagari) is mapped to Inter's native support or a compatible system fallback. Due to the height of Devanagari script, line-heights for Nepali-specific blocks are increased by 20% compared to English equivalents to prevent vertical clipping.
- **Currency Formatting:** NPR (Rs.) values should always use `Inter` with tabular numbers enabled to ensure price lists align perfectly.

## Layout & Spacing
The layout uses a **fixed-width central grid** for desktop (12 columns) and a **fluid grid** for mobile (4 columns). 

- **Rhythm:** A 4px baseline grid ensures mechanical alignment.
- **Margins:** Desktop uses wide 24px gutters to allow the "Glass" card effects enough room to breathe without overlapping their blurs. 
- **Adaptation:** On mobile, section gaps compress from 80px to 48px to maintain momentum while scrolling. All vehicle spec grids reflow from a 4-column layout to a 2-column stacked layout on mobile devices.

## Elevation & Depth
Depth is not created with traditional shadows, but through **Tonal Layering** and **Backdrop Blurs**.

- **Level 0 (Base):** `surface_black`.
- **Level 1 (Cards):** `surface_charcoal` with a 1px `border_subtle`.
- **Level 2 (Overlays/Modals):** Glassmorphic panels with 60% opacity and a 20px-32px blur radius.
- **Shadows:** Use a single "Deep Ambient" shadow for floating elements: `0px 24px 48px rgba(0, 0, 0, 0.5)`. This shadow should be felt, not seen, providing a subtle lift from the background.

## Shapes
This design system utilizes **Soft** (0.25rem) corner radii to maintain a technical, engineered appearance. While fully rounded "pill" shapes are avoided for structural elements to keep the "precision" feel, small decorative elements like "New" or "Turbo" badges may use a slightly higher radius (`rounded-lg`) to distinguish them from functional UI components.

## Components
- **Primary Buttons:** Solid "Turbo Orange" with black text (Montserrat Bold). 1px inner "light leak" top border for a metallic tactile effect.
- **Vehicle Cards:** Glassmorphic background, 1px subtle border. High-resolution imagery should bleed to the top edges. Price displayed in `Inter` Bold with the NPR symbol.
- **Input Fields:** Dark charcoal fill, 1px border. On focus, the border glows with a 2px Turbo Orange outer shadow.
- **Chips/Badges:** Used for vehicle specs (e.g., "Automatic", "V8", "Electric"). Subtle grey background with uppercase Inter labels.
- **NPR Price Display:** Always prefix with "Rs." followed by a non-breaking space. Use comma separators for lakhs and crores consistent with Nepali numbering (e.g., Rs. 1,50,00,000).
- **Navigation:** Top-mounted, semi-transparent glass bar that sticks to the top of the viewport with a heavy backdrop-filter blur.