//! Wrong answer notebook for tracking mistakes and mastery

use crate::practice_problem::PracticeProblem;
use serde::{Serialize, Deserialize};
use chrono::{DateTime, Utc};

/// Entry in the wrong answer notebook
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WrongAnswerEntry {
    pub problem: PracticeProblem,
    pub user_answer: String,
    pub retry_count: usize,
    pub mastered: bool,
    pub notes: String,
    pub added_at: DateTime<Utc>,
    pub last_retry: Option<DateTime<Utc>>,
}

/// Notebook for tracking wrong answers and mastery progress
#[derive(Debug, Default, Serialize, Deserialize)]
pub struct WrongAnswerNote {
    entries: Vec<WrongAnswerEntry>,
}

impl WrongAnswerNote {
    pub fn new() -> Self {
        Self::default()
    }

    /// Add a wrong answer to the notebook
    pub fn add_entry(&mut self, problem: PracticeProblem, user_answer: String) {
        let entry = WrongAnswerEntry {
            problem,
            user_answer,
            retry_count: 0,
            mastered: false,
            notes: String::new(),
            added_at: Utc::now(),
            last_retry: None,
        };
        self.entries.push(entry);
    }

    /// Record a retry attempt for a problem
    pub fn record_retry(&mut self, problem_id: &str, success: bool) {
        if let Some(entry) = self.entries.iter_mut()
            .find(|e| e.problem.id == problem_id) {
            entry.retry_count += 1;
            entry.last_retry = Some(Utc::now());

            if success {
                entry.mastered = true;
            }
        }
    }

    /// Add a note to a problem entry
    pub fn add_note(&mut self, problem_id: &str, note: &str) {
        if let Some(entry) = self.entries.iter_mut()
            .find(|e| e.problem.id == problem_id) {
            if !entry.notes.is_empty() {
                entry.notes.push('\n');
            }
            entry.notes.push_str(note);
        }
    }

    /// Mark a problem as mastered
    pub fn mark_as_mastered(&mut self, problem_id: &str) {
        if let Some(entry) = self.entries.iter_mut()
            .find(|e| e.problem.id == problem_id) {
            entry.mastered = true;
        }
    }

    /// Get all unmastered problems
    pub fn get_unmastered(&self) -> Vec<&WrongAnswerEntry> {
        self.entries.iter()
            .filter(|e| !e.mastered)
            .collect()
    }

    /// Count wrong answers by topic (unmastered only)
    pub fn count_by_topic(&self, topic: &str) -> usize {
        self.entries.iter()
            .filter(|e| e.problem.topic == topic && !e.mastered)
            .count()
    }

    /// Get all entries
    pub fn get_all_entries(&self) -> &Vec<WrongAnswerEntry> {
        &self.entries
    }

    /// Get mastery rate (percentage of mastered entries)
    pub fn get_mastery_rate(&self) -> f64 {
        if self.entries.is_empty() {
            return 100.0;
        }

        let mastered = self.entries.iter().filter(|e| e.mastered).count();
        mastered as f64 / self.entries.len() as f64 * 100.0
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
        let note = serde_json::from_str(&json)?;
        Ok(note)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::practice_problem::{PracticeProblem, Difficulty};

    #[test]
    fn test_add_entry() {
        let mut note = WrongAnswerNote::new();
        let problem = PracticeProblem::generate_linear(Difficulty::Easy);

        note.add_entry(problem.clone(), "wrong answer".to_string());
        assert_eq!(note.entries.len(), 1);
        assert_eq!(note.entries[0].user_answer, "wrong answer");
    }

    #[test]
    fn test_mastery_tracking() {
        let mut note = WrongAnswerNote::new();
        let problem = PracticeProblem::generate_linear(Difficulty::Easy);
        let problem_id = problem.id.clone();

        note.add_entry(problem, "wrong".to_string());
        assert_eq!(note.get_unmastered().len(), 1);

        note.record_retry(&problem_id, true);
        assert_eq!(note.get_unmastered().len(), 0);
        assert_eq!(note.get_mastery_rate(), 100.0);
    }

    #[test]
    fn test_notes() {
        let mut note = WrongAnswerNote::new();
        let problem = PracticeProblem::generate_linear(Difficulty::Easy);
        let problem_id = problem.id.clone();

        note.add_entry(problem, "wrong".to_string());
        note.add_note(&problem_id, "Remember to check signs");

        assert!(note.entries[0].notes.contains("Remember"));
    }
}
