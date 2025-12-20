# math-core

Core mathematics calculation library for Math Helper.

## Overview

This crate provides 17 calculator modules implementing various mathematical operations for middle school mathematics education:

### Calculators

1. **Algebraic Expressions** - Term parsing, simplification, polynomial operations
2. **Coordinate Plane** - Distance, midpoint, slope calculations
3. **Factorization** - Quadratic factorization, common factors, difference of squares
4. **Function Graphs** - Linear, quadratic, proportional function plotting
5. **Geometry** - Pythagorean theorem, area and perimeter calculations
6. **Linear Equations** - Solving ax + b = c equations
7. **Linear Functions** - Slope, intercept, parallel/perpendicular detection
8. **Linear Inequalities** - Inequality solving with sign preservation
9. **Prime Factorization** - Prime factor decomposition, GCD, LCM
10. **Probability** - Permutations, combinations, basic probability
11. **Quadratic Equations** - Solving using formula, factoring, completing square
12. **Quadratic Functions** - Vertex form, roots, discriminant
13. **Rational Numbers** - Fraction operations with auto-reduction
14. **Simultaneous Equations** - Elimination and substitution methods
15. **Square Roots** - Simplification, rationalization, radical operations
16. **Statistics** - Mean, median, mode, variance, standard deviation
17. **Coordinate Geometry** - Points, distances, slopes on coordinate plane

## Features

- **Type-safe** - Leverages Rust's type system for correctness
- **Step-by-step solutions** - Educational focus with detailed calculation steps
- **Input validation** - NaN, infinity, and type checking
- **High precision** - Epsilon-based floating point comparisons
- **Serializable** - All result types implement `serde::Serialize`

## Dependencies

- `num` family - Numerical operations (complex, rational, big integers)
- `approx` - Floating point comparisons
- `ndarray` - Array operations (numpy equivalent)
- `statrs` - Statistical functions
- `primes` - Prime number operations
- `thiserror` - Error handling
- `serde` - Serialization

## Usage Example

```rust
use math_core::calculators::quadratic::QuadraticEquationSolver;

let solver = QuadraticEquationSolver;
let solution = solver.solve(1.0, -5.0, 6.0)?;

match solution {
    QuadraticSolution::TwoReal { x1, x2, steps } => {
        println!("x₁ = {}, x₂ = {}", x1, x2);
        for step in steps {
            println!("{}", step);
        }
    }
    _ => {}
}
```

## Testing

```bash
cargo test
cargo test --release
```

## Benchmarking

```bash
cargo bench
```

## Module Structure

```
src/
├── lib.rs
├── calculators/
│   ├── mod.rs
│   ├── algebra.rs
│   ├── equations.rs
│   ├── geometry.rs
│   ├── functions.rs
│   ├── statistics.rs
│   └── ...
├── validation.rs
├── types.rs
└── error.rs
```

## License

MIT OR Apache-2.0
