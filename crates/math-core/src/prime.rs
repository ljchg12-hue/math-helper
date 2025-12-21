//! Prime number operations and factorization

use crate::errors::*;
use std::collections::HashMap;

/// Prime factorization of n
///
/// Returns a HashMap where keys are prime factors and values are their exponents
///
/// # Examples
/// ```
/// use math_core::prime::prime_factorize;
///
/// let factors = prime_factorize(12).unwrap();
/// // 12 = 2² × 3¹
/// assert_eq!(factors.get(&2), Some(&2));
/// assert_eq!(factors.get(&3), Some(&1));
/// ```
pub fn prime_factorize(mut n: u64) -> Result<HashMap<u64, u32>> {
    if n < 2 {
        return Err(MathError::InvalidInput(
            "Number must be >= 2 for factorization".to_string()
        ));
    }

    let mut factors = HashMap::new();

    // Handle factor of 2
    while n % 2 == 0 {
        *factors.entry(2).or_insert(0) += 1;
        n /= 2;
    }

    // Handle odd factors
    let mut divisor = 3;
    while divisor * divisor <= n {
        while n % divisor == 0 {
            *factors.entry(divisor).or_insert(0) += 1;
            n /= divisor;
        }
        divisor += 2;
    }

    // If n is still > 1, then it's a prime factor
    if n > 1 {
        *factors.entry(n).or_insert(0) += 1;
    }

    Ok(factors)
}

/// Check if n is prime
pub fn is_prime(n: u64) -> bool {
    if n < 2 {
        return false;
    }
    if n == 2 {
        return true;
    }
    if n % 2 == 0 {
        return false;
    }

    let mut divisor = 3;
    while divisor * divisor <= n {
        if n % divisor == 0 {
            return false;
        }
        divisor += 2;
    }

    true
}

/// Get all divisors of n
pub fn get_divisors(n: u64) -> Vec<u64> {
    if n == 0 {
        return vec![];
    }

    let mut divisors = Vec::new();
    let sqrt_n = (n as f64).sqrt() as u64;

    for i in 1..=sqrt_n {
        if n % i == 0 {
            divisors.push(i);
            if i != n / i {
                divisors.push(n / i);
            }
        }
    }

    divisors.sort_unstable();
    divisors
}

/// Calculate GCD using Euclidean algorithm
pub fn gcd(mut a: u64, mut b: u64) -> u64 {
    while b != 0 {
        let temp = b;
        b = a % b;
        a = temp;
    }
    a
}

/// Calculate LCM
pub fn lcm(a: u64, b: u64) -> u64 {
    if a == 0 || b == 0 {
        return 0;
    }
    (a / gcd(a, b)) * b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_prime_factorize() {
        let factors = prime_factorize(12).unwrap();
        assert_eq!(factors.get(&2), Some(&2)); // 2²
        assert_eq!(factors.get(&3), Some(&1)); // 3¹
    }

    #[test]
    fn test_prime_factorize_prime() {
        let factors = prime_factorize(7).unwrap();
        assert_eq!(factors.get(&7), Some(&1));
        assert_eq!(factors.len(), 1);
    }

    #[test]
    fn test_is_prime() {
        assert!(is_prime(2));
        assert!(is_prime(3));
        assert!(is_prime(17));
        assert!(!is_prime(1));
        assert!(!is_prime(4));
        assert!(!is_prime(15));
    }

    #[test]
    fn test_get_divisors() {
        let divisors = get_divisors(12);
        assert_eq!(divisors, vec![1, 2, 3, 4, 6, 12]);
    }

    #[test]
    fn test_gcd() {
        assert_eq!(gcd(12, 18), 6);
        assert_eq!(gcd(17, 19), 1);
        assert_eq!(gcd(100, 50), 50);
    }

    #[test]
    fn test_lcm() {
        assert_eq!(lcm(12, 18), 36);
        assert_eq!(lcm(5, 7), 35);
    }
}
