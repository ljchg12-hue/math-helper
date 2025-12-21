//! Basic calculus operations (numerical methods)

use crate::{errors::*, validation::*};

/// Numerical derivative using central difference method
///
/// # Examples
/// ```
/// use math_core::calculus::numerical_derivative;
///
/// let f = |x: f64| x * x;  // f(x) = x²
/// let deriv = numerical_derivative(f, 2.0, 0.0001);
/// // f'(x) = 2x, so f'(2) = 4
/// assert!((deriv - 4.0).abs() < 0.01);
/// ```
pub fn numerical_derivative<F>(f: F, x: f64, h: f64) -> f64
where
    F: Fn(f64) -> f64,
{
    (f(x + h) - f(x - h)) / (2.0 * h)
}

/// Numerical integration using Simpson's rule
///
/// # Examples
/// ```
/// use math_core::calculus::numerical_integral;
///
/// let f = |x: f64| x * x;  // f(x) = x²
/// let integral = numerical_integral(f, 0.0, 1.0, 1000);
/// // ∫₀¹ x² dx = 1/3
/// assert!((integral - 1.0/3.0).abs() < 0.001);
/// ```
pub fn numerical_integral<F>(f: F, a: f64, b: f64, n: usize) -> f64
where
    F: Fn(f64) -> f64,
{
    if n == 0 || (b - a).abs() < f64::EPSILON {
        return 0.0;
    }

    let h = (b - a) / n as f64;
    let mut sum = f(a) + f(b);

    for i in 1..n {
        let x = a + i as f64 * h;
        sum += if i % 2 == 0 { 2.0 * f(x) } else { 4.0 * f(x) };
    }

    sum * h / 3.0
}

/// Calculate limit of function as x approaches a value
pub fn limit<F>(f: F, x: f64, epsilon: f64) -> f64
where
    F: Fn(f64) -> f64,
{
    f(x + epsilon)
}

/// Find critical points using derivative
pub fn find_critical_points<F>(f: F, a: f64, b: f64, samples: usize) -> Vec<f64>
where
    F: Fn(f64) -> f64,
{
    let mut critical_points = Vec::new();
    let h = 0.0001;
    let step = (b - a) / samples as f64;

    for i in 0..=samples {
        let x = a + i as f64 * step;
        let deriv = numerical_derivative(&f, x, h);

        // Check if derivative is close to zero
        if deriv.abs() < 0.01 {
            critical_points.push(x);
        }
    }

    critical_points
}

/// Calculate second derivative
pub fn second_derivative<F>(f: F, x: f64, h: f64) -> f64
where
    F: Fn(f64) -> f64,
{
    (f(x + h) - 2.0 * f(x) + f(x - h)) / (h * h)
}

/// Determine if point is local maximum or minimum
#[derive(Debug, Clone, PartialEq)]
pub enum CriticalPointType {
    LocalMaximum,
    LocalMinimum,
    InflectionPoint,
}

pub fn classify_critical_point<F>(f: F, x: f64) -> CriticalPointType
where
    F: Fn(f64) -> f64,
{
    let h = 0.0001;
    let second_deriv = second_derivative(f, x, h);

    if second_deriv > 0.01 {
        CriticalPointType::LocalMinimum
    } else if second_deriv < -0.01 {
        CriticalPointType::LocalMaximum
    } else {
        CriticalPointType::InflectionPoint
    }
}

/// Trapezoidal rule for integration (simpler alternative)
pub fn trapezoidal_integral<F>(f: F, a: f64, b: f64, n: usize) -> f64
where
    F: Fn(f64) -> f64,
{
    if n == 0 || (b - a).abs() < f64::EPSILON {
        return 0.0;
    }

    let h = (b - a) / n as f64;
    let mut sum = (f(a) + f(b)) / 2.0;

    for i in 1..n {
        let x = a + i as f64 * h;
        sum += f(x);
    }

    sum * h
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::EPSILON;

    #[test]
    fn test_derivative_x_squared() {
        let f = |x: f64| x * x;
        let deriv = numerical_derivative(f, 2.0, 0.0001);
        assert!((deriv - 4.0).abs() < 0.01); // f'(x) = 2x, f'(2) = 4
    }

    #[test]
    fn test_derivative_cubic() {
        let f = |x: f64| x * x * x;
        let deriv = numerical_derivative(f, 3.0, 0.0001);
        assert!((deriv - 27.0).abs() < 0.1); // f'(x) = 3x², f'(3) = 27
    }

    #[test]
    fn test_integral_x_squared() {
        let f = |x: f64| x * x;
        let integral = numerical_integral(f, 0.0, 1.0, 1000);
        assert!((integral - 1.0/3.0).abs() < 0.001); // ∫x²dx = x³/3
    }

    #[test]
    fn test_integral_constant() {
        let f = |_x: f64| 5.0;
        let integral = numerical_integral(f, 0.0, 10.0, 100);
        assert!((integral - 50.0).abs() < 0.1); // ∫5dx from 0 to 10 = 50
    }

    #[test]
    fn test_second_derivative() {
        let f = |x: f64| x * x;
        let second = second_derivative(f, 2.0, 0.0001);
        assert!((second - 2.0).abs() < 0.1); // f''(x) = 2
    }

    #[test]
    fn test_critical_point_classification() {
        let f = |x: f64| x * x; // minimum at x=0
        let point_type = classify_critical_point(f, 0.0);
        assert_eq!(point_type, CriticalPointType::LocalMinimum);

        let g = |x: f64| -x * x; // maximum at x=0
        let point_type = classify_critical_point(g, 0.0);
        assert_eq!(point_type, CriticalPointType::LocalMaximum);
    }

    #[test]
    fn test_trapezoidal() {
        let f = |x: f64| x * x;
        let integral = trapezoidal_integral(f, 0.0, 1.0, 1000);
        assert!((integral - 1.0/3.0).abs() < 0.001);
    }
}
