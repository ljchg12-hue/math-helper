//! Sequence operations (arithmetic, geometric, fibonacci)

use crate::{errors::*, validation::*};

#[derive(Debug, Clone)]
pub struct SequenceResult {
    pub terms: Vec<f64>,
    pub sum: f64,
    pub sequence_type: String,
    pub formula: String,
}

/// Generate arithmetic sequence: a, a+d, a+2d, ...
///
/// # Examples
/// ```
/// use math_core::sequence::arithmetic_sequence;
///
/// let result = arithmetic_sequence(1.0, 2.0, 5).unwrap();
/// assert_eq!(result.terms, vec![1.0, 3.0, 5.0, 7.0, 9.0]);
/// assert_eq!(result.sum, 25.0);
/// ```
pub fn arithmetic_sequence(
    first_term: f64,
    common_diff: f64,
    n_terms: usize,
) -> Result<SequenceResult> {
    validate_numbers(&[first_term, common_diff], &["first_term", "common_diff"])?;

    if n_terms == 0 {
        return Err(MathError::InvalidInput("항 개수는 1 이상이어야 합니다".to_string()));
    }

    let terms: Vec<f64> = (0..n_terms)
        .map(|i| first_term + common_diff * i as f64)
        .collect();

    let sum = n_terms as f64 * (2.0 * first_term + (n_terms - 1) as f64 * common_diff) / 2.0;

    Ok(SequenceResult {
        terms,
        sum,
        sequence_type: "arithmetic".to_string(),
        formula: format!("a_n = {} + {}n", first_term, common_diff),
    })
}

/// Generate geometric sequence: a, ar, ar², ...
///
/// # Examples
/// ```
/// use math_core::sequence::geometric_sequence;
///
/// let result = geometric_sequence(2.0, 3.0, 4).unwrap();
/// assert_eq!(result.terms, vec![2.0, 6.0, 18.0, 54.0]);
/// ```
pub fn geometric_sequence(
    first_term: f64,
    common_ratio: f64,
    n_terms: usize,
) -> Result<SequenceResult> {
    validate_numbers(&[first_term, common_ratio], &["first_term", "common_ratio"])?;

    if n_terms == 0 {
        return Err(MathError::InvalidInput("항 개수는 1 이상이어야 합니다".to_string()));
    }

    let terms: Vec<f64> = (0..n_terms)
        .map(|i| first_term * common_ratio.powi(i as i32))
        .collect();

    let sum = if (common_ratio - 1.0).abs() < f64::EPSILON {
        first_term * n_terms as f64
    } else {
        first_term * (1.0 - common_ratio.powi(n_terms as i32)) / (1.0 - common_ratio)
    };

    Ok(SequenceResult {
        terms,
        sum,
        sequence_type: "geometric".to_string(),
        formula: format!("a_n = {} × {}^n", first_term, common_ratio),
    })
}

/// Generate Fibonacci sequence
///
/// # Examples
/// ```
/// use math_core::sequence::fibonacci_sequence;
///
/// let result = fibonacci_sequence(7).unwrap();
/// assert_eq!(result.terms, vec![0.0, 1.0, 1.0, 2.0, 3.0, 5.0, 8.0]);
/// ```
pub fn fibonacci_sequence(n_terms: usize) -> Result<SequenceResult> {
    if n_terms == 0 {
        return Err(MathError::InvalidInput("항 개수는 1 이상이어야 합니다".to_string()));
    }

    let mut terms = vec![0.0, 1.0];

    for i in 2..n_terms {
        let next = terms[i - 1] + terms[i - 2];
        terms.push(next);
    }

    terms.truncate(n_terms);
    let sum = terms.iter().sum();

    Ok(SequenceResult {
        terms,
        sum,
        sequence_type: "fibonacci".to_string(),
        formula: "F(n) = F(n-1) + F(n-2)".to_string(),
    })
}

/// Calculate nth term of arithmetic sequence
pub fn arithmetic_nth_term(first_term: f64, common_diff: f64, n: usize) -> Result<f64> {
    validate_numbers(&[first_term, common_diff], &["first_term", "common_diff"])?;

    if n == 0 {
        return Err(MathError::InvalidInput("n은 1 이상이어야 합니다".to_string()));
    }

    Ok(first_term + common_diff * (n - 1) as f64)
}

/// Calculate nth term of geometric sequence
pub fn geometric_nth_term(first_term: f64, common_ratio: f64, n: usize) -> Result<f64> {
    validate_numbers(&[first_term, common_ratio], &["first_term", "common_ratio"])?;

    if n == 0 {
        return Err(MathError::InvalidInput("n은 1 이상이어야 합니다".to_string()));
    }

    Ok(first_term * common_ratio.powi((n - 1) as i32))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::EPSILON;

    #[test]
    fn test_arithmetic() {
        let result = arithmetic_sequence(1.0, 2.0, 5).unwrap();
        assert_eq!(result.terms, vec![1.0, 3.0, 5.0, 7.0, 9.0]);
        assert!((result.sum - 25.0).abs() < EPSILON);
    }

    #[test]
    fn test_geometric() {
        let result = geometric_sequence(2.0, 3.0, 4).unwrap();
        assert_eq!(result.terms, vec![2.0, 6.0, 18.0, 54.0]);
    }

    #[test]
    fn test_fibonacci() {
        let result = fibonacci_sequence(7).unwrap();
        assert_eq!(result.terms, vec![0.0, 1.0, 1.0, 2.0, 3.0, 5.0, 8.0]);
    }

    #[test]
    fn test_arithmetic_nth() {
        let nth = arithmetic_nth_term(1.0, 2.0, 5).unwrap();
        assert!((nth - 9.0).abs() < EPSILON);
    }

    #[test]
    fn test_geometric_nth() {
        let nth = geometric_nth_term(2.0, 3.0, 4).unwrap();
        assert!((nth - 54.0).abs() < EPSILON);
    }

    #[test]
    fn test_invalid_n_terms() {
        assert!(arithmetic_sequence(1.0, 2.0, 0).is_err());
        assert!(geometric_sequence(1.0, 2.0, 0).is_err());
        assert!(fibonacci_sequence(0).is_err());
    }
}
