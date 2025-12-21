//! Polynomial arithmetic operations

use num::traits::{One, Zero};
use num_rational::Rational64;
use std::ops::{Add, Mul};

#[derive(Debug, Clone, PartialEq)]
pub struct Polynomial {
    /// Coefficients [a0, a1, a2, ...] representing a0 + a1·x + a2·x² + ...
    coeffs: Vec<Rational64>,
}

impl Polynomial {
    /// Create polynomial from integer coefficients
    pub fn new(coeffs: Vec<i64>) -> Self {
        let rational_coeffs = coeffs
            .into_iter()
            .map(Rational64::from_integer)
            .collect();
        Self { coeffs: rational_coeffs }
    }

    /// Get degree of polynomial
    pub fn degree(&self) -> usize {
        self.coeffs.len().saturating_sub(1)
    }

    /// Evaluate polynomial at x
    pub fn evaluate(&self, x: f64) -> f64 {
        self.coeffs
            .iter()
            .enumerate()
            .map(|(i, c)| {
                let coeff = *c.numer() as f64 / *c.denom() as f64;
                coeff * x.powi(i as i32)
            })
            .sum()
    }

    /// Get coefficient at degree i
    pub fn coeff(&self, i: usize) -> Rational64 {
        self.coeffs.get(i).copied().unwrap_or(Rational64::zero())
    }
}

impl Add for Polynomial {
    type Output = Self;

    fn add(self, other: Self) -> Self {
        let max_len = self.coeffs.len().max(other.coeffs.len());
        let mut result = vec![Rational64::zero(); max_len];

        for (i, &c) in self.coeffs.iter().enumerate() {
            result[i] = result[i] + c;
        }
        for (i, &c) in other.coeffs.iter().enumerate() {
            result[i] = result[i] + c;
        }

        Self { coeffs: result }
    }
}

impl Mul for Polynomial {
    type Output = Self;

    fn mul(self, other: Self) -> Self {
        if self.coeffs.is_empty() || other.coeffs.is_empty() {
            return Self { coeffs: vec![] };
        }

        let result_len = self.coeffs.len() + other.coeffs.len() - 1;
        let mut result = vec![Rational64::zero(); result_len];

        for (i, &a) in self.coeffs.iter().enumerate() {
            for (j, &b) in other.coeffs.iter().enumerate() {
                result[i + j] = result[i + j] + a * b;
            }
        }

        Self { coeffs: result }
    }
}

impl std::fmt::Display for Polynomial {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        let terms: Vec<String> = self.coeffs
            .iter()
            .enumerate()
            .filter(|(_, &c)| !c.is_zero())
            .rev()
            .map(|(i, c)| {
                let coeff_str = if i == 0 || !c.is_one() {
                    c.to_string()
                } else {
                    String::new()
                };

                match i {
                    0 => coeff_str,
                    1 => format!("{}x", coeff_str),
                    _ => format!("{}x^{}", coeff_str, i),
                }
            })
            .collect();

        if terms.is_empty() {
            write!(f, "0")
        } else {
            write!(f, "{}", terms.join(" + "))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_polynomial_creation() {
        let p = Polynomial::new(vec![1, 2, 3]); // 1 + 2x + 3x²
        assert_eq!(p.degree(), 2);
        assert_eq!(p.coeff(0), Rational64::from_integer(1));
        assert_eq!(p.coeff(1), Rational64::from_integer(2));
        assert_eq!(p.coeff(2), Rational64::from_integer(3));
    }

    #[test]
    fn test_polynomial_evaluate() {
        let p = Polynomial::new(vec![1, 2, 3]); // 1 + 2x + 3x²
        // At x=2: 1 + 2(2) + 3(4) = 1 + 4 + 12 = 17
        assert_eq!(p.evaluate(2.0), 17.0);
    }

    #[test]
    fn test_polynomial_add() {
        let p1 = Polynomial::new(vec![1, 2, 3]); // 1 + 2x + 3x²
        let p2 = Polynomial::new(vec![4, 5]); // 4 + 5x
        let result = p1 + p2; // 5 + 7x + 3x²

        assert_eq!(result.coeff(0), Rational64::from_integer(5));
        assert_eq!(result.coeff(1), Rational64::from_integer(7));
        assert_eq!(result.coeff(2), Rational64::from_integer(3));
    }

    #[test]
    fn test_polynomial_mul() {
        let p1 = Polynomial::new(vec![1, 1]); // 1 + x
        let p2 = Polynomial::new(vec![1, 1]); // 1 + x
        let result = p1 * p2; // (1 + x)² = 1 + 2x + x²

        assert_eq!(result.coeff(0), Rational64::from_integer(1));
        assert_eq!(result.coeff(1), Rational64::from_integer(2));
        assert_eq!(result.coeff(2), Rational64::from_integer(1));
    }
}
