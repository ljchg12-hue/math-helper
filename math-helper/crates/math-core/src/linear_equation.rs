//! Linear equation solver module
//!
//! Solves equations of the form: ax + b = 0
//! where a and b are coefficients and x is the unknown variable.

use serde::Serialize;
use thiserror::Error;

/// EPSILON constant for floating point comparison
const EPSILON: f64 = 1e-10;

/// Result of solving a linear equation
#[derive(Debug, Clone, Serialize)]
pub struct LinearEquationResult {
    /// The solution value (x)
    pub solution: f64,
    /// Step-by-step solution process
    pub steps: Vec<String>,
    /// Formatted equation string
    pub equation: String,
}

/// Errors that can occur when solving linear equations
#[derive(Debug, Error)]
pub enum LinearEquationError {
    /// The coefficient 'a' is zero, making the equation not linear
    #[error("Zero coefficient: coefficient 'a' cannot be zero")]
    ZeroCoefficient,

    /// Invalid input (NaN or Infinity)
    #[error("Invalid input: {0}")]
    InvalidInput(String),
}

/// Validates that a floating point value is neither NaN nor Infinity
fn validate_float(value: f64, name: &str) -> Result<(), LinearEquationError> {
    if value.is_nan() {
        return Err(LinearEquationError::InvalidInput(
            format!("{} is NaN", name)
        ));
    }
    if value.is_infinite() {
        return Err(LinearEquationError::InvalidInput(
            format!("{} is infinite", name)
        ));
    }
    Ok(())
}

/// Formats the equation as a string
fn format_equation(a: f64, b: f64) -> String {
    let sign = if b >= 0.0 { "+" } else { "" };
    format!("{}x {} {} = 0", a, sign, b)
}

/// Solves a linear equation of the form ax + b = 0
///
/// # Arguments
///
/// * `a` - Coefficient of x (must be non-zero)
/// * `b` - Constant term
///
/// # Returns
///
/// * `Ok(LinearEquationResult)` - The solution with steps
/// * `Err(LinearEquationError)` - If inputs are invalid or a is zero
///
/// # Examples
///
/// ```
/// use math_core::linear_equation::solve_linear_equation;
///
/// // Solve: 2x + 3 = 0
/// let result = solve_linear_equation(2.0, 3.0).unwrap();
/// assert!((result.solution - (-1.5)).abs() < 1e-10);
/// ```
pub fn solve_linear_equation(a: f64, b: f64) -> Result<LinearEquationResult, LinearEquationError> {
    // Validate inputs
    validate_float(a, "coefficient 'a'")?;
    validate_float(b, "constant 'b'")?;

    // Check for zero coefficient
    if a.abs() < EPSILON {
        return Err(LinearEquationError::ZeroCoefficient);
    }

    // Calculate solution: ax + b = 0 → x = -b/a
    let solution = -b / a;

    // Generate step-by-step solution
    let equation = format_equation(a, b);
    let mut steps = Vec::new();

    steps.push(format!("Given equation: {}", equation));
    steps.push(format!("Isolate x: {}x = {}", a, -b));
    steps.push(format!("Divide both sides by {}: x = {} / {}", a, -b, a));
    steps.push(format!("Solution: x = {}", solution));

    Ok(LinearEquationResult {
        solution,
        steps,
        equation,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic() {
        // Test: 2x + 3 = 0 → x = -1.5
        let result = solve_linear_equation(2.0, 3.0).unwrap();
        assert!((result.solution - (-1.5)).abs() < EPSILON);
        assert_eq!(result.equation, "2x + 3 = 0");
        assert_eq!(result.steps.len(), 4);
    }

    #[test]
    fn test_negative_coefficient() {
        // Test: -4x + 8 = 0 → x = 2
        let result = solve_linear_equation(-4.0, 8.0).unwrap();
        assert!((result.solution - 2.0).abs() < EPSILON);
    }

    #[test]
    fn test_negative_constant() {
        // Test: 5x - 10 = 0 → x = 2
        let result = solve_linear_equation(5.0, -10.0).unwrap();
        assert!((result.solution - 2.0).abs() < EPSILON);
    }

    #[test]
    fn test_zero_coefficient() {
        // Test: 0x + 5 = 0 should fail
        let result = solve_linear_equation(0.0, 5.0);
        assert!(matches!(result, Err(LinearEquationError::ZeroCoefficient)));
    }

    #[test]
    fn test_nan_input_a() {
        // Test: NaN coefficient should fail
        let result = solve_linear_equation(f64::NAN, 5.0);
        assert!(matches!(result, Err(LinearEquationError::InvalidInput(_))));
    }

    #[test]
    fn test_nan_input_b() {
        // Test: NaN constant should fail
        let result = solve_linear_equation(2.0, f64::NAN);
        assert!(matches!(result, Err(LinearEquationError::InvalidInput(_))));
    }

    #[test]
    fn test_infinity_input() {
        // Test: Infinity input should fail
        let result = solve_linear_equation(f64::INFINITY, 5.0);
        assert!(matches!(result, Err(LinearEquationError::InvalidInput(_))));
    }

    #[test]
    fn test_zero_solution() {
        // Test: 3x + 0 = 0 → x = 0
        let result = solve_linear_equation(3.0, 0.0).unwrap();
        assert!(result.solution.abs() < EPSILON);
    }

    #[test]
    fn test_fractional_solution() {
        // Test: 3x + 2 = 0 → x = -2/3
        let result = solve_linear_equation(3.0, 2.0).unwrap();
        let expected = -2.0 / 3.0;
        assert!((result.solution - expected).abs() < EPSILON);
    }
}
