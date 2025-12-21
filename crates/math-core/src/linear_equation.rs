//! Linear equation solver (ax + b = c)

use crate::{errors::*, validation::*, EPSILON};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum SolutionType {
    Unique(f64),
    Infinite,
    None,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LinearEquationSolution {
    pub solution_type: SolutionType,
    pub steps: Vec<String>,
}

/// Solve linear equation ax + b = c
///
/// # Examples
/// ```
/// use math_core::linear_equation::solve_linear_equation;
///
/// let solution = solve_linear_equation(2.0, 3.0, 7.0).unwrap();
/// // 2x + 3 = 7 => x = 2
/// ```
pub fn solve_linear_equation(a: f64, b: f64, c: f64) -> Result<LinearEquationSolution> {
    // Validate inputs
    validate_numbers(&[a, b, c], &["a", "b", "c"])?;

    let mut steps = Vec::new();
    steps.push(format!("방정식: {}x + {} = {}", a, b, c));

    // Case 1: a = 0
    if a.abs() < EPSILON {
        if (b - c).abs() < EPSILON {
            steps.push("0x + b = c이고 b = c이므로 해가 무수히 많습니다.".to_string());
            return Ok(LinearEquationSolution {
                solution_type: SolutionType::Infinite,
                steps,
            });
        } else {
            steps.push("0x + b = c이고 b ≠ c이므로 해가 없습니다.".to_string());
            return Ok(LinearEquationSolution {
                solution_type: SolutionType::None,
                steps,
            });
        }
    }

    // Case 2: a ≠ 0
    steps.push(format!("{}x = {} - {}", a, c, b));
    let rhs = c - b;
    steps.push(format!("{}x = {}", a, rhs));

    let x = rhs / a;
    steps.push(format!("x = {} / {}", rhs, a));
    steps.push(format!("x = {}", x));

    Ok(LinearEquationSolution {
        solution_type: SolutionType::Unique(x),
        steps,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_unique_solution() {
        let sol = solve_linear_equation(2.0, 3.0, 7.0).unwrap();
        match sol.solution_type {
            SolutionType::Unique(x) => assert!((x - 2.0).abs() < EPSILON),
            _ => panic!("Expected unique solution"),
        }
    }

    #[test]
    fn test_infinite_solutions() {
        let sol = solve_linear_equation(0.0, 5.0, 5.0).unwrap();
        assert_eq!(sol.solution_type, SolutionType::Infinite);
    }

    #[test]
    fn test_no_solution() {
        let sol = solve_linear_equation(0.0, 3.0, 5.0).unwrap();
        assert_eq!(sol.solution_type, SolutionType::None);
    }

    #[test]
    fn test_negative_coefficient() {
        let sol = solve_linear_equation(-2.0, 4.0, -2.0).unwrap();
        match sol.solution_type {
            SolutionType::Unique(x) => assert!((x - 3.0).abs() < EPSILON),
            _ => panic!("Expected unique solution"),
        }
    }
}
