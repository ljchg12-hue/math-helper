//! Combinatorics and probability calculations

use crate::{errors::*, validation::*};

/// Calculate factorial of n
///
/// # Examples
/// ```
/// use math_core::probability::factorial;
///
/// assert_eq!(factorial(5), 120);
/// assert_eq!(factorial(0), 1);
/// ```
pub fn factorial(n: u64) -> u64 {
    if n == 0 || n == 1 {
        return 1;
    }
    (2..=n).product()
}

/// Calculate permutation P(n, r) = n! / (n-r)!
///
/// # Examples
/// ```
/// use math_core::probability::permutation;
///
/// let result = permutation(5, 3).unwrap();
/// // P(5,3) = 5 × 4 × 3 = 60
/// assert_eq!(result, 60);
/// ```
pub fn permutation(n: u64, r: u64) -> Result<u64> {
    if r > n {
        return Err(MathError::InvalidRange(
            format!("r ({}) cannot be greater than n ({})", r, n)
        ));
    }

    if r == 0 {
        return Ok(1);
    }

    // P(n,r) = n × (n-1) × ... × (n-r+1)
    Ok((n - r + 1..=n).product())
}

/// Calculate combination C(n, r) = n! / (r! × (n-r)!)
///
/// # Examples
/// ```
/// use math_core::probability::combination;
///
/// let result = combination(5, 3).unwrap();
/// // C(5,3) = 10
/// assert_eq!(result, 10);
/// ```
pub fn combination(n: u64, r: u64) -> Result<u64> {
    if r > n {
        return Err(MathError::InvalidRange(
            format!("r ({}) cannot be greater than n ({})", r, n)
        ));
    }

    // Optimization: C(n,r) = C(n, n-r), use smaller value
    let r = r.min(n - r);

    if r == 0 {
        return Ok(1);
    }

    // C(n,r) = P(n,r) / r!
    let perm = permutation(n, r)?;
    let fact_r = factorial(r);

    Ok(perm / fact_r)
}

/// Calculate probability of an event: favorable / total
pub fn probability_event(favorable: u64, total: u64) -> Result<f64> {
    if total == 0 {
        return Err(MathError::DivisionByZero);
    }

    if favorable > total {
        return Err(MathError::InvalidRange(
            format!("Favorable outcomes ({}) cannot exceed total ({})", favorable, total)
        ));
    }

    Ok(favorable as f64 / total as f64)
}

/// Calculate probability of two independent events both occurring: P(A and B) = P(A) × P(B)
pub fn probability_and_independent(p1: f64, p2: f64) -> Result<f64> {
    validate_range(p1, "p1", 0.0, 1.0)?;
    validate_range(p2, "p2", 0.0, 1.0)?;

    Ok(p1 * p2)
}

/// Calculate probability of at least one of two events occurring: P(A or B) = P(A) + P(B) - P(A and B)
pub fn probability_or(p1: f64, p2: f64, p_and: f64) -> Result<f64> {
    validate_range(p1, "p1", 0.0, 1.0)?;
    validate_range(p2, "p2", 0.0, 1.0)?;
    validate_range(p_and, "p_and", 0.0, 1.0)?;

    let result = p1 + p2 - p_and;

    if result > 1.0 {
        return Err(MathError::InvalidInput(
            "Probability cannot exceed 1.0".to_string()
        ));
    }

    Ok(result)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::EPSILON;

    #[test]
    fn test_factorial() {
        assert_eq!(factorial(0), 1);
        assert_eq!(factorial(1), 1);
        assert_eq!(factorial(5), 120);
        assert_eq!(factorial(10), 3628800);
    }

    #[test]
    fn test_permutation() {
        assert_eq!(permutation(5, 0).unwrap(), 1);
        assert_eq!(permutation(5, 1).unwrap(), 5);
        assert_eq!(permutation(5, 3).unwrap(), 60);
        assert_eq!(permutation(5, 5).unwrap(), 120);
    }

    #[test]
    fn test_permutation_invalid() {
        assert!(permutation(3, 5).is_err());
    }

    #[test]
    fn test_combination() {
        assert_eq!(combination(5, 0).unwrap(), 1);
        assert_eq!(combination(5, 1).unwrap(), 5);
        assert_eq!(combination(5, 2).unwrap(), 10);
        assert_eq!(combination(5, 3).unwrap(), 10);
        assert_eq!(combination(5, 5).unwrap(), 1);
    }

    #[test]
    fn test_combination_invalid() {
        assert!(combination(3, 5).is_err());
    }

    #[test]
    fn test_probability_event() {
        let p = probability_event(3, 10).unwrap();
        assert!((p - 0.3).abs() < EPSILON);
    }

    #[test]
    fn test_probability_and_independent() {
        let p = probability_and_independent(0.5, 0.4).unwrap();
        assert!((p - 0.2).abs() < EPSILON);
    }

    #[test]
    fn test_probability_or() {
        let p = probability_or(0.5, 0.4, 0.2).unwrap();
        assert!((p - 0.7).abs() < EPSILON);
    }
}
