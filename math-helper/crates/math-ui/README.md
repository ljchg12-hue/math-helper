# math-ui

User interface layer for Math Helper.

## Overview

This crate provides the UI framework for Math Helper. The UI framework is **not yet chosen** - see options below.

## UI Framework Options

### Option 1: egui (Immediate Mode GUI)

**Pros:**
- Simple and fast
- Cross-platform (Windows, Mac, Linux, Web via WASM)
- Built-in plotting with `egui_plot`
- Minimal boilerplate

**Cons:**
- Immediate mode (re-renders every frame)
- Less traditional look and feel

**Dependencies:**
```toml
egui = "0.24"
eframe = "0.24"
egui_plot = "0.24"
```

### Option 2: iced (Elm-Inspired)

**Pros:**
- Declarative, reactive architecture
- Beautiful default styling
- Type-safe message passing

**Cons:**
- More boilerplate than egui
- Smaller ecosystem

**Dependencies:**
```toml
iced = "0.12"
```

### Option 3: Tauri (Web + Rust Backend)

**Pros:**
- Use existing web technologies (HTML/CSS/JS)
- Rust backend for performance
- Small bundle size
- Native system integration

**Cons:**
- Requires web development knowledge
- Two-language stack

**Dependencies:**
```toml
tauri = "1.5"
serde_json = "1.0"
```

### Option 4: Web Backend (axum/actix-web)

**Pros:**
- Accessible from any device with browser
- Can reuse existing Streamlit experience
- RESTful API architecture

**Cons:**
- Requires separate frontend
- More complex deployment

## Current Status

🚧 **UI framework not yet selected** - Will be chosen in Phase 4 of migration (weeks 8-10).

## Planned Features

- **Calculator Pages** - 17 calculator interfaces
- **Feature Pages** - Practice, mistakes, progress, history
- **Theming** - Light/dark mode support
- **Responsive Design** - Mobile, tablet, desktop layouts
- **Accessibility** - ARIA labels, keyboard navigation
- **Data Visualization** - Interactive charts and graphs

## Module Structure (Planned)

```
src/
├── lib.rs
├── app.rs           # Main application
├── themes.rs        # Theme management
├── pages/
│   ├── mod.rs
│   ├── calculators/ # Calculator UIs
│   └── features/    # Feature UIs
└── components/      # Reusable UI components
```

## Development

This crate is currently a placeholder. Implementation will begin in Phase 4.

## License

MIT OR Apache-2.0
