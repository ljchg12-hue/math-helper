//! Geometric calculations

use crate::{errors::*, validation::*};
use serde::{Deserialize, Serialize};
use std::f64::consts::PI;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GeometryResult {
    pub result: f64,
    pub formula: String,
    pub steps: Vec<String>,
}

/// Calculate hypotenuse using Pythagorean theorem: c² = a² + b²
pub fn pythagorean_theorem(a: f64, b: f64) -> Result<GeometryResult> {
    validate_positive(a, "a")?;
    validate_positive(b, "b")?;

    let mut steps = Vec::new();
    steps.push(format!("피타고라스 정리: c² = a² + b²"));
    steps.push(format!("c² = {}² + {}² = {} + {} = {}", a, b, a*a, b*b, a*a + b*b));

    let c_squared = a * a + b * b;
    let c = c_squared.sqrt();

    steps.push(format!("c = √{} = {}", c_squared, c));

    Ok(GeometryResult {
        result: c,
        formula: "c = √(a² + b²)".to_string(),
        steps,
    })
}

/// Calculate triangle area: A = (base × height) / 2
pub fn triangle_area(base: f64, height: f64) -> Result<GeometryResult> {
    validate_positive(base, "base")?;
    validate_positive(height, "height")?;

    let mut steps = Vec::new();
    steps.push(format!("삼각형 넓이: A = (밑변 × 높이) / 2"));
    steps.push(format!("A = ({} × {}) / 2", base, height));

    let area = (base * height) / 2.0;
    steps.push(format!("A = {} / 2 = {}", base * height, area));

    Ok(GeometryResult {
        result: area,
        formula: "A = (base × height) / 2".to_string(),
        steps,
    })
}

/// Calculate circle area: A = πr²
pub fn circle_area(radius: f64) -> Result<GeometryResult> {
    validate_positive(radius, "radius")?;

    let mut steps = Vec::new();
    steps.push(format!("원의 넓이: A = πr²"));
    steps.push(format!("A = π × {}²", radius));

    let area = PI * radius * radius;
    steps.push(format!("A = π × {} = {}", radius * radius, area));

    Ok(GeometryResult {
        result: area,
        formula: "A = πr²".to_string(),
        steps,
    })
}

/// Calculate trapezoid area: A = ((upper + lower) × height) / 2
pub fn trapezoid_area(upper_base: f64, lower_base: f64, height: f64) -> Result<GeometryResult> {
    validate_positive(upper_base, "upper_base")?;
    validate_positive(lower_base, "lower_base")?;
    validate_positive(height, "height")?;

    let mut steps = Vec::new();
    steps.push(format!("사다리꼴 넓이: A = ((윗변 + 아랫변) × 높이) / 2"));
    steps.push(format!("A = (({} + {}) × {}) / 2", upper_base, lower_base, height));

    let area = ((upper_base + lower_base) * height) / 2.0;
    steps.push(format!("A = ({} × {}) / 2 = {}", upper_base + lower_base, height, area));

    Ok(GeometryResult {
        result: area,
        formula: "A = ((a + b) × h) / 2".to_string(),
        steps,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::EPSILON;

    #[test]
    fn test_pythagorean_theorem() {
        let result = pythagorean_theorem(3.0, 4.0).unwrap();
        assert!((result.result - 5.0).abs() < EPSILON);
    }

    #[test]
    fn test_triangle_area() {
        let result = triangle_area(6.0, 4.0).unwrap();
        assert!((result.result - 12.0).abs() < EPSILON);
    }

    #[test]
    fn test_circle_area() {
        let result = circle_area(2.0).unwrap();
        assert!((result.result - (PI * 4.0)).abs() < EPSILON);
    }

    #[test]
    fn test_trapezoid_area() {
        let result = trapezoid_area(3.0, 5.0, 4.0).unwrap();
        assert!((result.result - 16.0).abs() < EPSILON);
    }
}
