//! Input validation utilities

use crate::errors::{MathError, Result};

/// Validate that a single value is a valid finite number
pub fn validate_number(value: f64, name: &str) -> Result<f64> {
    if value.is_nan() {
        return Err(MathError::NaN(name.to_string()));
    }
    if value.is_infinite() {
        return Err(MathError::Infinity(name.to_string()));
    }
    Ok(value)
}

/// Validate multiple numbers at once
pub fn validate_numbers(values: &[f64], names: &[&str]) -> Result<Vec<f64>> {
    if values.len() != names.len() {
        return Err(MathError::InvalidInput(
            "Number of values and names must match".to_string()
        ));
    }

    values.iter()
        .zip(names.iter())
        .map(|(&v, &n)| validate_number(v, n))
        .collect()
}

/// Validate that a value is positive
pub fn validate_positive(value: f64, name: &str) -> Result<f64> {
    validate_number(value, name)?;
    if value <= 0.0 {
        return Err(MathError::InvalidInput(
            format!("{} must be positive", name)
        ));
    }
    Ok(value)
}

/// Validate that a value is non-negative
pub fn validate_non_negative(value: f64, name: &str) -> Result<f64> {
    validate_number(value, name)?;
    if value < 0.0 {
        return Err(MathError::InvalidInput(
            format!("{} must be non-negative", name)
        ));
    }
    Ok(value)
}

/// Validate that a value is within a range
pub fn validate_range(value: f64, name: &str, min: f64, max: f64) -> Result<f64> {
    validate_number(value, name)?;
    if value < min || value > max {
        return Err(MathError::OutOfRange(
            format!("{} must be between {} and {}, got {}", name, min, max, value)
        ));
    }
    Ok(value)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_number() {
        assert!(validate_number(1.0, "test").is_ok());
        assert!(validate_number(f64::NAN, "test").is_err());
        assert!(validate_number(f64::INFINITY, "test").is_err());
        assert!(validate_number(f64::NEG_INFINITY, "test").is_err());
    }

    #[test]
    fn test_validate_positive() {
        assert!(validate_positive(1.0, "test").is_ok());
        assert!(validate_positive(0.0, "test").is_err());
        assert!(validate_positive(-1.0, "test").is_err());
    }

    #[test]
    fn test_validate_non_negative() {
        assert!(validate_non_negative(1.0, "test").is_ok());
        assert!(validate_non_negative(0.0, "test").is_ok());
        assert!(validate_non_negative(-1.0, "test").is_err());
    }

    #[test]
    fn test_validate_range() {
        assert!(validate_range(5.0, "test", 0.0, 10.0).is_ok());
        assert!(validate_range(-1.0, "test", 0.0, 10.0).is_err());
        assert!(validate_range(11.0, "test", 0.0, 10.0).is_err());
    }
}
