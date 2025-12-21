//! Linear inequality solver

use crate::{errors::*, validation::*, EPSILON};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum InequalitySolution {
    Range {
        lower: Option<f64>,
        upper: Option<f64>,
        lower_inclusive: bool,
        upper_inclusive: bool,
    },
    NoSolution,
    AllReals,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum InequalityOp {
    Less,        // <
    LessEq,      // <=
    Greater,     // >
    GreaterEq,   // >=
}

impl InequalityOp {
    pub fn from_str(s: &str) -> Result<Self> {
        match s {
            "<" => Ok(InequalityOp::Less),
            "<=" => Ok(InequalityOp::LessEq),
            ">" => Ok(InequalityOp::Greater),
            ">=" => Ok(InequalityOp::GreaterEq),
            _ => Err(MathError::ParseError(format!("Invalid operator: {}", s))),
        }
    }

    pub fn is_strict(&self) -> bool {
        matches!(self, InequalityOp::Less | InequalityOp::Greater)
    }
}

/// Solve linear inequality ax + b [op] 0
///
/// # Examples
/// ```
/// use math_core::inequality::{solve_linear_inequality, InequalityOp};
///
/// let solution = solve_linear_inequality(2.0, -4.0, InequalityOp::Greater).unwrap();
/// // 2x - 4 > 0 => x > 2
/// ```
pub fn solve_linear_inequality(
    a: f64,
    b: f64,
    operator: InequalityOp
) -> Result<InequalitySolution> {
    // Validate inputs
    validate_numbers(&[a, b], &["a", "b"])?;

    // Case 1: a = 0
    if a.abs() < EPSILON {
        return if b < 0.0 {
            Ok(InequalitySolution::AllReals)
        } else {
            Ok(InequalitySolution::NoSolution)
        };
    }

    // Case 2: a ≠ 0
    // ax + b [op] 0
    // x [op] -b/a

    let boundary = -b / a;

    let solution = match (operator, a > 0.0) {
        (InequalityOp::Less, true) | (InequalityOp::Greater, false) => {
            // x < boundary (strict)
            InequalitySolution::Range {
                lower: None,
                upper: Some(boundary),
                lower_inclusive: false,
                upper_inclusive: false,
            }
        }
        (InequalityOp::LessEq, true) | (InequalityOp::GreaterEq, false) => {
            // x ≤ boundary
            InequalitySolution::Range {
                lower: None,
                upper: Some(boundary),
                lower_inclusive: false,
                upper_inclusive: true,
            }
        }
        (InequalityOp::Greater, true) | (InequalityOp::Less, false) => {
            // x > boundary (strict)
            InequalitySolution::Range {
                lower: Some(boundary),
                upper: None,
                lower_inclusive: false,
                upper_inclusive: false,
            }
        }
        (InequalityOp::GreaterEq, true) | (InequalityOp::LessEq, false) => {
            // x ≥ boundary
            InequalitySolution::Range {
                lower: Some(boundary),
                upper: None,
                lower_inclusive: true,
                upper_inclusive: false,
            }
        }
    };

    Ok(solution)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greater_than() {
        // 2x - 4 > 0 => x > 2
        let sol = solve_linear_inequality(2.0, -4.0, InequalityOp::Greater).unwrap();

        match sol {
            InequalitySolution::Range { lower, upper, lower_inclusive, .. } => {
                assert_eq!(lower, Some(2.0));
                assert_eq!(upper, None);
                assert!(!lower_inclusive);
            }
            _ => panic!("Expected range solution"),
        }
    }

    #[test]
    fn test_less_than_or_equal() {
        // -x + 3 <= 0 => x >= 3
        let sol = solve_linear_inequality(-1.0, 3.0, InequalityOp::LessEq).unwrap();

        match sol {
            InequalitySolution::Range { lower, upper, lower_inclusive, .. } => {
                assert_eq!(lower, Some(3.0));
                assert_eq!(upper, None);
                assert!(lower_inclusive);
            }
            _ => panic!("Expected range solution"),
        }
    }

    #[test]
    fn test_always_true() {
        // 0x - 1 < 0 => always true
        let sol = solve_linear_inequality(0.0, -1.0, InequalityOp::Less).unwrap();
        assert_eq!(sol, InequalitySolution::AllReals);
    }

    #[test]
    fn test_never_true() {
        // 0x + 1 < 0 => never true
        let sol = solve_linear_inequality(0.0, 1.0, InequalityOp::Less).unwrap();
        assert_eq!(sol, InequalitySolution::NoSolution);
    }
}
