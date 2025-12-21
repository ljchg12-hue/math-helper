//! Trigonometric functions

use crate::{errors::*, validation::*};
use std::f64::consts::PI;

#[derive(Debug, Clone)]
pub struct TrigResult {
    pub result: f64,
    pub angle_deg: f64,
    pub angle_rad: f64,
    pub function: String,
}

/// Convert degrees to radians
pub fn deg_to_rad(degrees: f64) -> f64 {
    degrees * PI / 180.0
}

/// Convert radians to degrees
pub fn rad_to_deg(radians: f64) -> f64 {
    radians * 180.0 / PI
}

/// Calculate sine (degrees)
///
/// # Examples
/// ```
/// use math_core::trigonometry::sin_deg;
///
/// let result = sin_deg(90.0).unwrap();
/// assert!((result.result - 1.0).abs() < 1e-10);
/// ```
pub fn sin_deg(degrees: f64) -> Result<TrigResult> {
    validate_number(degrees, "degrees")?;

    let radians = deg_to_rad(degrees);
    let result = radians.sin();

    Ok(TrigResult {
        result,
        angle_deg: degrees,
        angle_rad: radians,
        function: "sin".to_string(),
    })
}

/// Calculate cosine (degrees)
///
/// # Examples
/// ```
/// use math_core::trigonometry::cos_deg;
///
/// let result = cos_deg(0.0).unwrap();
/// assert!((result.result - 1.0).abs() < 1e-10);
/// ```
pub fn cos_deg(degrees: f64) -> Result<TrigResult> {
    validate_number(degrees, "degrees")?;

    let radians = deg_to_rad(degrees);
    let result = radians.cos();

    Ok(TrigResult {
        result,
        angle_deg: degrees,
        angle_rad: radians,
        function: "cos".to_string(),
    })
}

/// Calculate tangent (degrees)
pub fn tan_deg(degrees: f64) -> Result<TrigResult> {
    validate_number(degrees, "degrees")?;

    let radians = deg_to_rad(degrees);
    let result = radians.tan();

    Ok(TrigResult {
        result,
        angle_deg: degrees,
        angle_rad: radians,
        function: "tan".to_string(),
    })
}

/// Calculate arcsine (returns degrees)
///
/// # Examples
/// ```
/// use math_core::trigonometry::asin_deg;
///
/// let result = asin_deg(1.0).unwrap();
/// assert!((result.result - 90.0).abs() < 1e-10);
/// ```
pub fn asin_deg(value: f64) -> Result<TrigResult> {
    validate_number(value, "value")?;

    if value < -1.0 || value > 1.0 {
        return Err(MathError::InvalidRange(
            "arcsin은 [-1, 1] 범위만 가능".to_string()
        ));
    }

    let radians = value.asin();
    let degrees = rad_to_deg(radians);

    Ok(TrigResult {
        result: degrees,
        angle_deg: degrees,
        angle_rad: radians,
        function: "arcsin".to_string(),
    })
}

/// Calculate arccosine (returns degrees)
pub fn acos_deg(value: f64) -> Result<TrigResult> {
    validate_number(value, "value")?;

    if value < -1.0 || value > 1.0 {
        return Err(MathError::InvalidRange(
            "arccos은 [-1, 1] 범위만 가능".to_string()
        ));
    }

    let radians = value.acos();
    let degrees = rad_to_deg(radians);

    Ok(TrigResult {
        result: degrees,
        angle_deg: degrees,
        angle_rad: radians,
        function: "arccos".to_string(),
    })
}

/// Calculate arctangent (returns degrees)
pub fn atan_deg(value: f64) -> Result<TrigResult> {
    validate_number(value, "value")?;

    let radians = value.atan();
    let degrees = rad_to_deg(radians);

    Ok(TrigResult {
        result: degrees,
        angle_deg: degrees,
        angle_rad: radians,
        function: "arctan".to_string(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::EPSILON;

    #[test]
    fn test_sin_0() {
        let result = sin_deg(0.0).unwrap();
        assert!(result.result.abs() < EPSILON);
    }

    #[test]
    fn test_sin_90() {
        let result = sin_deg(90.0).unwrap();
        assert!((result.result - 1.0).abs() < EPSILON);
    }

    #[test]
    fn test_cos_0() {
        let result = cos_deg(0.0).unwrap();
        assert!((result.result - 1.0).abs() < EPSILON);
    }

    #[test]
    fn test_cos_90() {
        let result = cos_deg(90.0).unwrap();
        assert!(result.result.abs() < EPSILON);
    }

    #[test]
    fn test_tan_45() {
        let result = tan_deg(45.0).unwrap();
        assert!((result.result - 1.0).abs() < EPSILON);
    }

    #[test]
    fn test_asin() {
        let result = asin_deg(1.0).unwrap();
        assert!((result.result - 90.0).abs() < EPSILON);
    }

    #[test]
    fn test_acos() {
        let result = acos_deg(1.0).unwrap();
        assert!(result.result.abs() < EPSILON);
    }

    #[test]
    fn test_deg_rad_conversion() {
        let rad = deg_to_rad(180.0);
        assert!((rad - PI).abs() < EPSILON);

        let deg = rad_to_deg(PI);
        assert!((deg - 180.0).abs() < EPSILON);
    }
}
