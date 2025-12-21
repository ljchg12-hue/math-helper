//! Statistical calculations

use crate::{errors::*, validation::*};
use std::collections::HashMap;

/// Calculate arithmetic mean
pub fn calculate_mean(data: &[f64]) -> Result<f64> {
    if data.is_empty() {
        return Err(MathError::InvalidInput("Data cannot be empty".to_string()));
    }

    for (i, &val) in data.iter().enumerate() {
        validate_number(val, &format!("data[{}]", i))?;
    }

    let sum: f64 = data.iter().sum();
    Ok(sum / data.len() as f64)
}

/// Calculate median
pub fn calculate_median(data: &[f64]) -> Result<f64> {
    if data.is_empty() {
        return Err(MathError::InvalidInput("Data cannot be empty".to_string()));
    }

    for (i, &val) in data.iter().enumerate() {
        validate_number(val, &format!("data[{}]", i))?;
    }

    let mut sorted = data.to_vec();
    sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let len = sorted.len();
    if len % 2 == 0 {
        Ok((sorted[len / 2 - 1] + sorted[len / 2]) / 2.0)
    } else {
        Ok(sorted[len / 2])
    }
}

/// Calculate mode (returns all modes if multiple exist)
pub fn calculate_mode(data: &[f64]) -> Result<Vec<f64>> {
    if data.is_empty() {
        return Err(MathError::InvalidInput("Data cannot be empty".to_string()));
    }

    for (i, &val) in data.iter().enumerate() {
        validate_number(val, &format!("data[{}]", i))?;
    }

    let mut frequency: HashMap<i64, usize> = HashMap::new();

    // Convert to i64 for HashMap key (assuming reasonable precision)
    for &val in data {
        let key = (val * 1000.0).round() as i64;
        *frequency.entry(key).or_insert(0) += 1;
    }

    let max_count = frequency.values().max().unwrap();
    let modes: Vec<f64> = frequency
        .iter()
        .filter(|(_, &count)| count == *max_count)
        .map(|(key, _)| *key as f64 / 1000.0)
        .collect();

    Ok(modes)
}

/// Calculate variance (population or sample)
pub fn calculate_variance(data: &[f64], sample: bool) -> Result<f64> {
    if data.is_empty() {
        return Err(MathError::InvalidInput("Data cannot be empty".to_string()));
    }

    if sample && data.len() < 2 {
        return Err(MathError::InvalidInput(
            "Sample variance requires at least 2 data points".to_string()
        ));
    }

    let mean = calculate_mean(data)?;
    let squared_diffs: f64 = data.iter()
        .map(|&x| (x - mean).powi(2))
        .sum();

    let divisor = if sample {
        data.len() - 1
    } else {
        data.len()
    };

    Ok(squared_diffs / divisor as f64)
}

/// Calculate standard deviation
pub fn calculate_std_dev(data: &[f64], sample: bool) -> Result<f64> {
    let variance = calculate_variance(data, sample)?;
    Ok(variance.sqrt())
}

/// Calculate range (max - min)
pub fn calculate_range(data: &[f64]) -> Result<f64> {
    if data.is_empty() {
        return Err(MathError::InvalidInput("Data cannot be empty".to_string()));
    }

    for (i, &val) in data.iter().enumerate() {
        validate_number(val, &format!("data[{}]", i))?;
    }

    let min = data.iter().fold(f64::INFINITY, |a, &b| a.min(b));
    let max = data.iter().fold(f64::NEG_INFINITY, |a, &b| a.max(b));

    Ok(max - min)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::EPSILON;

    #[test]
    fn test_mean() {
        let data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
        let mean = calculate_mean(&data).unwrap();
        assert!((mean - 3.0).abs() < EPSILON);
    }

    #[test]
    fn test_median_odd() {
        let data = vec![1.0, 2.0, 3.0, 4.0, 5.0];
        let median = calculate_median(&data).unwrap();
        assert!((median - 3.0).abs() < EPSILON);
    }

    #[test]
    fn test_median_even() {
        let data = vec![1.0, 2.0, 3.0, 4.0];
        let median = calculate_median(&data).unwrap();
        assert!((median - 2.5).abs() < EPSILON);
    }

    #[test]
    fn test_variance_population() {
        let data = vec![2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0];
        let variance = calculate_variance(&data, false).unwrap();
        assert!((variance - 4.0).abs() < 0.1);
    }

    #[test]
    fn test_std_dev() {
        let data = vec![2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0];
        let std_dev = calculate_std_dev(&data, false).unwrap();
        assert!((std_dev - 2.0).abs() < 0.1);
    }

    #[test]
    fn test_range() {
        let data = vec![1.0, 5.0, 3.0, 9.0, 2.0];
        let range = calculate_range(&data).unwrap();
        assert!((range - 8.0).abs() < EPSILON);
    }
}
