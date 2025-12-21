//! Complex number operations

use crate::errors::*;
use num_complex::Complex64;
use std::f64::consts::PI;

#[derive(Debug, Clone)]
pub struct ComplexResult {
    pub real: f64,
    pub imag: f64,
    pub magnitude: f64,
    pub argument_rad: f64,
    pub argument_deg: f64,
    pub polar_form: String,
}

impl From<Complex64> for ComplexResult {
    fn from(c: Complex64) -> Self {
        let arg_rad = c.arg();
        let arg_deg = arg_rad * 180.0 / PI;

        Self {
            real: c.re,
            imag: c.im,
            magnitude: c.norm(),
            argument_rad: arg_rad,
            argument_deg: arg_deg,
            polar_form: format!("{}∠{}°", c.norm(), arg_deg),
        }
    }
}

/// Add two complex numbers
///
/// # Examples
/// ```
/// use num_complex::Complex64;
/// use math_core::complex_number::complex_add;
///
/// let a = Complex64::new(1.0, 2.0);
/// let b = Complex64::new(3.0, 4.0);
/// let result = complex_add(a, b);
/// assert_eq!(result.real, 4.0);
/// assert_eq!(result.imag, 6.0);
/// ```
pub fn complex_add(a: Complex64, b: Complex64) -> ComplexResult {
    (a + b).into()
}

/// Subtract two complex numbers
pub fn complex_subtract(a: Complex64, b: Complex64) -> ComplexResult {
    (a - b).into()
}

/// Multiply two complex numbers
///
/// # Examples
/// ```
/// use num_complex::Complex64;
/// use math_core::complex_number::complex_multiply;
///
/// let a = Complex64::new(1.0, 2.0);
/// let b = Complex64::new(3.0, 4.0);
/// let result = complex_multiply(a, b);
/// // (1+2i)(3+4i) = 3 + 4i + 6i + 8i² = 3 + 10i - 8 = -5 + 10i
/// ```
pub fn complex_multiply(a: Complex64, b: Complex64) -> ComplexResult {
    (a * b).into()
}

/// Divide two complex numbers
pub fn complex_divide(a: Complex64, b: Complex64) -> Result<ComplexResult> {
    if b.norm() < f64::EPSILON {
        return Err(MathError::DivisionByZero);
    }

    Ok((a / b).into())
}

/// Calculate complex conjugate
///
/// # Examples
/// ```
/// use num_complex::Complex64;
/// use math_core::complex_number::complex_conjugate;
///
/// let c = Complex64::new(3.0, 4.0);
/// let result = complex_conjugate(c);
/// assert_eq!(result.real, 3.0);
/// assert_eq!(result.imag, -4.0);
/// ```
pub fn complex_conjugate(c: Complex64) -> ComplexResult {
    c.conj().into()
}

/// Calculate magnitude (modulus) of complex number
pub fn complex_magnitude(c: Complex64) -> f64 {
    c.norm()
}

/// Calculate argument (phase angle) in degrees
pub fn complex_argument_deg(c: Complex64) -> f64 {
    c.arg() * 180.0 / PI
}

/// Create complex number from polar form
pub fn from_polar(r: f64, theta_deg: f64) -> ComplexResult {
    let theta_rad = theta_deg * PI / 180.0;
    Complex64::from_polar(r, theta_rad).into()
}

/// Raise complex number to power
pub fn complex_power(c: Complex64, n: i32) -> ComplexResult {
    c.powi(n).into()
}

/// Calculate exponential of complex number
pub fn complex_exp(c: Complex64) -> ComplexResult {
    c.exp().into()
}

/// Calculate natural logarithm of complex number
pub fn complex_ln(c: Complex64) -> Result<ComplexResult> {
    if c.norm() < f64::EPSILON {
        return Err(MathError::InvalidInput("ln(0)은 정의되지 않습니다".to_string()));
    }

    Ok(c.ln().into())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::EPSILON;

    #[test]
    fn test_complex_add() {
        let a = Complex64::new(1.0, 2.0);
        let b = Complex64::new(3.0, 4.0);
        let result = complex_add(a, b);
        assert!((result.real - 4.0).abs() < EPSILON);
        assert!((result.imag - 6.0).abs() < EPSILON);
    }

    #[test]
    fn test_complex_multiply() {
        let a = Complex64::new(1.0, 2.0);
        let b = Complex64::new(3.0, 4.0);
        let result = complex_multiply(a, b);
        // (1+2i)(3+4i) = -5 + 10i
        assert!((result.real - (-5.0)).abs() < EPSILON);
        assert!((result.imag - 10.0).abs() < EPSILON);
    }

    #[test]
    fn test_complex_conjugate() {
        let c = Complex64::new(3.0, 4.0);
        let result = complex_conjugate(c);
        assert!((result.real - 3.0).abs() < EPSILON);
        assert!((result.imag - (-4.0)).abs() < EPSILON);
    }

    #[test]
    fn test_complex_magnitude() {
        let c = Complex64::new(3.0, 4.0);
        let mag = complex_magnitude(c);
        assert!((mag - 5.0).abs() < EPSILON);
    }

    #[test]
    fn test_from_polar() {
        let result = from_polar(5.0, 0.0);
        assert!((result.real - 5.0).abs() < EPSILON);
        assert!(result.imag.abs() < EPSILON);
    }

    #[test]
    fn test_complex_power() {
        let c = Complex64::new(1.0, 1.0);
        let result = complex_power(c, 2);
        // (1+i)² = 1 + 2i + i² = 2i
        assert!(result.real.abs() < EPSILON);
        assert!((result.imag - 2.0).abs() < EPSILON);
    }

    #[test]
    fn test_complex_divide() {
        let a = Complex64::new(1.0, 0.0);
        let b = Complex64::new(1.0, 1.0);
        let result = complex_divide(a, b).unwrap();
        // 1 / (1+i) = (1-i) / 2
        assert!((result.real - 0.5).abs() < EPSILON);
        assert!((result.imag - (-0.5)).abs() < EPSILON);
    }
}
