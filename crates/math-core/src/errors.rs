//! Error types for math-core library

use thiserror::Error;

#[derive(Error, Debug)]
pub enum MathError {
    #[error("Invalid input: {0}")]
    InvalidInput(String),

    #[error("Division by zero")]
    DivisionByZero,

    #[error("Value out of range: {0}")]
    OutOfRange(String),

    #[error("NaN detected in {0}")]
    NaN(String),

    #[error("Infinity detected in {0}")]
    Infinity(String),

    #[error("No solution exists")]
    NoSolution,

    #[error("Matrix dimension mismatch: expected {expected}, got {actual}")]
    DimensionMismatch { expected: String, actual: String },

    #[error("Not a square matrix")]
    NotSquare,

    #[error("Singular matrix (determinant is zero)")]
    SingularMatrix,

    #[error("Invalid range: {0}")]
    InvalidRange(String),

    #[error("Parse error: {0}")]
    ParseError(String),
}

pub type Result<T> = std::result::Result<T, MathError>;
