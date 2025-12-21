//! Exponent and logarithm operations

use crate::{errors::*, validation::*};
use std::f64::consts::{E, LN_10};

#[derive(Debug, Clone)]
pub struct ExponentResult {
    pub result: f64,
    pub steps: Vec<String>,
    pub operation: String,
}

/// Calculate power: base^exponent
///
/// # Examples
/// ```
/// use math_core::exponent::power;
///
/// let result = power(2.0, 3.0).unwrap();
/// assert!((result.result - 8.0).abs() < 1e-10);
/// ```
pub fn power(base: f64, exponent: f64) -> Result<ExponentResult> {
    validate_numbers(&[base, exponent], &["base", "exponent"])?;

    let result = base.powf(exponent);

    let steps = vec![
        format!("{}^{} 계산", base, exponent),
        format!("결과: {}", result),
    ];

    Ok(ExponentResult {
        result,
        steps,
        operation: "power".to_string(),
    })
}

/// Calculate logarithm: log_base(value)
///
/// # Examples
/// ```
/// use math_core::exponent::logarithm;
///
/// let result = logarithm(100.0, 10.0).unwrap();
/// assert!((result.result - 2.0).abs() < 1e-10);
/// ```
pub fn logarithm(value: f64, base: f64) -> Result<ExponentResult> {
    validate_numbers(&[value, base], &["value", "base"])?;

    if value <= 0.0 || base <= 0.0 || (base - 1.0).abs() < f64::EPSILON {
        return Err(MathError::InvalidInput(
            "로그는 양수이고 base ≠ 1이어야 합니다".to_string()
        ));
    }

    let result = value.ln() / base.ln();

    let steps = vec![
        format!("log_{}({}) 계산", base, value),
        format!("= ln({}) / ln({})", value, base),
        format!("= {}", result),
    ];

    Ok(ExponentResult {
        result,
        steps,
        operation: "logarithm".to_string(),
    })
}

/// Calculate natural logarithm (ln)
///
/// # Examples
/// ```
/// use math_core::exponent::natural_log;
/// use std::f64::consts::E;
///
/// let result = natural_log(E).unwrap();
/// assert!((result.result - 1.0).abs() < 1e-10);
/// ```
pub fn natural_log(value: f64) -> Result<ExponentResult> {
    validate_number(value, "value")?;

    if value <= 0.0 {
        return Err(MathError::InvalidInput("ln은 양수만 가능".to_string()));
    }

    let result = value.ln();

    Ok(ExponentResult {
        result,
        steps: vec![
            format!("ln({}) = {}", value, result),
        ],
        operation: "natural_log".to_string(),
    })
}

/// Calculate common logarithm (base 10)
///
/// # Examples
/// ```
/// use math_core::exponent::log10;
///
/// let result = log10(1000.0).unwrap();
/// assert!((result.result - 3.0).abs() < 1e-10);
/// ```
pub fn log10(value: f64) -> Result<ExponentResult> {
    logarithm(value, 10.0)
}

/// Calculate square root
pub fn sqrt(value: f64) -> Result<ExponentResult> {
    validate_non_negative(value, "value")?;

    let result = value.sqrt();

    Ok(ExponentResult {
        result,
        steps: vec![
            format!("√{} = {}", value, result),
        ],
        operation: "sqrt".to_string(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::EPSILON;

    #[test]
    fn test_power() {
        let result = power(2.0, 3.0).unwrap();
        assert!((result.result - 8.0).abs() < EPSILON);
    }

    #[test]
    fn test_power_negative_exp() {
        let result = power(2.0, -2.0).unwrap();
        assert!((result.result - 0.25).abs() < EPSILON);
    }

    #[test]
    fn test_logarithm() {
        let result = logarithm(100.0, 10.0).unwrap();
        assert!((result.result - 2.0).abs() < EPSILON);
    }

    #[test]
    fn test_natural_log() {
        let result = natural_log(E).unwrap();
        assert!((result.result - 1.0).abs() < EPSILON);
    }

    #[test]
    fn test_log10() {
        let result = log10(1000.0).unwrap();
        assert!((result.result - 3.0).abs() < EPSILON);
    }

    #[test]
    fn test_sqrt() {
        let result = sqrt(16.0).unwrap();
        assert!((result.result - 4.0).abs() < EPSILON);
    }

    #[test]
    fn test_logarithm_invalid() {
        assert!(logarithm(-1.0, 10.0).is_err());
        assert!(logarithm(10.0, 1.0).is_err());
    }
}
