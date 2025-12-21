//! Progress tracking for learning analytics

use serde::{Serialize, Deserialize};
use chrono::{DateTime, Utc};
use std::collections::HashMap;

/// Progress statistics for a specific topic
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TopicProgress {
    pub topic_name: String,
    pub total_problems: usize,
    pub solved_problems: usize,
    pub accuracy: f64,
    pub total_time_seconds: u64,
    pub last_studied: Option<DateTime<Utc>>,
    pub current_streak: usize,
    pub best_streak: usize,
}

/// Overall learning statistics
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct OverallStats {
    pub total_problems_attempted: usize,
    pub total_problems_solved: usize,
    pub overall_accuracy: f64,
    pub total_study_time_seconds: u64,
    pub start_date: Option<DateTime<Utc>>,
    pub last_activity: Option<DateTime<Utc>>,
}

/// Main progress tracker
#[derive(Debug, Default, Serialize, Deserialize)]
pub struct ProgressTracker {
    topics: HashMap<String, TopicProgress>,
    overall_stats: OverallStats,
}

impl ProgressTracker {
    pub fn new() -> Self {
        Self::default()
    }

    /// Update progress after solving a problem
    pub fn update_progress(
        &mut self,
        topic: &str,
        is_correct: bool,
        time_spent: u64,
    ) {
        let progress = self.topics.entry(topic.to_string())
            .or_insert(TopicProgress {
                topic_name: topic.to_string(),
                total_problems: 0,
                solved_problems: 0,
                accuracy: 0.0,
                total_time_seconds: 0,
                last_studied: None,
                current_streak: 0,
                best_streak: 0,
            });

        progress.total_problems += 1;
        if is_correct {
            progress.solved_problems += 1;
            progress.current_streak += 1;
            progress.best_streak = progress.best_streak.max(progress.current_streak);
        } else {
            progress.current_streak = 0;
        }

        progress.accuracy = (progress.solved_problems as f64 / progress.total_problems as f64) * 100.0;
        progress.total_time_seconds += time_spent;
        progress.last_studied = Some(Utc::now());

        self.update_overall_stats();
    }

    fn update_overall_stats(&mut self) {
        let total_attempted: usize = self.topics.values().map(|t| t.total_problems).sum();
        let total_solved: usize = self.topics.values().map(|t| t.solved_problems).sum();

        self.overall_stats.total_problems_attempted = total_attempted;
        self.overall_stats.total_problems_solved = total_solved;
        self.overall_stats.overall_accuracy = if total_attempted > 0 {
            (total_solved as f64 / total_attempted as f64) * 100.0
        } else {
            0.0
        };
        self.overall_stats.total_study_time_seconds = self.topics.values()
            .map(|t| t.total_time_seconds)
            .sum();
        self.overall_stats.last_activity = Some(Utc::now());

        if self.overall_stats.start_date.is_none() {
            self.overall_stats.start_date = Some(Utc::now());
        }
    }

    /// Get progress for a specific topic
    pub fn get_topic_progress(&self, topic: &str) -> Option<&TopicProgress> {
        self.topics.get(topic)
    }

    /// Get overall accuracy percentage
    pub fn get_overall_progress(&self) -> f64 {
        self.overall_stats.overall_accuracy
    }

    /// Get all topics
    pub fn get_all_topics(&self) -> Vec<&TopicProgress> {
        self.topics.values().collect()
    }

    /// Get overall statistics
    pub fn get_overall_stats(&self) -> &OverallStats {
        &self.overall_stats
    }

    /// Find the weakest topic (lowest accuracy, minimum 3 attempts)
    pub fn get_weakest_topic(&self) -> Option<&TopicProgress> {
        self.topics.values()
            .filter(|t| t.total_problems >= 3)
            .min_by(|a, b| a.accuracy.partial_cmp(&b.accuracy).unwrap())
    }

    /// Find the strongest topic (highest accuracy, minimum 3 attempts)
    pub fn get_strongest_topic(&self) -> Option<&TopicProgress> {
        self.topics.values()
            .filter(|t| t.total_problems >= 3)
            .max_by(|a, b| a.accuracy.partial_cmp(&b.accuracy).unwrap())
    }

    /// Get topics that need review (accuracy < 70%)
    pub fn get_topics_needing_review(&self) -> Vec<&TopicProgress> {
        self.topics.values()
            .filter(|t| t.total_problems >= 3 && t.accuracy < 70.0)
            .collect()
    }

    /// Save to JSON file
    pub fn save_to_json(&self, path: &str) -> Result<(), Box<dyn std::error::Error>> {
        let json = serde_json::to_string_pretty(self)?;
        std::fs::write(path, json)?;
        Ok(())
    }

    /// Load from JSON file
    pub fn load_from_json(path: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let json = std::fs::read_to_string(path)?;
        let tracker = serde_json::from_str(&json)?;
        Ok(tracker)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_update_progress() {
        let mut tracker = ProgressTracker::new();

        tracker.update_progress("linear_equation", true, 30);
        tracker.update_progress("linear_equation", true, 25);
        tracker.update_progress("linear_equation", false, 40);

        let progress = tracker.get_topic_progress("linear_equation").unwrap();
        assert_eq!(progress.total_problems, 3);
        assert_eq!(progress.solved_problems, 2);
        assert!((progress.accuracy - 66.67).abs() < 0.1);
    }

    #[test]
    fn test_streak_tracking() {
        let mut tracker = ProgressTracker::new();

        tracker.update_progress("math", true, 10);
        tracker.update_progress("math", true, 10);
        tracker.update_progress("math", true, 10);

        let progress = tracker.get_topic_progress("math").unwrap();
        assert_eq!(progress.current_streak, 3);
        assert_eq!(progress.best_streak, 3);

        tracker.update_progress("math", false, 10);
        let progress = tracker.get_topic_progress("math").unwrap();
        assert_eq!(progress.current_streak, 0);
        assert_eq!(progress.best_streak, 3);
    }

    #[test]
    fn test_overall_stats() {
        let mut tracker = ProgressTracker::new();

        tracker.update_progress("topic1", true, 10);
        tracker.update_progress("topic2", false, 15);
        tracker.update_progress("topic1", true, 20);

        let stats = tracker.get_overall_stats();
        assert_eq!(stats.total_problems_attempted, 3);
        assert_eq!(stats.total_problems_solved, 2);
        assert!((stats.overall_accuracy - 66.67).abs() < 0.1);
    }

    #[test]
    fn test_weakest_strongest_topics() {
        let mut tracker = ProgressTracker::new();

        // Topic 1: 80% accuracy
        tracker.update_progress("topic1", true, 10);
        tracker.update_progress("topic1", true, 10);
        tracker.update_progress("topic1", true, 10);
        tracker.update_progress("topic1", true, 10);
        tracker.update_progress("topic1", false, 10);

        // Topic 2: 50% accuracy
        tracker.update_progress("topic2", true, 10);
        tracker.update_progress("topic2", false, 10);
        tracker.update_progress("topic2", true, 10);
        tracker.update_progress("topic2", false, 10);

        let weakest = tracker.get_weakest_topic().unwrap();
        assert_eq!(weakest.topic_name, "topic2");

        let strongest = tracker.get_strongest_topic().unwrap();
        assert_eq!(strongest.topic_name, "topic1");
    }
}
