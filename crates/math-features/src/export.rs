//! Data export functionality for CSV and JSON formats

use crate::{ProgressTracker, WrongAnswerNote};
use csv::Writer;

/// Data exporter for learning analytics
pub struct DataExporter;

impl DataExporter {
    /// Export progress tracker to CSV file
    pub fn export_progress_to_csv(
        tracker: &ProgressTracker,
        path: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let mut wtr = Writer::from_path(path)?;

        wtr.write_record(&[
            "Topic",
            "Total Problems",
            "Solved",
            "Accuracy (%)",
            "Time (seconds)",
            "Current Streak",
            "Best Streak",
        ])?;

        for topic in tracker.get_all_topics() {
            wtr.write_record(&[
                &topic.topic_name,
                &topic.total_problems.to_string(),
                &topic.solved_problems.to_string(),
                &format!("{:.2}", topic.accuracy),
                &topic.total_time_seconds.to_string(),
                &topic.current_streak.to_string(),
                &topic.best_streak.to_string(),
            ])?;
        }

        wtr.flush()?;
        Ok(())
    }

    /// Export wrong answer notebook to CSV file
    pub fn export_wrong_answers_to_csv(
        note: &WrongAnswerNote,
        path: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let mut wtr = Writer::from_path(path)?;

        wtr.write_record(&[
            "Topic",
            "Question",
            "Correct Answer",
            "User Answer",
            "Retry Count",
            "Mastered",
        ])?;

        for entry in note.get_all_entries() {
            wtr.write_record(&[
                &entry.problem.topic,
                &entry.problem.question,
                &entry.problem.answer,
                &entry.user_answer,
                &entry.retry_count.to_string(),
                &entry.mastered.to_string(),
            ])?;
        }

        wtr.flush()?;
        Ok(())
    }

    /// Export overall statistics summary to CSV
    pub fn export_summary_to_csv(
        tracker: &ProgressTracker,
        path: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let stats = tracker.get_overall_stats();
        let mut wtr = Writer::from_path(path)?;

        wtr.write_record(&["Metric", "Value"])?;

        wtr.write_record(&[
            "Total Problems Attempted",
            &stats.total_problems_attempted.to_string(),
        ])?;

        wtr.write_record(&[
            "Total Problems Solved",
            &stats.total_problems_solved.to_string(),
        ])?;

        wtr.write_record(&[
            "Overall Accuracy (%)",
            &format!("{:.2}", stats.overall_accuracy),
        ])?;

        wtr.write_record(&[
            "Total Study Time (seconds)",
            &stats.total_study_time_seconds.to_string(),
        ])?;

        if let Some(start) = &stats.start_date {
            wtr.write_record(&[
                "Start Date",
                &start.format("%Y-%m-%d %H:%M:%S").to_string(),
            ])?;
        }

        if let Some(last) = &stats.last_activity {
            wtr.write_record(&[
                "Last Activity",
                &last.format("%Y-%m-%d %H:%M:%S").to_string(),
            ])?;
        }

        wtr.flush()?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::practice_problem::{PracticeProblem, Difficulty};

    #[test]
    fn test_export_progress_csv() {
        let mut tracker = ProgressTracker::new();
        tracker.update_progress("linear", true, 30);
        tracker.update_progress("quadratic", false, 45);

        let result = DataExporter::export_progress_to_csv(&tracker, "/tmp/test_progress.csv");
        assert!(result.is_ok());
    }

    #[test]
    fn test_export_wrong_answers_csv() {
        let mut note = WrongAnswerNote::new();
        let problem = PracticeProblem::generate_linear(Difficulty::Easy);
        note.add_entry(problem, "wrong answer".to_string());

        let result = DataExporter::export_wrong_answers_to_csv(&note, "/tmp/test_wrong.csv");
        assert!(result.is_ok());
    }

    #[test]
    fn test_export_summary_csv() {
        let mut tracker = ProgressTracker::new();
        tracker.update_progress("test", true, 10);

        let result = DataExporter::export_summary_to_csv(&tracker, "/tmp/test_summary.csv");
        assert!(result.is_ok());
    }
}
