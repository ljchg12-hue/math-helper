//! Geometry module for geometric calculations
//!
//! Provides structures and functions for working with geometric shapes
//! including points, circles, triangles, and various geometric calculations.

use serde::{Deserialize, Serialize};
use thiserror::Error;

/// EPSILON constant for floating point comparison
const EPSILON: f64 = 1e-10;

/// A point in 2D space
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

impl Point {
    /// Creates a new point
    pub fn new(x: f64, y: f64) -> Self {
        Self { x, y }
    }

    /// Calculates the Euclidean distance to another point
    pub fn distance_to(&self, other: &Point) -> f64 {
        let dx = self.x - other.x;
        let dy = self.y - other.y;
        (dx * dx + dy * dy).sqrt()
    }

    /// Calculates the midpoint between this point and another
    pub fn midpoint(&self, other: &Point) -> Point {
        Point {
            x: (self.x + other.x) / 2.0,
            y: (self.y + other.y) / 2.0,
        }
    }
}

/// A circle defined by center point and radius
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Circle {
    pub center: Point,
    pub radius: f64,
}

impl Circle {
    /// Creates a new circle with validation
    pub fn new(center: Point, radius: f64) -> Result<Self, GeometryError> {
        validate_positive(radius, "radius")?;
        Ok(Self { center, radius })
    }

    /// Calculates the area of the circle
    pub fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }

    /// Calculates the circumference of the circle
    pub fn circumference(&self) -> f64 {
        2.0 * std::f64::consts::PI * self.radius
    }
}

/// A triangle defined by three points
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Triangle {
    pub p1: Point,
    pub p2: Point,
    pub p3: Point,
}

impl Triangle {
    /// Creates a new triangle
    pub fn new(p1: Point, p2: Point, p3: Point) -> Result<Self, GeometryError> {
        // Check if points are collinear
        let area = ((p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y)).abs();
        if area < EPSILON {
            return Err(GeometryError::CollinearPoints);
        }
        Ok(Self { p1, p2, p3 })
    }

    /// Calculates the area using Heron's formula
    pub fn area(&self) -> f64 {
        let a = self.p1.distance_to(&self.p2);
        let b = self.p2.distance_to(&self.p3);
        let c = self.p3.distance_to(&self.p1);

        let s = (a + b + c) / 2.0;
        (s * (s - a) * (s - b) * (s - c)).sqrt()
    }

    /// Calculates the perimeter
    pub fn perimeter(&self) -> f64 {
        self.p1.distance_to(&self.p2)
            + self.p2.distance_to(&self.p3)
            + self.p3.distance_to(&self.p1)
    }
}

/// Result of a geometry calculation with steps
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GeometryResult {
    /// The calculated result
    pub result: f64,
    /// Formula used
    pub formula: String,
    /// Step-by-step calculation
    pub steps: Vec<String>,
}

/// Errors that can occur in geometry calculations
#[derive(Debug, Error)]
pub enum GeometryError {
    /// Invalid input (NaN or Infinity)
    #[error("Invalid input: {0}")]
    InvalidInput(String),

    /// Negative or zero value where positive is required
    #[error("Invalid {0}: must be positive")]
    InvalidValue(String),

    /// Points are collinear (cannot form a triangle)
    #[error("Points are collinear and cannot form a triangle")]
    CollinearPoints,
}

/// Validates that a value is neither NaN nor Infinity
fn validate_float(value: f64, name: &str) -> Result<(), GeometryError> {
    if value.is_nan() {
        return Err(GeometryError::InvalidInput(format!("{} is NaN", name)));
    }
    if value.is_infinite() {
        return Err(GeometryError::InvalidInput(format!("{} is infinite", name)));
    }
    Ok(())
}

/// Validates that a value is positive and not NaN/Infinity
fn validate_positive(value: f64, name: &str) -> Result<(), GeometryError> {
    validate_float(value, name)?;
    if value <= 0.0 {
        return Err(GeometryError::InvalidValue(name.to_string()));
    }
    Ok(())
}

/// Validates multiple values
fn validate_values(values: &[(f64, &str)]) -> Result<(), GeometryError> {
    for &(value, name) in values {
        validate_float(value, name)?;
    }
    Ok(())
}

/// Calculates using the Pythagorean theorem: a² + b² = c²
///
/// Given two sides, calculates the third side.
/// - If c is unknown: c = √(a² + b²)
/// - If a is unknown: a = √(c² - b²)
/// - If b is unknown: b = √(c² - a²)
pub fn pythagorean_theorem(
    a: f64,
    b: f64,
    c: f64,
) -> Result<GeometryResult, GeometryError> {
    validate_values(&[(a, "a"), (b, "b"), (c, "c")])?;

    let mut steps = Vec::new();
    let result: f64;
    let formula: String;

    // Determine which side to calculate based on which is zero
    if c.abs() < EPSILON {
        // Calculate c: c = √(a² + b²)
        result = (a * a + b * b).sqrt();
        formula = "c = √(a² + b²)".to_string();
        steps.push(format!("피타고라스 정리: a² + b² = c²"));
        steps.push(format!("주어진 값: a = {}, b = {}", a, b));
        steps.push(format!("c² = {}² + {}² = {}", a, b, a * a + b * b));
        steps.push(format!("c = √{} = {}", a * a + b * b, result));
    } else if a.abs() < EPSILON {
        // Calculate a: a = √(c² - b²)
        if c * c < b * b {
            return Err(GeometryError::InvalidValue(
                "c must be greater than b".to_string(),
            ));
        }
        result = (c * c - b * b).sqrt();
        formula = "a = √(c² - b²)".to_string();
        steps.push(format!("피타고라스 정리: a² + b² = c²"));
        steps.push(format!("주어진 값: b = {}, c = {}", b, c));
        steps.push(format!("a² = {}² - {}² = {}", c, b, c * c - b * b));
        steps.push(format!("a = √{} = {}", c * c - b * b, result));
    } else {
        // Calculate b: b = √(c² - a²)
        if c * c < a * a {
            return Err(GeometryError::InvalidValue(
                "c must be greater than a".to_string(),
            ));
        }
        result = (c * c - a * a).sqrt();
        formula = "b = √(c² - a²)".to_string();
        steps.push(format!("피타고라스 정리: a² + b² = c²"));
        steps.push(format!("주어진 값: a = {}, c = {}", a, c));
        steps.push(format!("b² = {}² - {}² = {}", c, a, c * c - a * a));
        steps.push(format!("b = √{} = {}", c * c - a * a, result));
    }

    Ok(GeometryResult {
        result,
        formula,
        steps,
    })
}

/// Calculates the area of a triangle given base and height
pub fn triangle_area(base: f64, height: f64) -> Result<GeometryResult, GeometryError> {
    validate_positive(base, "base")?;
    validate_positive(height, "height")?;

    let result = 0.5 * base * height;
    let formula = "면적 = (밑변 × 높이) / 2".to_string();

    let steps = vec![
        format!("삼각형 넓이 공식: (밑변 × 높이) / 2"),
        format!("주어진 값: 밑변 = {}, 높이 = {}", base, height),
        format!("면적 = ({} × {}) / 2 = {}", base, height, result),
    ];

    Ok(GeometryResult {
        result,
        formula,
        steps,
    })
}

/// Calculates the area of a circle given radius
pub fn circle_area(radius: f64) -> Result<GeometryResult, GeometryError> {
    validate_positive(radius, "radius")?;

    let result = std::f64::consts::PI * radius * radius;
    let formula = "면적 = πr²".to_string();

    let steps = vec![
        format!("원의 넓이 공식: πr²"),
        format!("주어진 값: 반지름 = {}", radius),
        format!("면적 = π × {}² = {}", radius, result),
    ];

    Ok(GeometryResult {
        result,
        formula,
        steps,
    })
}

/// Calculates the area of a trapezoid
pub fn trapezoid_area(
    upper_base: f64,
    lower_base: f64,
    height: f64,
) -> Result<GeometryResult, GeometryError> {
    validate_positive(upper_base, "upper_base")?;
    validate_positive(lower_base, "lower_base")?;
    validate_positive(height, "height")?;

    let result = 0.5 * (upper_base + lower_base) * height;
    let formula = "면적 = (윗변 + 아랫변) × 높이 / 2".to_string();

    let steps = vec![
        format!("사다리꼴 넓이 공식: (윗변 + 아랫변) × 높이 / 2"),
        format!(
            "주어진 값: 윗변 = {}, 아랫변 = {}, 높이 = {}",
            upper_base, lower_base, height
        ),
        format!(
            "면적 = ({} + {}) × {} / 2 = {}",
            upper_base, lower_base, height, result
        ),
    ];

    Ok(GeometryResult {
        result,
        formula,
        steps,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_point_distance() {
        let p1 = Point::new(0.0, 0.0);
        let p2 = Point::new(3.0, 4.0);
        assert!((p1.distance_to(&p2) - 5.0).abs() < EPSILON);
    }

    #[test]
    fn test_point_midpoint() {
        let p1 = Point::new(0.0, 0.0);
        let p2 = Point::new(4.0, 6.0);
        let mid = p1.midpoint(&p2);
        assert!((mid.x - 2.0).abs() < EPSILON);
        assert!((mid.y - 3.0).abs() < EPSILON);
    }

    #[test]
    fn test_circle_area() {
        let circle = Circle::new(Point::new(0.0, 0.0), 1.0).unwrap();
        assert!((circle.area() - std::f64::consts::PI).abs() < EPSILON);
    }

    #[test]
    fn test_circle_circumference() {
        let circle = Circle::new(Point::new(0.0, 0.0), 1.0).unwrap();
        assert!((circle.circumference() - 2.0 * std::f64::consts::PI).abs() < EPSILON);
    }

    #[test]
    fn test_circle_invalid_radius() {
        let result = Circle::new(Point::new(0.0, 0.0), -1.0);
        assert!(matches!(result, Err(GeometryError::InvalidValue(_))));
    }

    #[test]
    fn test_triangle_area() {
        let p1 = Point::new(0.0, 0.0);
        let p2 = Point::new(4.0, 0.0);
        let p3 = Point::new(0.0, 3.0);
        let triangle = Triangle::new(p1, p2, p3).unwrap();
        assert!((triangle.area() - 6.0).abs() < EPSILON);
    }

    #[test]
    fn test_triangle_perimeter() {
        let p1 = Point::new(0.0, 0.0);
        let p2 = Point::new(3.0, 0.0);
        let p3 = Point::new(0.0, 4.0);
        let triangle = Triangle::new(p1, p2, p3).unwrap();
        assert!((triangle.perimeter() - 12.0).abs() < EPSILON);
    }

    #[test]
    fn test_triangle_collinear() {
        let p1 = Point::new(0.0, 0.0);
        let p2 = Point::new(1.0, 1.0);
        let p3 = Point::new(2.0, 2.0);
        let result = Triangle::new(p1, p2, p3);
        assert!(matches!(result, Err(GeometryError::CollinearPoints)));
    }

    #[test]
    fn test_pythagorean_theorem_c() {
        // 3-4-5 triangle
        let result = pythagorean_theorem(3.0, 4.0, 0.0).unwrap();
        assert!((result.result - 5.0).abs() < EPSILON);
    }

    #[test]
    fn test_pythagorean_theorem_a() {
        // 3-4-5 triangle, find a
        let result = pythagorean_theorem(0.0, 4.0, 5.0).unwrap();
        assert!((result.result - 3.0).abs() < EPSILON);
    }

    #[test]
    fn test_triangle_area_function() {
        let result = triangle_area(4.0, 3.0).unwrap();
        assert!((result.result - 6.0).abs() < EPSILON);
        assert!(result.steps.len() > 0);
    }

    #[test]
    fn test_circle_area_function() {
        let result = circle_area(2.0).unwrap();
        assert!((result.result - 4.0 * std::f64::consts::PI).abs() < EPSILON);
    }

    #[test]
    fn test_trapezoid_area_function() {
        let result = trapezoid_area(3.0, 5.0, 4.0).unwrap();
        assert!((result.result - 16.0).abs() < EPSILON);
    }

    #[test]
    fn test_invalid_input_nan() {
        let result = triangle_area(f64::NAN, 3.0);
        assert!(matches!(result, Err(GeometryError::InvalidInput(_))));
    }

    #[test]
    fn test_invalid_input_negative() {
        let result = circle_area(-1.0);
        assert!(matches!(result, Err(GeometryError::InvalidValue(_))));
    }
}
