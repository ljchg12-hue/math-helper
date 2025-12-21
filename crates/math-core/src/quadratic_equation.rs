//! Quadratic equation solver (ax² + bx + c = 0)

use crate::{errors::*, validation::*, EPSILON};
use num::complex::Complex64;

#[derive(Debug, Clone)]
pub enum QuadraticSolution {
    TwoReal { x1: f64, x2: f64 },
    OneReal { x: f64 },
    TwoComplex { x1: Complex64, x2: Complex64 },
}

#[derive(Debug, Clone)]
pub struct QuadraticEquationSolution {
    pub solution: QuadraticSolution,
    pub discriminant: f64,
    pub steps: Vec<String>,
}

/// Solve quadratic equation ax² + bx + c = 0
///
/// # Examples
/// ```
/// use math_core::quadratic_equation::solve_quadratic_equation;
///
/// let solution = solve_quadratic_equation(1.0, -3.0, 2.0).unwrap();
/// // x² - 3x + 2 = 0 => x = 1 or x = 2
/// ```
pub fn solve_quadratic_equation(a: f64, b: f64, c: f64) -> Result<QuadraticEquationSolution> {
    // Validate inputs
    validate_numbers(&[a, b, c], &["a", "b", "c"])?;

    if a.abs() < EPSILON {
        return Err(MathError::InvalidInput(
            "계수 a는 0이 아니어야 합니다 (이차방정식이 아님)".to_string()
        ));
    }

    let mut steps = Vec::new();
    steps.push(format!("방정식: {}x² + {}x + {} = 0", a, b, c));

    // Calculate discriminant: D = b² - 4ac
    let discriminant = b * b - 4.0 * a * c;
    steps.push(format!(
        "판별식: D = b² - 4ac = {}² - 4×{}×{} = {}",
        b, a, c, discriminant
    ));

    let solution = if discriminant > EPSILON {
        // Two distinct real roots
        let sqrt_d = discriminant.sqrt();
        let x1 = (-b + sqrt_d) / (2.0 * a);
        let x2 = (-b - sqrt_d) / (2.0 * a);

        steps.push(format!("D > 0이므로 서로 다른 두 실근이 존재합니다."));
        steps.push(format!("x = (-b ± √D) / (2a)"));
        steps.push(format!("x₁ = (-{} + √{}) / (2×{}) = {}", b, discriminant, a, x1));
        steps.push(format!("x₂ = (-{} - √{}) / (2×{}) = {}", b, discriminant, a, x2));

        QuadraticSolution::TwoReal { x1, x2 }
    } else if discriminant.abs() < EPSILON {
        // One repeated real root
        let x = -b / (2.0 * a);

        steps.push(format!("D = 0이므로 중근이 존재합니다."));
        steps.push(format!("x = -b / (2a) = -{} / (2×{}) = {}", b, a, x));

        QuadraticSolution::OneReal { x }
    } else {
        // Two complex conjugate roots
        let real_part = -b / (2.0 * a);
        let imag_part = (-discriminant).sqrt() / (2.0 * a);

        let x1 = Complex64::new(real_part, imag_part);
        let x2 = Complex64::new(real_part, -imag_part);

        steps.push(format!("D < 0이므로 두 허근이 존재합니다."));
        steps.push(format!("x = (-b ± i√|D|) / (2a)"));
        steps.push(format!("x₁ = {} + {}i", real_part, imag_part));
        steps.push(format!("x₂ = {} - {}i", real_part, imag_part));

        QuadraticSolution::TwoComplex { x1, x2 }
    };

    Ok(QuadraticEquationSolution {
        solution,
        discriminant,
        steps,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_two_real_roots() {
        let sol = solve_quadratic_equation(1.0, -3.0, 2.0).unwrap();
        match sol.solution {
            QuadraticSolution::TwoReal { x1, x2 } => {
                assert!((x1 - 2.0).abs() < EPSILON || (x1 - 1.0).abs() < EPSILON);
                assert!((x2 - 2.0).abs() < EPSILON || (x2 - 1.0).abs() < EPSILON);
            }
            _ => panic!("Expected two real roots"),
        }
    }

    #[test]
    fn test_one_real_root() {
        let sol = solve_quadratic_equation(1.0, -2.0, 1.0).unwrap();
        match sol.solution {
            QuadraticSolution::OneReal { x } => assert!((x - 1.0).abs() < EPSILON),
            _ => panic!("Expected one real root"),
        }
    }

    #[test]
    fn test_complex_roots() {
        let sol = solve_quadratic_equation(1.0, 0.0, 1.0).unwrap();
        match sol.solution {
            QuadraticSolution::TwoComplex { x1, x2 } => {
                assert!((x1.re - 0.0).abs() < EPSILON);
                assert!((x1.im - 1.0).abs() < EPSILON);
                assert!((x2.re - 0.0).abs() < EPSILON);
                assert!((x2.im - (-1.0)).abs() < EPSILON);
            }
            _ => panic!("Expected complex roots"),
        }
    }
}
