//! 3D Vector operations

use crate::errors::*;
use std::f64::consts::PI;

#[derive(Debug, Clone, PartialEq)]
pub struct Vector3D {
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

impl Vector3D {
    /// Create new 3D vector
    ///
    /// # Examples
    /// ```
    /// use math_core::vector::Vector3D;
    ///
    /// let v = Vector3D::new(1.0, 2.0, 3.0);
    /// assert_eq!(v.x, 1.0);
    /// ```
    pub fn new(x: f64, y: f64, z: f64) -> Self {
        Self { x, y, z }
    }

    /// Calculate magnitude (length) of vector
    ///
    /// # Examples
    /// ```
    /// use math_core::vector::Vector3D;
    ///
    /// let v = Vector3D::new(3.0, 4.0, 0.0);
    /// assert_eq!(v.magnitude(), 5.0);
    /// ```
    pub fn magnitude(&self) -> f64 {
        (self.x * self.x + self.y * self.y + self.z * self.z).sqrt()
    }

    /// Calculate dot product
    pub fn dot(&self, other: &Vector3D) -> f64 {
        self.x * other.x + self.y * other.y + self.z * other.z
    }

    /// Calculate cross product
    ///
    /// # Examples
    /// ```
    /// use math_core::vector::Vector3D;
    ///
    /// let v1 = Vector3D::new(1.0, 0.0, 0.0);
    /// let v2 = Vector3D::new(0.0, 1.0, 0.0);
    /// let cross = v1.cross(&v2);
    /// assert_eq!(cross, Vector3D::new(0.0, 0.0, 1.0));
    /// ```
    pub fn cross(&self, other: &Vector3D) -> Vector3D {
        Vector3D {
            x: self.y * other.z - self.z * other.y,
            y: self.z * other.x - self.x * other.z,
            z: self.x * other.y - self.y * other.x,
        }
    }

    /// Normalize to unit vector
    pub fn normalize(&self) -> Result<Vector3D> {
        let mag = self.magnitude();
        if mag < f64::EPSILON {
            return Err(MathError::InvalidInput("영벡터는 정규화 불가".to_string()));
        }

        Ok(Vector3D {
            x: self.x / mag,
            y: self.y / mag,
            z: self.z / mag,
        })
    }

    /// Calculate angle between two vectors (in degrees)
    pub fn angle_between(&self, other: &Vector3D) -> f64 {
        let dot = self.dot(other);
        let mag_product = self.magnitude() * other.magnitude();

        if mag_product < f64::EPSILON {
            return 0.0;
        }

        let cos_theta = (dot / mag_product).clamp(-1.0, 1.0);
        cos_theta.acos() * 180.0 / PI
    }

    /// Check if vectors are perpendicular
    pub fn is_perpendicular(&self, other: &Vector3D) -> bool {
        self.dot(other).abs() < f64::EPSILON
    }

    /// Check if vectors are parallel
    pub fn is_parallel(&self, other: &Vector3D) -> bool {
        let cross = self.cross(other);
        cross.magnitude() < f64::EPSILON
    }
}

impl std::ops::Add for Vector3D {
    type Output = Self;

    fn add(self, other: Self) -> Self {
        Vector3D {
            x: self.x + other.x,
            y: self.y + other.y,
            z: self.z + other.z,
        }
    }
}

impl std::ops::Sub for Vector3D {
    type Output = Self;

    fn sub(self, other: Self) -> Self {
        Vector3D {
            x: self.x - other.x,
            y: self.y - other.y,
            z: self.z - other.z,
        }
    }
}

impl std::ops::Mul<f64> for Vector3D {
    type Output = Self;

    fn mul(self, scalar: f64) -> Self {
        Vector3D {
            x: self.x * scalar,
            y: self.y * scalar,
            z: self.z * scalar,
        }
    }
}

impl std::ops::Neg for Vector3D {
    type Output = Self;

    fn neg(self) -> Self {
        Vector3D {
            x: -self.x,
            y: -self.y,
            z: -self.z,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::EPSILON;

    #[test]
    fn test_magnitude() {
        let v = Vector3D::new(3.0, 4.0, 0.0);
        assert!((v.magnitude() - 5.0).abs() < EPSILON);
    }

    #[test]
    fn test_dot_product() {
        let v1 = Vector3D::new(1.0, 2.0, 3.0);
        let v2 = Vector3D::new(4.0, 5.0, 6.0);
        assert!((v1.dot(&v2) - 32.0).abs() < EPSILON);
    }

    #[test]
    fn test_cross_product() {
        let v1 = Vector3D::new(1.0, 0.0, 0.0);
        let v2 = Vector3D::new(0.0, 1.0, 0.0);
        let cross = v1.cross(&v2);
        assert_eq!(cross, Vector3D::new(0.0, 0.0, 1.0));
    }

    #[test]
    fn test_normalize() {
        let v = Vector3D::new(3.0, 4.0, 0.0);
        let n = v.normalize().unwrap();
        assert!((n.magnitude() - 1.0).abs() < EPSILON);
    }

    #[test]
    fn test_angle_between() {
        let v1 = Vector3D::new(1.0, 0.0, 0.0);
        let v2 = Vector3D::new(0.0, 1.0, 0.0);
        let angle = v1.angle_between(&v2);
        assert!((angle - 90.0).abs() < EPSILON);
    }

    #[test]
    fn test_perpendicular() {
        let v1 = Vector3D::new(1.0, 0.0, 0.0);
        let v2 = Vector3D::new(0.0, 1.0, 0.0);
        assert!(v1.is_perpendicular(&v2));
    }

    #[test]
    fn test_parallel() {
        let v1 = Vector3D::new(1.0, 2.0, 3.0);
        let v2 = Vector3D::new(2.0, 4.0, 6.0);
        assert!(v1.is_parallel(&v2));
    }

    #[test]
    fn test_vector_add() {
        let v1 = Vector3D::new(1.0, 2.0, 3.0);
        let v2 = Vector3D::new(4.0, 5.0, 6.0);
        let sum = v1 + v2;
        assert_eq!(sum, Vector3D::new(5.0, 7.0, 9.0));
    }

    #[test]
    fn test_scalar_multiply() {
        let v = Vector3D::new(1.0, 2.0, 3.0);
        let scaled = v * 2.0;
        assert_eq!(scaled, Vector3D::new(2.0, 4.0, 6.0));
    }
}
