//! Statistics module for calculating statistical measures
//!
//! Provides functions for calculating mean, median, mode, variance,
//! standard deviation, quartiles, and range of data sets.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use thiserror::Error;

/// EPSILON constant for floating point comparison
const EPSILON: f64 = 1e-10;

/// Wrapper for f64 to enable Eq and Hash for use in HashMap
#[derive(Debug, Clone, Copy, PartialEq)]
struct OrderedFloat(f64);

impl Eq for OrderedFloat {}

impl std::hash::Hash for OrderedFloat {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        self.0.to_bits().hash(state);
    }
}

impl std::cmp::Ord for OrderedFloat {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.partial_cmp(other).unwrap_or(std::cmp::Ordering::Equal)
    }
}

impl std::cmp::PartialOrd for OrderedFloat {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        self.0.partial_cmp(&other.0)
    }
}

/// Quartile information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Quartiles {
    pub q1: f64,  // 25th percentile
    pub q2: f64,  // 50th percentile (median)
    pub q3: f64,  // 75th percentile
}

/// Errors that can occur in statistics calculations
#[derive(Debug, Error)]
pub enum StatisticsError {
    /// Empty data set
    #[error("Empty data set: cannot calculate statistics on empty data")]
    EmptyData,

    /// Invalid input (NaN or Infinity)
    #[error("Invalid input: {0}")]
    InvalidInput(String),
}

/// Validates that all values in data are valid (not NaN or Infinity)
fn validate_data(data: &[f64]) -> Result<(), StatisticsError> {
    for &value in data {
        if value.is_nan() {
            return Err(StatisticsError::InvalidInput("data contains NaN".to_string()));
        }
        if value.is_infinite() {
            return Err(StatisticsError::InvalidInput(
                "data contains infinite values".to_string(),
            ));
        }
    }
    Ok(())
}

/// Calculates the arithmetic mean (average) of a data set
///
/// # Arguments
///
/// * `data` - Slice of f64 values
///
/// # Returns
///
/// * `Ok(f64)` - The mean value
/// * `Err(StatisticsError)` - If data is empty or contains invalid values
///
/// # Examples
///
/// ```
/// use math_core::statistics::mean;
///
/// let data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
/// assert_eq!(mean(&data).unwrap(), 3.0);
/// ```
pub fn mean(data: &[f64]) -> Result<f64, StatisticsError> {
    if data.is_empty() {
        return Err(StatisticsError::EmptyData);
    }

    validate_data(data)?;

    let sum: f64 = data.iter().sum();
    Ok(sum / data.len() as f64)
}

/// Calculates the median (middle value) of a data set
///
/// # Arguments
///
/// * `data` - Slice of f64 values
///
/// # Returns
///
/// * `Ok(f64)` - The median value
/// * `Err(StatisticsError)` - If data is empty or contains invalid values
///
/// # Examples
///
/// ```
/// use math_core::statistics::median;
///
/// let data = vec![1.0, 3.0, 2.0];
/// assert_eq!(median(&data).unwrap(), 2.0);
/// ```
pub fn median(data: &[f64]) -> Result<f64, StatisticsError> {
    if data.is_empty() {
        return Err(StatisticsError::EmptyData);
    }

    validate_data(data)?;

    let mut sorted = data.to_vec();
    sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let mid = sorted.len() / 2;
    if sorted.len() % 2 == 0 {
        Ok((sorted[mid - 1] + sorted[mid]) / 2.0)
    } else {
        Ok(sorted[mid])
    }
}

/// Calculates the mode (most frequent value(s)) of a data set
///
/// Returns all values that appear with the highest frequency.
/// If all values appear with the same frequency, returns all values.
///
/// # Arguments
///
/// * `data` - Slice of f64 values
///
/// # Returns
///
/// * `Ok(Vec<f64>)` - Vector of mode values
/// * `Err(StatisticsError)` - If data is empty or contains invalid values
pub fn mode(data: &[f64]) -> Result<Vec<f64>, StatisticsError> {
    if data.is_empty() {
        return Err(StatisticsError::EmptyData);
    }

    validate_data(data)?;

    let mut freq: HashMap<OrderedFloat, usize> = HashMap::new();
    for &value in data {
        *freq.entry(OrderedFloat(value)).or_insert(0) += 1;
    }

    let max_freq = *freq.values().max().unwrap();
    let mut modes: Vec<f64> = freq
        .iter()
        .filter(|(_, &count)| count == max_freq)
        .map(|(k, _)| k.0)
        .collect();

    modes.sort_by(|a, b| a.partial_cmp(b).unwrap());
    Ok(modes)
}

/// Calculates the variance of a data set
///
/// # Arguments
///
/// * `data` - Slice of f64 values
/// * `sample` - If true, calculates sample variance (n-1), otherwise population variance (n)
///
/// # Returns
///
/// * `Ok(f64)` - The variance
/// * `Err(StatisticsError)` - If data is empty or contains invalid values
///
/// # Examples
///
/// ```
/// use math_core::statistics::variance;
///
/// let data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
/// let var = variance(&data, false).unwrap();
/// assert!((var - 2.0).abs() < 1e-10);
/// ```
pub fn variance(data: &[f64], sample: bool) -> Result<f64, StatisticsError> {
    if data.is_empty() {
        return Err(StatisticsError::EmptyData);
    }

    if sample && data.len() < 2 {
        return Err(StatisticsError::InvalidInput(
            "sample variance requires at least 2 data points".to_string(),
        ));
    }

    let m = mean(data)?;
    let sum_sq_diff: f64 = data.iter().map(|&x| (x - m).powi(2)).sum();

    let divisor = if sample {
        data.len() - 1
    } else {
        data.len()
    } as f64;

    Ok(sum_sq_diff / divisor)
}

/// Calculates the standard deviation of a data set
///
/// # Arguments
///
/// * `data` - Slice of f64 values
/// * `sample` - If true, calculates sample standard deviation, otherwise population standard deviation
///
/// # Returns
///
/// * `Ok(f64)` - The standard deviation
/// * `Err(StatisticsError)` - If data is empty or contains invalid values
pub fn std_dev(data: &[f64], sample: bool) -> Result<f64, StatisticsError> {
    Ok(variance(data, sample)?.sqrt())
}

/// Calculates the quartiles (Q1, Q2, Q3) of a data set
///
/// Q1 (25th percentile), Q2 (50th percentile/median), Q3 (75th percentile)
///
/// # Arguments
///
/// * `data` - Slice of f64 values
///
/// # Returns
///
/// * `Ok(Quartiles)` - The quartile values
/// * `Err(StatisticsError)` - If data is empty or contains invalid values
pub fn quartiles(data: &[f64]) -> Result<Quartiles, StatisticsError> {
    if data.is_empty() {
        return Err(StatisticsError::EmptyData);
    }

    validate_data(data)?;

    let mut sorted = data.to_vec();
    sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let n = sorted.len();

    // Q2 (median)
    let q2 = if n % 2 == 0 {
        (sorted[n / 2 - 1] + sorted[n / 2]) / 2.0
    } else {
        sorted[n / 2]
    };

    // Q1 (25th percentile)
    let q1_index = n / 4;
    let q1 = if n % 4 == 0 {
        (sorted[q1_index - 1] + sorted[q1_index]) / 2.0
    } else {
        sorted[q1_index]
    };

    // Q3 (75th percentile)
    let q3_index = (3 * n) / 4;
    let q3 = if (3 * n) % 4 == 0 {
        (sorted[q3_index - 1] + sorted[q3_index]) / 2.0
    } else {
        sorted[q3_index]
    };

    Ok(Quartiles { q1, q2, q3 })
}

/// Calculates the range (max - min) of a data set
///
/// # Arguments
///
/// * `data` - Slice of f64 values
///
/// # Returns
///
/// * `Ok(f64)` - The range
/// * `Err(StatisticsError)` - If data is empty or contains invalid values
pub fn range(data: &[f64]) -> Result<f64, StatisticsError> {
    if data.is_empty() {
        return Err(StatisticsError::EmptyData);
    }

    validate_data(data)?;

    let min = data
        .iter()
        .min_by(|a, b| a.partial_cmp(b).unwrap())
        .unwrap();
    let max = data
        .iter()
        .max_by(|a, b| a.partial_cmp(b).unwrap())
        .unwrap();

    Ok(max - min)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mean() {
        let data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
        assert!((mean(&data).unwrap() - 3.0).abs() < EPSILON);
    }

    #[test]
    fn test_mean_empty() {
        let data: Vec<f64> = vec![];
        assert!(matches!(mean(&data), Err(StatisticsError::EmptyData)));
    }

    #[test]
    fn test_median_odd() {
        let data = vec![1.0, 3.0, 2.0];
        assert!((median(&data).unwrap() - 2.0).abs() < EPSILON);
    }

    #[test]
    fn test_median_even() {
        let data = vec![1.0, 2.0, 3.0, 4.0];
        assert!((median(&data).unwrap() - 2.5).abs() < EPSILON);
    }

    #[test]
    fn test_mode_single() {
        let data = vec![1.0, 2.0, 2.0, 3.0];
        let modes = mode(&data).unwrap();
        assert_eq!(modes, vec![2.0]);
    }

    #[test]
    fn test_mode_multiple() {
        let data = vec![1.0, 1.0, 2.0, 2.0, 3.0];
        let modes = mode(&data).unwrap();
        assert_eq!(modes, vec![1.0, 2.0]);
    }

    #[test]
    fn test_variance_population() {
        let data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
        let var = variance(&data, false).unwrap();
        assert!((var - 2.0).abs() < EPSILON);
    }

    #[test]
    fn test_variance_sample() {
        let data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
        let var = variance(&data, true).unwrap();
        assert!((var - 2.5).abs() < EPSILON);
    }

    #[test]
    fn test_std_dev_population() {
        let data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
        let std = std_dev(&data, false).unwrap();
        assert!((std - 2.0_f64.sqrt()).abs() < EPSILON);
    }

    #[test]
    fn test_std_dev_sample() {
        let data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
        let std = std_dev(&data, true).unwrap();
        assert!((std - 2.5_f64.sqrt()).abs() < EPSILON);
    }

    #[test]
    fn test_quartiles() {
        let data = vec![1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0];
        let q = quartiles(&data).unwrap();
        assert!((q.q1 - 2.5).abs() < EPSILON);
        assert!((q.q2 - 4.5).abs() < EPSILON);
        assert!((q.q3 - 6.5).abs() < EPSILON);
    }

    #[test]
    fn test_range() {
        let data = vec![1.0, 5.0, 3.0, 9.0, 2.0];
        assert!((range(&data).unwrap() - 8.0).abs() < EPSILON);
    }

    #[test]
    fn test_invalid_input_nan() {
        let data = vec![1.0, 2.0, f64::NAN, 4.0];
        assert!(matches!(mean(&data), Err(StatisticsError::InvalidInput(_))));
    }

    #[test]
    fn test_invalid_input_infinity() {
        let data = vec![1.0, 2.0, f64::INFINITY, 4.0];
        assert!(matches!(
            median(&data),
            Err(StatisticsError::InvalidInput(_))
        ));
    }

    #[test]
    fn test_sample_variance_single_value() {
        let data = vec![1.0];
        assert!(matches!(
            variance(&data, true),
            Err(StatisticsError::InvalidInput(_))
        ));
    }
}
