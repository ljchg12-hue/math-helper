//! # Math Core Library
//!
//! A comprehensive mathematics library for middle school mathematics education.
//!
//! ## Modules
//!
//! ### Phase 1 (Basic Calculators)
//! - `linear_equation`: Linear equation solver (ax + b = c)
//! - `quadratic_equation`: Quadratic equation solver with multiple methods
//! - `geometry`: Geometric calculations (Pythagorean theorem, areas)
//! - `statistics`: Statistical analysis (mean, median, mode, variance)
//! - `factorization`: Polynomial factorization
//! - `prime`: Prime number operations and factorization
//!
//! ### Phase 2 (Advanced Calculators)
//! - `simultaneous_equations`: System of linear equations solver
//! - `polynomial`: Polynomial arithmetic and operations
//! - `inequality`: Linear inequality solver
//! - `probability`: Combinatorics and probability
//! - `matrix`: Matrix operations (using ndarray)
//! - `exponent`: Exponent and logarithm operations
//! - `trigonometry`: Trigonometric functions
//! - `sequence`: Arithmetic and geometric sequences
//! - `vector`: Vector operations
//! - `complex_number`: Complex number arithmetic
//! - `calculus`: Basic calculus operations

pub mod errors;
pub mod validation;

// Phase 1 modules
pub mod linear_equation;
pub mod quadratic_equation;
pub mod geometry;
pub mod statistics;
pub mod factorization;
pub mod prime;

// Phase 2 modules
pub mod simultaneous_equations;
pub mod polynomial;
pub mod inequality;
pub mod probability;
pub mod matrix;

// Common constants
pub const EPSILON: f64 = 1e-10;

/// Version information
pub const VERSION: &str = env!("CARGO_PKG_VERSION");
