//! Quadratic equation solver module
//!
//! Solves equations of the form: ax² + bx + c = 0
//! where a, b, and c are coefficients and x is the unknown variable.

use serde::{Deserialize, Serialize};
use thiserror::Error;

/// EPSILON constant for floating point comparison
const EPSILON: f64 = 1e-10;

/// Solution variants for quadratic equations
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum QuadraticSolution {
    /// No real roots (discriminant < 0)
    NoRealRoots {
        discriminant: f64,
    },
    /// One real root - repeated root (discriminant = 0)
    OneRoot {
        root: f64,
    },
    /// Two distinct real roots (discriminant > 0)
    TwoRoots {
        root1: f64,
        root2: f64,
    },
}

/// Result of solving a quadratic equation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuadraticEquationResult {
    /// The solution (no roots, one root, or two roots)
    pub solution: QuadraticSolution,
    /// Discriminant value (b² - 4ac)
    pub discriminant: f64,
    /// Step-by-step solution process
    pub steps: Vec<String>,
    /// Formatted equation string
    pub equation: String,
}

/// Errors that can occur when solving quadratic equations
#[derive(Debug, Error)]
pub enum QuadraticEquationError {
    /// Invalid input (NaN or Infinity)
    #[error("Invalid input: {0}")]
    InvalidInput(String),

    /// The coefficient 'a' is zero, making the equation not quadratic
    #[error("Not a quadratic equation: coefficient 'a' cannot be zero")]
    NotQuadratic,
}

/// Validates that floating point values are neither NaN nor Infinity
fn validate_inputs(values: &[f64]) -> Result<(), QuadraticEquationError> {
    for (i, &value) in values.iter().enumerate() {
        if value.is_nan() {
            let param = match i {
                0 => "a",
                1 => "b",
                2 => "c",
                _ => "parameter",
            };
            return Err(QuadraticEquationError::InvalidInput(
                format!("{} is NaN", param)
            ));
        }
        if value.is_infinite() {
            let param = match i {
                0 => "a",
                1 => "b",
                2 => "c",
                _ => "parameter",
            };
            return Err(QuadraticEquationError::InvalidInput(
                format!("{} is infinite", param)
            ));
        }
    }
    Ok(())
}

/// Formats the equation as a string
fn format_equation(a: f64, b: f64, c: f64) -> String {
    let b_term = if b >= 0.0 {
        format!(" + {}x", b)
    } else {
        format!(" - {}x", b.abs())
    };

    let c_term = if c >= 0.0 {
        format!(" + {}", c)
    } else {
        format!(" - {}", c.abs())
    };

    format!("{}x²{}{} = 0", a, b_term, c_term)
}

/// Solves a quadratic equation of the form ax² + bx + c = 0
///
/// # Arguments
///
/// * `a` - Coefficient of x² (must be non-zero)
/// * `b` - Coefficient of x
/// * `c` - Constant term
///
/// # Returns
///
/// * `Ok(QuadraticEquationResult)` - The solution with discriminant and steps
/// * `Err(QuadraticEquationError)` - If inputs are invalid or a is zero
///
/// # Algorithm
///
/// Uses the discriminant method:
/// 1. Calculate discriminant: D = b² - 4ac
/// 2. Determine solution type based on D:
///    - D < 0: No real roots
///    - D = 0: One repeated root (x = -b / 2a)
///    - D > 0: Two distinct roots (x = (-b ± √D) / 2a)
///
/// # Examples
///
/// ```
/// use math_core::quadratic_equation::{solve_quadratic_equation, QuadraticSolution};
///
/// // Solve: x² - 5x + 6 = 0  (roots: 3 and 2)
/// let result = solve_quadratic_equation(1.0, -5.0, 6.0).unwrap();
/// match result.solution {
///     QuadraticSolution::TwoRoots { root1, root2 } => {
///         assert!((root1 - 3.0).abs() < 1e-10);
///         assert!((root2 - 2.0).abs() < 1e-10);
///     }
///     _ => panic!("Expected two roots"),
/// }
/// ```
pub fn solve_quadratic_equation(
    a: f64,
    b: f64,
    c: f64,
) -> Result<QuadraticEquationResult, QuadraticEquationError> {
    // Validate inputs
    validate_inputs(&[a, b, c])?;

    // Check if it's actually a quadratic equation
    if a.abs() < EPSILON {
        return Err(QuadraticEquationError::NotQuadratic);
    }

    // Calculate discriminant
    let discriminant = b * b - 4.0 * a * c;

    // Generate equation string
    let equation = format_equation(a, b, c);

    // Initialize steps
    let mut steps = Vec::new();
    steps.push(format!("주어진 방정식: {}", equation));
    steps.push(format!(
        "판별식 D = b² - 4ac = {}² - 4({})({}) = {}",
        b, a, c, discriminant
    ));

    // Determine solution based on discriminant
    let solution = if discriminant < -EPSILON {
        // No real roots
        steps.push("D < 0: 실근이 없습니다".to_string());
        QuadraticSolution::NoRealRoots { discriminant }
    } else if discriminant.abs() < EPSILON {
        // One repeated root
        let root = -b / (2.0 * a);
        steps.push(format!("D = 0: 중근 x = -b/2a = -({})/(2 × {}) = {}", b, a, root));
        QuadraticSolution::OneRoot { root }
    } else {
        // Two distinct roots
        let sqrt_d = discriminant.sqrt();
        let two_a = 2.0 * a;
        let root1 = (-b + sqrt_d) / two_a;
        let root2 = (-b - sqrt_d) / two_a;

        steps.push(format!("D > 0: 서로 다른 두 실근이 존재합니다"));
        steps.push(format!(
            "x = (-b ± √D) / 2a = -({}) ± √{} / {}",
            b, discriminant, two_a
        ));
        steps.push(format!("x₁ = (-b + √D) / 2a = {}", root1));
        steps.push(format!("x₂ = (-b - √D) / 2a = {}", root2));

        QuadraticSolution::TwoRoots { root1, root2 }
    };

    Ok(QuadraticEquationResult {
        solution,
        discriminant,
        steps,
        equation,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_two_roots() {
        // Test: x² - 5x + 6 = 0 → x₁ = 3, x₂ = 2
        let result = solve_quadratic_equation(1.0, -5.0, 6.0).unwrap();
        assert!((result.discriminant - 1.0).abs() < EPSILON);

        match result.solution {
            QuadraticSolution::TwoRoots { root1, root2 } => {
                assert!((root1 - 3.0).abs() < EPSILON);
                assert!((root2 - 2.0).abs() < EPSILON);
            }
            _ => panic!("Expected two roots"),
        }
    }

    #[test]
    fn test_one_root() {
        // Test: x² - 4x + 4 = 0 → x = 2 (중근)
        let result = solve_quadratic_equation(1.0, -4.0, 4.0).unwrap();
        assert!(result.discriminant.abs() < EPSILON);

        match result.solution {
            QuadraticSolution::OneRoot { root } => {
                assert!((root - 2.0).abs() < EPSILON);
            }
            _ => panic!("Expected one root"),
        }
    }

    #[test]
    fn test_no_real_roots() {
        // Test: x² + x + 1 = 0 → 실근 없음 (D = -3)
        let result = solve_quadratic_equation(1.0, 1.0, 1.0).unwrap();
        assert!((result.discriminant - (-3.0)).abs() < EPSILON);

        match result.solution {
            QuadraticSolution::NoRealRoots { .. } => {
                // Expected
            }
            _ => panic!("Expected no real roots"),
        }
    }

    #[test]
    fn test_not_quadratic() {
        // Test: 0x² + 2x + 1 = 0 should fail
        let result = solve_quadratic_equation(0.0, 2.0, 1.0);
        assert!(matches!(result, Err(QuadraticEquationError::NotQuadratic)));
    }

    #[test]
    fn test_invalid_input_nan() {
        // Test: NaN coefficient should fail
        let result = solve_quadratic_equation(f64::NAN, 1.0, 1.0);
        assert!(matches!(result, Err(QuadraticEquationError::InvalidInput(_))));
    }

    #[test]
    fn test_invalid_input_infinity() {
        // Test: Infinity coefficient should fail
        let result = solve_quadratic_equation(1.0, f64::INFINITY, 1.0);
        assert!(matches!(result, Err(QuadraticEquationError::InvalidInput(_))));
    }

    #[test]
    fn test_negative_coefficients() {
        // Test: -2x² + 8x - 6 = 0 → x₁ = 3, x₂ = 1
        let result = solve_quadratic_equation(-2.0, 8.0, -6.0).unwrap();

        match result.solution {
            QuadraticSolution::TwoRoots { root1, root2 } => {
                // Note: roots might be in different order
                let mut roots = vec![root1, root2];
                roots.sort_by(|a, b| a.partial_cmp(b).unwrap());
                assert!((roots[0] - 1.0).abs() < EPSILON);
                assert!((roots[1] - 3.0).abs() < EPSILON);
            }
            _ => panic!("Expected two roots"),
        }
    }

    #[test]
    fn test_zero_constant() {
        // Test: x² - 4x = 0 → x₁ = 4, x₂ = 0
        let result = solve_quadratic_equation(1.0, -4.0, 0.0).unwrap();

        match result.solution {
            QuadraticSolution::TwoRoots { root1, root2 } => {
                let mut roots = vec![root1, root2];
                roots.sort_by(|a, b| a.partial_cmp(b).unwrap());
                assert!(roots[0].abs() < EPSILON);
                assert!((roots[1] - 4.0).abs() < EPSILON);
            }
            _ => panic!("Expected two roots"),
        }
    }

    #[test]
    fn test_equation_formatting() {
        let result = solve_quadratic_equation(1.0, -5.0, 6.0).unwrap();
        assert_eq!(result.equation, "1x² - 5x + 6 = 0");
    }

    #[test]
    fn test_steps_generated() {
        let result = solve_quadratic_equation(1.0, -5.0, 6.0).unwrap();
        assert!(!result.steps.is_empty());
        assert!(result.steps[0].contains("주어진 방정식"));
        assert!(result.steps[1].contains("판별식"));
    }
}
