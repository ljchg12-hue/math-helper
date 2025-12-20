# math-features

Learning support features for Math Helper.

## Overview

This crate provides 8 feature modules to enhance the learning experience:

### Features

1. **Practice Problem Generator** - Auto-generates math problems with configurable difficulty
2. **Mistake Notes** - Tracks wrong answers with retry counting and mastery status
3. **Progress Tracker** - Monitors learning progress with mastery level calculations
4. **Calculation History** - Records all calculations with timestamps
5. **Data Visualization** - Creates charts for progress tracking (Matplotlib equivalent)
6. **Interactive Plots** - Plotly-style interactive visualizations
7. **Data Export** - Exports data to JSON/CSV formats with path sanitization
8. **Study Sessions** - Tracks study time and session management

## Features

- **Persistent Storage** - JSON-based data persistence in `~/.math_helper/`
- **Random Problem Generation** - Configurable difficulty levels (easy/medium/hard)
- **Progress Analytics** - Mastery level calculation and study time tracking
- **Security** - Path sanitization to prevent directory traversal attacks
- **Export Formats** - JSON and CSV with UTF-8 support

## Dependencies

- `math-core` - Core calculation library
- `serde` family - JSON/CSV serialization
- `chrono` - Date and time handling
- `rand` - Random number generation for problems
- `dirs` - Platform-specific directories
- `anyhow` - Error handling

## Usage Example

```rust
use math_features::practice::PracticeGenerator;
use math_features::progress::ProgressTracker;

// Generate practice problem
let generator = PracticeGenerator::new();
let problem = generator.generate_problem("linear_equation", Difficulty::Medium)?;

println!("Question: {}", problem.question);
println!("Answer: {}", problem.answer);

// Track progress
let mut tracker = ProgressTracker::new()?;
tracker.record_attempt("linear_equation", true, 120)?; // 120 seconds
let mastery = tracker.calculate_mastery_level("linear_equation")?;

println!("Mastery level: {:.1}%", mastery * 100.0);
```

## Data Storage

All data is stored in:
- **Linux/Mac**: `~/.math_helper/`
- **Windows**: `C:\Users\<username>\.math_helper\`

Files:
- `mistakes.json` - Mistake notes
- `progress.json` - Learning progress
- `history.json` - Calculation history
- `exports/` - Exported data files

## Module Structure

```
src/
├── lib.rs
├── practice.rs      # Problem generation
├── mistakes.rs      # Mistake tracking
├── progress.rs      # Progress tracking
├── history.rs       # History management
├── visualization.rs # Charts and plots
└── export.rs        # Data export
```

## Testing

```bash
cargo test
cargo test --features "all"
```

## License

MIT OR Apache-2.0
