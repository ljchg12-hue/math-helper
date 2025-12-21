//! Matrix operations using ndarray

use crate::errors::*;
use ndarray::Array2;

#[derive(Debug, Clone)]
pub struct Matrix {
    data: Array2<f64>,
    rows: usize,
    cols: usize,
}

impl Matrix {
    /// Create matrix from nested vec
    pub fn new(data: Vec<Vec<f64>>) -> Result<Self> {
        if data.is_empty() {
            return Err(MathError::InvalidInput("Matrix cannot be empty".to_string()));
        }

        let rows = data.len();
        let cols = data[0].len();

        if cols == 0 {
            return Err(MathError::InvalidInput("Matrix rows cannot be empty".to_string()));
        }

        // Check all rows have same length
        if !data.iter().all(|row| row.len() == cols) {
            return Err(MathError::InvalidInput(
                "All rows must have the same length".to_string()
            ));
        }

        let flat: Vec<f64> = data.into_iter().flatten().collect();
        let array = Array2::from_shape_vec((rows, cols), flat)
            .map_err(|e| MathError::InvalidInput(e.to_string()))?;

        Ok(Matrix { data: array, rows, cols })
    }

    /// Get dimensions
    pub fn shape(&self) -> (usize, usize) {
        (self.rows, self.cols)
    }

    /// Check if square matrix
    pub fn is_square(&self) -> bool {
        self.rows == self.cols
    }

    /// Matrix addition
    pub fn add(&self, other: &Matrix) -> Result<Matrix> {
        if self.shape() != other.shape() {
            return Err(MathError::DimensionMismatch {
                expected: format!("{}×{}", self.rows, self.cols),
                actual: format!("{}×{}", other.rows, other.cols),
            });
        }

        let result = &self.data + &other.data;
        Ok(Matrix {
            data: result,
            rows: self.rows,
            cols: self.cols,
        })
    }

    /// Matrix multiplication
    pub fn multiply(&self, other: &Matrix) -> Result<Matrix> {
        if self.cols != other.rows {
            return Err(MathError::DimensionMismatch {
                expected: format!("cols={}, other.rows={}", self.cols, self.cols),
                actual: format!("other.rows={}", other.rows),
            });
        }

        let result = self.data.dot(&other.data);
        Ok(Matrix {
            data: result,
            rows: self.rows,
            cols: other.cols,
        })
    }

    /// Calculate determinant (2x2 and 3x3 only for simplicity)
    pub fn determinant(&self) -> Result<f64> {
        if !self.is_square() {
            return Err(MathError::NotSquare);
        }

        match self.rows {
            1 => Ok(self.data[[0, 0]]),
            2 => {
                // det = ad - bc
                Ok(self.data[[0, 0]] * self.data[[1, 1]] - self.data[[0, 1]] * self.data[[1, 0]])
            }
            3 => {
                // Sarrus' rule
                let a = self.data[[0, 0]];
                let b = self.data[[0, 1]];
                let c = self.data[[0, 2]];
                let d = self.data[[1, 0]];
                let e = self.data[[1, 1]];
                let f = self.data[[1, 2]];
                let g = self.data[[2, 0]];
                let h = self.data[[2, 1]];
                let i = self.data[[2, 2]];

                Ok(a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h)
            }
            _ => Err(MathError::InvalidInput(
                "Determinant only implemented for 2x2 and 3x3 matrices".to_string()
            )),
        }
    }

    /// Transpose matrix
    pub fn transpose(&self) -> Matrix {
        Matrix {
            data: self.data.t().to_owned(),
            rows: self.cols,
            cols: self.rows,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::EPSILON;

    #[test]
    fn test_matrix_creation() {
        let m = Matrix::new(vec![
            vec![1.0, 2.0],
            vec![3.0, 4.0],
        ]).unwrap();

        assert_eq!(m.shape(), (2, 2));
        assert!(m.is_square());
    }

    #[test]
    fn test_matrix_add() {
        let m1 = Matrix::new(vec![vec![1.0, 2.0], vec![3.0, 4.0]]).unwrap();
        let m2 = Matrix::new(vec![vec![5.0, 6.0], vec![7.0, 8.0]]).unwrap();
        let result = m1.add(&m2).unwrap();

        assert_eq!(result.data[[0, 0]], 6.0);
        assert_eq!(result.data[[1, 1]], 12.0);
    }

    #[test]
    fn test_matrix_multiply() {
        let m1 = Matrix::new(vec![vec![1.0, 2.0], vec![3.0, 4.0]]).unwrap();
        let m2 = Matrix::new(vec![vec![2.0, 0.0], vec![1.0, 3.0]]).unwrap();
        let result = m1.multiply(&m2).unwrap();

        assert_eq!(result.data[[0, 0]], 4.0);  // 1*2 + 2*1
        assert_eq!(result.data[[0, 1]], 6.0);  // 1*0 + 2*3
        assert_eq!(result.data[[1, 0]], 10.0); // 3*2 + 4*1
        assert_eq!(result.data[[1, 1]], 12.0); // 3*0 + 4*3
    }

    #[test]
    fn test_determinant_2x2() {
        let m = Matrix::new(vec![vec![1.0, 2.0], vec![3.0, 4.0]]).unwrap();
        let det = m.determinant().unwrap();
        assert!((det - (-2.0)).abs() < EPSILON);
    }

    #[test]
    fn test_transpose() {
        let m = Matrix::new(vec![vec![1.0, 2.0], vec![3.0, 4.0]]).unwrap();
        let t = m.transpose();

        assert_eq!(t.data[[0, 0]], 1.0);
        assert_eq!(t.data[[0, 1]], 3.0);
        assert_eq!(t.data[[1, 0]], 2.0);
        assert_eq!(t.data[[1, 1]], 4.0);
    }
}
