//! Polynomial factorization

use crate::EPSILON;

/// Factor quadratic expression ax² + bx + c
///
/// Attempts to factor into (px + q)(rx + s) form
/// Returns Some((p, q, r, s)) if factorizable with integer coefficients, None otherwise
pub fn factor_quadratic(a: f64, b: f64, c: f64) -> Option<(i32, i32, i32, i32)> {
    // Only handle integer coefficients for simplicity
    if (a.fract().abs() > EPSILON) || (b.fract().abs() > EPSILON) || (c.fract().abs() > EPSILON) {
        return None;
    }

    let a = a as i32;
    let b = b as i32;
    let c = c as i32;

    // Find factors of a and c
    let a_factors = get_factor_pairs(a.abs());
    let c_factors = get_factor_pairs(c.abs());

    // Try all combinations
    for (p, r) in &a_factors {
        for (q, s) in &c_factors {
            // Check if (px + q)(rx + s) = ax² + bx + c
            let p = if a < 0 { -p } else { *p };
            let r = if a < 0 { -r } else { *r };
            let q = if c < 0 { -q } else { *q };
            let s = if c < 0 { -s } else { *s };

            if p * r == a && q * s == c && p * s + r * q == b {
                return Some((p, q, r, s));
            }
        }
    }

    None
}

/// Get all factor pairs of n
fn get_factor_pairs(n: i32) -> Vec<(i32, i32)> {
    let mut pairs = Vec::new();
    let n_abs = n.abs();

    for i in 1..=(n_abs as f64).sqrt() as i32 + 1 {
        if n_abs % i == 0 {
            pairs.push((i, n_abs / i));
            if i != n_abs / i {
                pairs.push((n_abs / i, i));
            }
        }
    }

    pairs
}

/// Check if expression is difference of squares: a² - b²
pub fn is_difference_of_squares(coeff_squared: f64, coeff_linear: f64, constant: f64) -> Option<(f64, f64)> {
    // Must be in form a² - b² (no linear term)
    if coeff_linear.abs() > EPSILON {
        return None;
    }

    // Both terms must be perfect squares
    if coeff_squared < 0.0 || constant > 0.0 {
        return None;
    }

    let a = coeff_squared.sqrt();
    let b = (-constant).sqrt();

    if (a.fract().abs() < EPSILON) && (b.fract().abs() < EPSILON) {
        Some((a, b))
    } else {
        None
    }
}

/// Check if expression is perfect square: (a + b)²
pub fn is_perfect_square_trinomial(a: f64, b: f64, c: f64) -> Option<(f64, f64)> {
    // Form: a²x² + 2abx + b² = (ax + b)²

    // a must be perfect square
    if a < 0.0 {
        return None;
    }
    let sqrt_a = a.sqrt();
    if sqrt_a.fract().abs() > EPSILON {
        return None;
    }

    // c must be perfect square
    if c < 0.0 {
        return None;
    }
    let sqrt_c = c.sqrt();
    if sqrt_c.fract().abs() > EPSILON {
        return None;
    }

    // Check if b = 2 * sqrt_a * sqrt_c
    let expected_b = 2.0 * sqrt_a * sqrt_c;
    if (b - expected_b).abs() < EPSILON {
        Some((sqrt_a, sqrt_c))
    } else if (b + expected_b).abs() < EPSILON {
        Some((sqrt_a, -sqrt_c))
    } else {
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_factor_quadratic_simple() {
        // x² + 5x + 6 = (x + 2)(x + 3)
        let result = factor_quadratic(1.0, 5.0, 6.0);
        assert!(result.is_some());
        let (p, q, r, s) = result.unwrap();
        assert_eq!(p * r, 1);
        assert_eq!(q * s, 6);
        assert_eq!(p * s + r * q, 5);
    }

    #[test]
    fn test_factor_quadratic_not_factorizable() {
        // x² + x + 1 (cannot be factored with integers)
        let result = factor_quadratic(1.0, 1.0, 1.0);
        assert!(result.is_none());
    }

    #[test]
    fn test_difference_of_squares() {
        // x² - 4 = (x + 2)(x - 2)
        let result = is_difference_of_squares(1.0, 0.0, -4.0);
        assert!(result.is_some());
        let (a, b) = result.unwrap();
        assert!((a - 1.0).abs() < EPSILON);
        assert!((b - 2.0).abs() < EPSILON);
    }

    #[test]
    fn test_perfect_square_trinomial() {
        // x² + 4x + 4 = (x + 2)²
        let result = is_perfect_square_trinomial(1.0, 4.0, 4.0);
        assert!(result.is_some());
        let (a, b) = result.unwrap();
        assert!((a - 1.0).abs() < EPSILON);
        assert!((b - 2.0).abs() < EPSILON);
    }
}
