//! Practice problem generation and management
//!
//! This module provides functionality for generating math practice problems,
//! tracking user attempts, and calculating performance statistics.

use serde::{Serialize, Deserialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;
use rand::Rng;

/// Difficulty level for practice problems
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Difficulty {
    #[serde(rename = "easy")]
    Easy,
    #[serde(rename = "medium")]
    Medium,
    #[serde(rename = "hard")]
    Hard,
}

/// A single practice problem with metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PracticeProblem {
    pub id: String,
    pub topic: String,
    pub difficulty: Difficulty,
    pub question: String,
    pub answer: String,
    pub hints: Vec<String>,
    pub solution_steps: Vec<String>,
    pub created_at: DateTime<Utc>,
}

impl PracticeProblem {
    /// Generate a linear equation problem (ax + b = 0)
    pub fn generate_linear(difficulty: Difficulty) -> Self {
        let mut rng = rand::thread_rng();

        let (a, b) = match difficulty {
            Difficulty::Easy => (
                rng.gen_range(1..10) as f64,
                rng.gen_range(-10..10) as f64,
            ),
            Difficulty::Medium => (
                rng.gen_range(1..20) as f64,
                rng.gen_range(-50..50) as f64,
            ),
            Difficulty::Hard => (
                rng.gen_range(1..100) as f64,
                rng.gen_range(-100..100) as f64,
            ),
        };

        let solution = -b / a;

        Self {
            id: Uuid::new_v4().to_string(),
            topic: "linear_equation".to_string(),
            difficulty,
            question: format!("{}x + {} = 0을 풀어라", a, b),
            answer: format!("x = {:.2}", solution),
            hints: vec![
                "양변을 이항하세요".to_string(),
                format!("{}x = {}", a, -b),
                "양변을 계수로 나누세요".to_string(),
            ],
            solution_steps: vec![
                format!("주어진 방정식: {}x + {} = 0", a, b),
                format!("{}x = {}", a, -b),
                format!("x = {} / {}", -b, a),
                format!("x = {:.2}", solution),
            ],
            created_at: Utc::now(),
        }
    }

    /// Generate a quadratic equation problem (ax² + bx + c = 0)
    pub fn generate_quadratic(difficulty: Difficulty) -> Self {
        let mut rng = rand::thread_rng();

        let (a, b, c) = match difficulty {
            Difficulty::Easy => (1.0, rng.gen_range(-10..10) as f64, rng.gen_range(-10..10) as f64),
            Difficulty::Medium => (
                rng.gen_range(1..5) as f64,
                rng.gen_range(-20..20) as f64,
                rng.gen_range(-20..20) as f64,
            ),
            Difficulty::Hard => (
                rng.gen_range(1..10) as f64,
                rng.gen_range(-50..50) as f64,
                rng.gen_range(-50..50) as f64,
            ),
        };

        let d = b * b - 4.0 * a * c;

        let answer = if d < 0.0 {
            "실근이 없습니다".to_string()
        } else if (d.abs() < 1e-10) {
            let x = -b / (2.0 * a);
            format!("x = {:.2} (중근)", x)
        } else {
            let x1 = (-b + d.sqrt()) / (2.0 * a);
            let x2 = (-b - d.sqrt()) / (2.0 * a);
            format!("x₁ = {:.2}, x₂ = {:.2}", x1, x2)
        };

        Self {
            id: Uuid::new_v4().to_string(),
            topic: "quadratic_equation".to_string(),
            difficulty,
            question: format!("{}x² + {}x + {} = 0을 풀어라", a, b, c),
            answer,
            hints: vec![
                "근의 공식을 사용하세요".to_string(),
                format!("판별식 D = b² - 4ac = {:.2}", d),
            ],
            solution_steps: vec![
                format!("주어진 방정식: {}x² + {}x + {} = 0", a, b, c),
                format!("판별식 D = {:.2}", d),
            ],
            created_at: Utc::now(),
        }
    }

    /// Generate a Pythagorean theorem problem
    pub fn generate_geometry(difficulty: Difficulty) -> Self {
        let mut rng = rand::thread_rng();

        let (a, b) = match difficulty {
            Difficulty::Easy => (
                rng.gen_range(1..10) as f64,
                rng.gen_range(1..10) as f64,
            ),
            _ => (
                rng.gen_range(5..50) as f64,
                rng.gen_range(5..50) as f64,
            ),
        };

        let c = (a * a + b * b).sqrt();

        Self {
            id: Uuid::new_v4().to_string(),
            topic: "pythagorean_theorem".to_string(),
            difficulty,
            question: format!("직각삼각형의 두 변이 {}와 {}일 때 빗변의 길이는?", a, b),
            answer: format!("c = {:.2}", c),
            hints: vec![
                "피타고라스 정리: c² = a² + b²".to_string(),
                format!("c² = {}² + {}² = {:.2}", a, b, a*a + b*b),
            ],
            solution_steps: vec![
                format!("a = {}, b = {}", a, b),
                format!("c² = a² + b² = {:.2}", a*a + b*b),
                format!("c = √{:.2} = {:.2}", a*a + b*b, c),
            ],
            created_at: Utc::now(),
        }
    }
}

/// User's attempt at solving a problem
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserAttempt {
    pub problem_id: String,
    pub user_answer: String,
    pub is_correct: bool,
    pub time_spent_seconds: u64,
    pub hints_used: usize,
    pub attempted_at: DateTime<Utc>,
}

/// Manager for practice problems and user attempts
pub struct PracticeManager {
    pub problems: Vec<PracticeProblem>,
    pub attempts: Vec<UserAttempt>,
}

impl PracticeManager {
    pub fn new() -> Self {
        Self {
            problems: Vec::new(),
            attempts: Vec::new(),
        }
    }

    /// Generate multiple problems for a topic
    pub fn generate_problems(&mut self, topic: &str, difficulty: Difficulty, count: usize) {
        for _ in 0..count {
            let problem = match topic {
                "linear" => PracticeProblem::generate_linear(difficulty.clone()),
                "quadratic" => PracticeProblem::generate_quadratic(difficulty.clone()),
                "geometry" => PracticeProblem::generate_geometry(difficulty.clone()),
                _ => continue,
            };
            self.problems.push(problem);
        }
    }

    /// Submit an answer for a problem
    pub fn submit_answer(
        &mut self,
        problem_id: &str,
        user_answer: &str,
        time_spent: u64,
        hints_used: usize,
    ) -> Result<bool, String> {
        let problem = self.problems.iter()
            .find(|p| p.id == problem_id)
            .ok_or("문제를 찾을 수 없습니다")?;

        let is_correct = self.check_answer(&problem.answer, user_answer);

        self.attempts.push(UserAttempt {
            problem_id: problem_id.to_string(),
            user_answer: user_answer.to_string(),
            is_correct,
            time_spent_seconds: time_spent,
            hints_used,
            attempted_at: Utc::now(),
        });

        Ok(is_correct)
    }

    fn check_answer(&self, correct: &str, user: &str) -> bool {
        correct.trim().eq_ignore_ascii_case(user.trim())
    }

    /// Calculate accuracy for a topic (or overall if None)
    pub fn get_accuracy(&self, topic: Option<&str>) -> f64 {
        let relevant_attempts: Vec<_> = self.attempts.iter()
            .filter(|a| {
                if let Some(t) = topic {
                    self.problems.iter()
                        .any(|p| p.id == a.problem_id && p.topic == t)
                } else {
                    true
                }
            })
            .collect();

        if relevant_attempts.is_empty() {
            return 0.0;
        }

        let correct = relevant_attempts.iter().filter(|a| a.is_correct).count();
        correct as f64 / relevant_attempts.len() as f64 * 100.0
    }

    /// Get statistics for a specific topic
    pub fn get_topic_stats(&self, topic: &str) -> TopicStats {
        let topic_problems: Vec<_> = self.problems.iter()
            .filter(|p| p.topic == topic)
            .collect();

        let topic_attempts: Vec<_> = self.attempts.iter()
            .filter(|a| {
                self.problems.iter()
                    .any(|p| p.id == a.problem_id && p.topic == topic)
            })
            .collect();

        TopicStats {
            total_problems: topic_problems.len(),
            attempted: topic_attempts.len(),
            correct: topic_attempts.iter().filter(|a| a.is_correct).count(),
            accuracy: self.get_accuracy(Some(topic)),
            avg_time: if !topic_attempts.is_empty() {
                topic_attempts.iter().map(|a| a.time_spent_seconds).sum::<u64>() as f64
                    / topic_attempts.len() as f64
            } else {
                0.0
            },
        }
    }
}

impl Default for PracticeManager {
    fn default() -> Self {
        Self::new()
    }
}

/// Statistics for a specific topic
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TopicStats {
    pub total_problems: usize,
    pub attempted: usize,
    pub correct: usize,
    pub accuracy: f64,
    pub avg_time: f64,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_linear_problem() {
        let problem = PracticeProblem::generate_linear(Difficulty::Easy);
        assert_eq!(problem.topic, "linear_equation");
        assert!(!problem.question.is_empty());
        assert!(!problem.answer.is_empty());
        assert!(problem.hints.len() >= 2);
    }

    #[test]
    fn test_generate_quadratic_problem() {
        let problem = PracticeProblem::generate_quadratic(Difficulty::Medium);
        assert_eq!(problem.topic, "quadratic_equation");
        assert!(!problem.question.is_empty());
    }

    #[test]
    fn test_practice_manager() {
        let mut manager = PracticeManager::new();
        manager.generate_problems("linear", Difficulty::Easy, 3);
        assert_eq!(manager.problems.len(), 3);

        for problem in &manager.problems {
            assert_eq!(problem.topic, "linear_equation");
        }
    }

    #[test]
    fn test_submit_answer() {
        let mut manager = PracticeManager::new();
        manager.generate_problems("linear", Difficulty::Easy, 1);

        let problem_id = manager.problems[0].id.clone();
        let result = manager.submit_answer(&problem_id, "test", 10, 0);

        assert!(result.is_ok());
        assert_eq!(manager.attempts.len(), 1);
    }

    #[test]
    fn test_accuracy_calculation() {
        let mut manager = PracticeManager::new();
        manager.generate_problems("linear", Difficulty::Easy, 2);

        let id1 = manager.problems[0].id.clone();
        let id2 = manager.problems[1].id.clone();
        let answer1 = manager.problems[0].answer.clone();

        manager.submit_answer(&id1, &answer1, 10, 0).ok();
        manager.submit_answer(&id2, "wrong", 10, 0).ok();

        let accuracy = manager.get_accuracy(None);
        assert!((accuracy - 50.0).abs() < 0.1);
    }
}
