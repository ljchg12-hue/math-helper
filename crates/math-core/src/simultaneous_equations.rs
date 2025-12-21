//! System of linear equations solver (2 equations, 2 unknowns)

use crate::{errors::*, validation::*, EPSILON};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum SimultaneousSolution {
    UniqueSolution { x: f64, y: f64 },
    NoSolution,
    InfiniteSolutions,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SimultaneousResult {
    pub solution: SimultaneousSolution,
    pub steps: Vec<String>,
    pub method: String,
}

/// Solve system of linear equations using Cramer's rule
///
/// ```text
/// ax + by = c
/// dx + ey = f
/// ```
///
/// # Examples
/// ```
/// use math_core::simultaneous_equations::solve_simultaneous;
///
/// let result = solve_simultaneous(2.0, 3.0, 8.0, 1.0, -1.0, -1.0).unwrap();
/// // 2x + 3y = 8
/// // x - y = -1
/// // Solution: x = 1, y = 2
/// ```
pub fn solve_simultaneous(
    a: f64, b: f64, c: f64,
    d: f64, e: f64, f: f64
) -> Result<SimultaneousResult> {
    // Validate inputs
    validate_numbers(&[a, b, c, d, e, f], &["a", "b", "c", "d", "e", "f"])?;

    let mut steps = Vec::new();
    steps.push(format!("주어진 연립방정식:"));
    steps.push(format!("  {}x + {}y = {} ... ①", a, b, c));
    steps.push(format!("  {}x + {}y = {} ... ②", d, e, f));

    // Calculate determinant using Cramer's rule
    // D = ae - bd
    let det = a * e - b * d;

    steps.push(format!("행렬식 D = ae - bd = {} × {} - {} × {} = {}", a, e, b, d, det));

    let solution = if det.abs() < EPSILON {
        // Parallel or coincident lines
        // Check if they are the same line (infinite solutions) or parallel (no solution)

        // Calculate determinant for c column: c*e - b*f
        let det_c = c * e - b * f;

        if det_c.abs() < EPSILON {
            steps.push("D = 0이고 두 직선이 일치: 해가 무수히 많음".to_string());
            SimultaneousSolution::InfiniteSolutions
        } else {
            steps.push("D = 0이고 두 직선이 평행: 해가 없음".to_string());
            SimultaneousSolution::NoSolution
        }
    } else {
        // Unique solution using Cramer's rule
        // x = (ce - bf) / D
        // y = (af - cd) / D

        let dx = c * e - b * f;
        let dy = a * f - c * d;

        let x = dx / det;
        let y = dy / det;

        steps.push(format!("x = (ce - bf) / D = ({} × {} - {} × {}) / {} = {} / {} = {}",
                          c, e, b, f, det, dx, det, x));
        steps.push(format!("y = (af - cd) / D = ({} × {} - {} × {}) / {} = {} / {} = {}",
                          a, f, c, d, det, dy, det, y));

        SimultaneousSolution::UniqueSolution { x, y }
    };

    Ok(SimultaneousResult {
        solution,
        steps,
        method: "cramer".to_string(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_unique_solution() {
        // 2x + 3y = 8, x - y = -1
        // Solution: x = 1, y = 2
        let result = solve_simultaneous(2.0, 3.0, 8.0, 1.0, -1.0, -1.0).unwrap();

        match result.solution {
            SimultaneousSolution::UniqueSolution { x, y } => {
                assert!((x - 1.0).abs() < EPSILON);
                assert!((y - 2.0).abs() < EPSILON);
            }
            _ => panic!("Expected unique solution"),
        }
    }

    #[test]
    fn test_no_solution() {
        // x + y = 1, x + y = 2 (parallel lines)
        let result = solve_simultaneous(1.0, 1.0, 1.0, 1.0, 1.0, 2.0).unwrap();
        assert_eq!(result.solution, SimultaneousSolution::NoSolution);
    }

    #[test]
    fn test_infinite_solutions() {
        // x + y = 2, 2x + 2y = 4 (same line)
        let result = solve_simultaneous(1.0, 1.0, 2.0, 2.0, 2.0, 4.0).unwrap();
        assert_eq!(result.solution, SimultaneousSolution::InfiniteSolutions);
    }
}
