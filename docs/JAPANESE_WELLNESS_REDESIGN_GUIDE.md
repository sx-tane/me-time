# Japanese Wellness Visual Redesign Guide - 和の美学

## Design Philosophy

### Core Principles
1. **Wabi-sabi (侘寂)** - Finding beauty in imperfection and simplicity
2. **Ma (間)** - Purposeful use of negative space
3. **Kanso (簡素)** - Simplicity and elimination of clutter
4. **Shizen (自然)** - Natural, effortless appearance
5. **Yūgen (幽玄)** - Subtle grace and hidden beauty

## Visual Language

### Color Story
- **Primary Palette**: Warm earth tones inspired by natural materials (wood, sand, stone)
- **Accent Colors**: Soft pastels from Japanese nature (sakura pink, matcha green, indigo blue)
- **Neutral Grays**: "Nezumi-iro" (mouse colors) - sophisticated gray variations

### Typography Hierarchy
```
Display: 48px - Moments of impact (sparse use)
Heading: 31px - Section headers
Subheading: 25px - Card titles
Body: 16px - Main content
Caption: 13px - Supporting text
Micro: 11px - Labels and hints
```

### Spacing Rhythm
Based on traditional Japanese measurements:
- Base unit: 4px (一分)
- Increments follow natural progression: 4, 8, 12, 16, 20, 24, 32, 40...

### Visual Elements
1. **Organic Shapes**: Asymmetric border radius for natural feel
2. **Soft Shadows**: Diffused, barely visible (影 - kage)
3. **Subtle Gradients**: Nature-inspired transitions
4. **Decorative Patterns**: Traditional motifs used sparingly

## Component Redesign Specifications

### 1. BlobBackground.js → WashiBackground.js
**Current**: Colorful blob shapes
**Redesign**: 
- Replace with subtle washi paper texture overlay
- Use organic grain patterns with very low opacity (5-10%)
- Implement subtle animated "mist" effect
- Color: Primary background with slight texture variation

```
Visual Elements:
- Paper texture SVG pattern
- Animated opacity shifts (0.05 to 0.10)
- Subtle grain direction changes
- Optional seasonal elements (cherry blossoms, maple leaves) at 3% opacity
```

### 2. ChillButton.js → ZenButton.js
**Current**: Modern rounded button with bold shadows
**Redesign**:
- Primary: Soft earth tone with subtle texture
- Secondary: Ghost button with thin border
- Micro-animations: Gentle scale (0.98) and opacity shifts
- Remove heavy shadows, use barely visible elevation

```
States:
- Rest: Subtle shadow, full opacity
- Hover: Slight lift (2px shadow), 5% darker
- Active: Scale 0.98, shadow removed
- Disabled: 50% opacity, no shadow
```

### 3. GentleButton.js → HarmonButton.js
**Current**: Soft, friendly button
**Redesign**:
- Pill-shaped with organic curves
- Haptic feedback animation (ripple effect)
- Typography: Slightly wider letter spacing
- Optional icon support with 16px size

### 4. GentleTimePicker.js → MindfulTimePicker.js
**Current**: Standard time picker
**Redesign**:
- Circular dial inspired by traditional Japanese clocks
- Hour markers as subtle dots
- Smooth, continuous movement
- Current time highlighted with soft glow
- Background: Subtle circular gradient

```
Visual Details:
- Outer ring: Time periods (morning, afternoon, evening, night)
- Inner dial: Precise time selection
- Center: Selected time display
- Animation: Smooth transitions with natural easing
```

### 5. LocationCarousel.js → JourneyCarousel.js
**Current**: Standard horizontal carousel
**Redesign**:
- Cards with organic shapes (asymmetric corners)
- Subtle parallax effect on scroll
- Misty overlay on inactive cards
- Natural pagination dots (like stones)

```
Card Design:
- Washi paper texture background
- Soft edge vignette
- Location image with 20% overlay
- Typography: Location name in larger, mood in smaller text
```

### 6. LocationSuggestionCard.js → PlaceCard.js
**Current**: Standard suggestion card
**Redesign**:
- Organic shape with unique corner radius per card
- Subtle animated grain texture
- Image treatment: Soft vignette, warm filter
- Text hierarchy: Place name prominent, details subtle

### 7. ModernComponents.js → WaComponents.js
**Complete component library redesign**:

#### ModernCard → WashiCard
- Paper-like texture with subtle shadows
- Organic corner radius
- Optional decorative border pattern

#### GlassCard → MistCard
- Translucent overlay effect
- Soft blur backdrop
- Animated opacity shifts

#### FAB → FloatingAction
- Circular with subtle shadow
- Icon-only design
- Gentle pulse animation on idle

#### ModernInput → TextFieldZen
- Minimal underline style
- Label floats on focus
- Soft transition animations
- Error states in muted red

#### Chip → SelectionStone
- Pill-shaped selections
- Subtle press animations
- Selected state: Darker shade, not colored

#### ProgressBar → JourneyProgress
- Thin line with rounded ends
- Subtle gradient fill
- Optional milestone dots

#### Avatar → PersonaCircle
- Perfect circles with subtle border
- Fallback: Simple initial or icon
- Online indicator as small dot

### 8. PeacefulLoader.js → ContemplationLoader.js
**Current**: Standard loading animation
**Redesign**:
- Ensō circle drawing animation
- Breathing dot pattern
- Subtle opacity pulses
- Optional zen quotes during longer loads

### 9. StepByStepLoader.js → PathLoader.js
**Current**: Step progress indicator
**Redesign**:
- Stepping stones visual metaphor
- Each step as a circular stone
- Connected by subtle dotted path
- Current step subtly glows

### 10. SuggestionCard.js → MomentCard.js
**Current**: Standard suggestion display
**Redesign**:
- Haiku-inspired layout (3 lines of text)
- Large imagery with text overlay
- Subtle ken-ken (seeing) animation on hover
- Time of day affects card tinting

### 11. SettingsScreen.js → PreferencesGarden.js
**Current**: Standard settings list
**Redesign**:
- Grouped in organic sections
- Toggle switches as day/night symbols
- Sliders with natural markers
- Section headers with subtle icons

### 12. MindfulContainer.js → SacredSpace.js
**Current**: Basic container component
**Redesign**:
- Generous padding (Ma principle)
- Subtle inset shadow for depth
- Optional seasonal decorations
- Responsive padding adjustments

## Animation Guidelines

### Timing Functions
```javascript
natural: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
smooth: 'cubic-bezier(0.45, 0, 0.55, 1)'
gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
```

### Animation Durations
- Micro: 200ms (button presses, hovers)
- Short: 350ms (page transitions, reveals)
- Long: 500ms (complex transitions)
- Contemplative: 750ms+ (loaders, ambiance)

### Animation Patterns
1. **Fade and Scale**: Elements appear with subtle scale (0.95 to 1)
2. **Slide and Fade**: Horizontal elements slide with opacity
3. **Ripple**: Touch feedback as expanding circles
4. **Breathing**: Gentle opacity/scale pulses for waiting states

## Interactive States

### Touch Feedback
- Scale down: 0.98
- Opacity: 0.9
- Duration: 100ms in, 200ms out

### Focus States
- Subtle outline (2px, 20% opacity)
- Slight elevation increase
- No harsh color changes

### Hover States (if applicable)
- Elevation increase by 1 level
- 5% darker tint
- Cursor changes to pointer

## Seasonal Variations

### Spring (Haru - 春)
- Cherry blossom accents
- Lighter color temperatures
- Pink tints in backgrounds

### Summer (Natsu - 夏)
- Deeper greens
- Water ripple effects
- Cooler shadow tones

### Autumn (Aki - 秋)
- Warm orange/red accents
- Maple leaf patterns
- Golden hour lighting effects

### Winter (Fuyu - 冬)
- Cooler grays
- Snow particle effects
- Increased contrast

## Implementation Priority

### Phase 1: Foundation (Week 1)
1. Implement new design system constants
2. Create base components (buttons, cards, inputs)
3. Update color scheme throughout
4. Implement new typography scale

### Phase 2: Components (Week 2)
1. Redesign all interactive components
2. Implement animation system
3. Create new background system
4. Update navigation patterns

### Phase 3: Polish (Week 3)
1. Add seasonal variations
2. Implement advanced animations
3. Optimize performance
4. User testing and refinement

## Accessibility Considerations

1. **Contrast**: Maintain WCAG AA standards
2. **Motion**: Respect reduce-motion preferences
3. **Touch Targets**: Minimum 44px
4. **Focus Indicators**: Clear but subtle
5. **Screen Readers**: Proper labels and hints

## Performance Guidelines

1. **Animations**: Use transform and opacity only
2. **Shadows**: Limit to 2 per screen
3. **Gradients**: Use sparingly
4. **Images**: Lazy load with blur-up
5. **Fonts**: System fonts with optional Japanese

## Cultural Sensitivity

1. **Color Meanings**: Respect Japanese color associations
2. **Symbols**: Use culturally appropriate icons
3. **Text**: Support vertical text where appropriate
4. **Patterns**: Use traditional motifs respectfully
5. **Seasons**: Align with Japanese seasonal calendar