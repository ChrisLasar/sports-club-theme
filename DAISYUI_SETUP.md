# daisyUI 5 Setup Documentation

## Current Setup Status ✅

The project has been configured to follow daisyUI 5 best practices according to the official instructions.

### Configuration Files

#### 1. CSS Configuration (`assets/css/main.css`)

All Tailwind CSS 4 and daisyUI 5 configuration is now done in the CSS file:

```css
@import "tailwindcss";
@plugin "daisyui";
```

**Themes:**
- Using daisyUI's standard built-in themes (light and dark)
- No custom theme configuration
- Themes automatically switch based on system preferences (`prefers-color-scheme`)

**To customize themes later:**
Add a `@plugin "daisyui/theme"` block in `main.css` with your custom colors using OKLCH format.

#### 2. Tailwind Config (`tailwind.config.js`)
⚠️ **DEPRECATED**: This file is no longer used in Tailwind CSS v4. It's kept for reference only and can be deleted. All configuration is now in `assets/css/main.css`.

### daisyUI Usage Guidelines

#### ✅ DO:
1. **Use daisyUI component class names first**
   - Example: `btn`, `card`, `navbar`, `footer`, `menu`, etc.
   
2. **Use daisyUI modifiers and variants**
   - Colors: `btn-primary`, `btn-secondary`, `btn-accent`
   - Sizes: `btn-xs`, `btn-sm`, `btn-md`, `btn-lg`, `btn-xl`
   - Styles: `btn-outline`, `btn-ghost`, `btn-link`
   
3. **Use daisyUI color names for semantic colors**
   - `bg-base-100`, `bg-base-200`, `bg-base-300` for backgrounds
   - `text-base-content` for text on base colors
   - `bg-primary`, `text-primary-content` for branded elements
   - These colors change automatically with theme switching

4. **Use Tailwind utility classes ONLY for spacing and layout**
   - Spacing: `p-4`, `mx-auto`, `gap-6`, `mt-8`
   - Layout: `container`, `grid`, `flex`, `grid-cols-3`
   - Sizing: `w-full`, `h-auto`, `max-w-2xl`
   - Responsive: `lg:flex`, `md:grid-cols-2`

#### ❌ DON'T:
1. **Don't use Tailwind color classes for text/backgrounds**
   - ❌ `bg-blue-500`, `text-gray-800`
   - ✅ `bg-primary`, `text-base-content`
   - Reason: Tailwind colors won't adapt to theme changes

2. **Don't recreate existing daisyUI components**
   - If daisyUI has a component, use it
   - Only create custom components when daisyUI doesn't provide it

3. **Don't use `!important` unless absolutely necessary**
   - If customization doesn't work, use `!` suffix: `bg-red-500!`
   - This should be a last resort

### Current Component Usage

The project currently uses these daisyUI components correctly:

#### Header (`layouts/partials/header.html`)
- ✅ `navbar` with `navbar-start`, `navbar-center`, `navbar-end`
- ✅ `btn btn-ghost` for logo/brand
- ✅ `menu menu-horizontal` for desktop navigation
- ✅ `dropdown dropdown-end` for mobile menu
- ✅ `menu menu-compact` for mobile menu items

#### Footer (`layouts/partials/footer.html`)
- ✅ `footer footer-center` for centered footer layout
- ✅ `link link-hover` for footer links
- ✅ Appropriate use of `grid` for layout

#### Home Page (`layouts/index.html`)
- ✅ `hero` component with `hero-content`
- ✅ `btn btn-primary`, `btn btn-secondary`, `btn-outline`
- ✅ Appropriate use of `grid` for card layouts

### Package Dependencies

```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "daisyui": "^5.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

### Theme Customization

Currently using daisyUI's standard themes. To customize theme colors:

1. Add a `@plugin "daisyui/theme"` block to `assets/css/main.css`
2. Define your custom colors using OKLCH format: `oklch(L% C H)` where:
   - L = Lightness (0-100%)
   - C = Chroma (saturation, usually 0-0.4)
   - H = Hue (0-360)
3. Use the [daisyUI Theme Generator](https://daisyui.com/theme-generator/) for visual customization

Example:
```css
@plugin "daisyui/theme" {
  name: "mytheme";
  default: true;
  color-scheme: light;
  --color-primary: oklch(55% 0.3 240);
  --color-secondary: oklch(70% 0.25 200);
  /* ... other colors */
}
```

### Browser Compatibility

The CSS lint warnings for `@plugin` and `@apply` are expected - these are valid Tailwind CSS v4 directives that VS Code doesn't recognize yet. The build process handles them correctly.

### Next Steps for Development

When adding new features:

1. **Check daisyUI components first**: https://daisyui.com/components/
2. **Use daisyUI modifiers**: Check the component docs for available modifiers
3. **Only use Tailwind utilities for**:
   - Layout (grid, flex, container)
   - Spacing (padding, margin, gap)
   - Responsive design (breakpoint prefixes)
4. **Avoid custom CSS unless absolutely necessary**

### Resources

- [daisyUI 5 Documentation](https://daisyui.com)
- [daisyUI Components](https://daisyui.com/components/)
- [daisyUI Theme Generator](https://daisyui.com/theme-generator/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com)
