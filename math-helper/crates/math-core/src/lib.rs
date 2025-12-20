// Calculator modules
pub mod geometry;
pub mod linear_equation;
pub mod quadratic_equation;
pub mod statistics;

// Re-export commonly used types
pub use geometry::{
    circle_area, pythagorean_theorem, trapezoid_area, triangle_area, Circle, GeometryError,
    GeometryResult, Point, Triangle,
};
pub use linear_equation::{solve_linear_equation, LinearEquationError, LinearEquationResult};
pub use quadratic_equation::{
    solve_quadratic_equation, QuadraticEquationError, QuadraticEquationResult, QuadraticSolution,
};
pub use statistics::{mean, median, mode, quartiles, range, std_dev, variance, Quartiles, StatisticsError};

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
