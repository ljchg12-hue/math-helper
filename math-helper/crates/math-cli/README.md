# math-cli

Command-line interface for Math Helper.

## Overview

Interactive CLI for performing mathematical calculations and managing learning features.

## Features

- **Interactive Mode** - Menu-driven interface with prompts
- **Direct Commands** - Run calculations from command line
- **Colored Output** - Beautiful terminal output with syntax highlighting
- **Progress Bars** - Visual feedback for long operations
- **Data Export** - Export calculations to JSON/CSV
- **Configuration** - User preferences and settings

## Installation

```bash
cd crates/math-cli
cargo build --release
# Binary will be in target/release/math-cli
```

## Usage

### Interactive Mode

```bash
$ math-cli
┌─────────────────────────────────────┐
│     Math Helper CLI v0.1.0          │
│  Middle School Mathematics Helper   │
└─────────────────────────────────────┘

Select an option:
  1. Calculators
  2. Practice Problems
  3. Progress Tracker
  4. Mistake Notes
  5. Settings
  6. Exit

> 1

Select calculator:
  1. Linear Equation
  2. Quadratic Equation
  3. Geometry
  ...
```

### Direct Commands

```bash
# Solve linear equation: 2x + 3 = 7
$ math-cli linear-eq --a 2 --b 3 --c 7

# Solve quadratic equation: x² - 5x + 6 = 0
$ math-cli quadratic --a 1 --b -5 --c 6

# Generate practice problems
$ math-cli practice --topic linear_equation --difficulty medium --count 5

# View progress
$ math-cli progress --topic all

# Export data
$ math-cli export --format json --output my-progress.json
```

## Commands

### Calculators

- `linear-eq` - Solve linear equations
- `quadratic` - Solve quadratic equations
- `geometry` - Geometric calculations
- `statistics` - Statistical analysis
- `probability` - Probability calculations
- `factorize` - Factorization
- And 11 more...

### Learning Features

- `practice` - Generate practice problems
- `progress` - View learning progress
- `mistakes` - Review mistake notes
- `history` - View calculation history

### Utilities

- `export` - Export data to JSON/CSV
- `config` - Manage configuration
- `version` - Show version information

## Configuration

Configuration file: `~/.math_helper/config.yaml`

```yaml
theme: dark
language: ko
auto_save: true
show_steps: true
precision: 10
```

## Dependencies

- `clap` - Command-line argument parsing
- `dialoguer` - Interactive prompts
- `indicatif` - Progress bars
- `colored` - Terminal colors
- `math-core` - Core calculations
- `math-features` - Learning features

## Development

```bash
# Run in development mode
cargo run

# Run with arguments
cargo run -- quadratic --a 1 --b -5 --c 6

# Run tests
cargo test

# Build release binary
cargo build --release
```

## Examples

See `examples/` directory for more usage examples.

## License

MIT OR Apache-2.0
