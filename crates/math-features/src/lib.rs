//! # Math Features Library
//!
//! Learning support features for the math helper application.
//!
//! ## Modules
//!
//! - `practice_problem`: Automatic practice problem generation
//! - `wrong_answer_note`: Mistake tracking and mastery system
//! - `progress_tracker`: Learning analytics and progress monitoring
//! - `export`: Data export to CSV and JSON formats

pub mod practice_problem;
pub mod wrong_answer_note;
pub mod progress_tracker;
pub mod export;

pub use practice_problem::*;
pub use wrong_answer_note::*;
pub use progress_tracker::*;
pub use export::*;

/// Version information
pub const VERSION: &str = env!("CARGO_PKG_VERSION");
