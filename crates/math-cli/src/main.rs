//! Math CLI - Command-line interface for math-core library

use clap::{Parser, Subcommand};
use math_core::*;

#[derive(Parser)]
#[command(name = "math")]
#[command(about = "Middle school mathematics calculator", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Solve linear equation: ax + b = c
    Linear {
        a: f64,
        b: f64,
        c: f64,
    },

    /// Solve quadratic equation: ax² + bx + c = 0
    Quadratic {
        a: f64,
        b: f64,
        c: f64,
    },

    /// Calculate using Pythagorean theorem
    Pythagoras {
        a: f64,
        b: f64,
    },

    /// Calculate factorial
    Factorial {
        n: u64,
    },

    /// Calculate permutation P(n,r)
    Permutation {
        n: u64,
        r: u64,
    },

    /// Calculate combination C(n,r)
    Combination {
        n: u64,
        r: u64,
    },

    /// Solve system of linear equations
    Simultaneous {
        a: f64,
        b: f64,
        c: f64,
        d: f64,
        e: f64,
        f: f64,
    },

    /// Prime factorization
    Factorize {
        n: u64,
    },

    /// Check if number is prime
    IsPrime {
        n: u64,
    },
}

fn main() -> anyhow::Result<()> {
    env_logger::init();

    let cli = Cli::parse();

    match cli.command {
        Commands::Linear { a, b, c } => {
            let solution = linear_equation::solve_linear_equation(a, b, c)?;
            println!("Linear Equation: {}x + {} = {}", a, b, c);
            for step in &solution.steps {
                println!("  {}", step);
            }
            match solution.solution_type {
                linear_equation::SolutionType::Unique(x) => println!("\n✓ Solution: x = {}", x),
                linear_equation::SolutionType::Infinite => println!("\n✓ Infinite solutions"),
                linear_equation::SolutionType::None => println!("\n✗ No solution"),
            }
        }

        Commands::Quadratic { a, b, c } => {
            let solution = quadratic_equation::solve_quadratic_equation(a, b, c)?;
            println!("Quadratic Equation: {}x² + {}x + {} = 0", a, b, c);
            for step in &solution.steps {
                println!("  {}", step);
            }
        }

        Commands::Pythagoras { a, b } => {
            let result = geometry::pythagorean_theorem(a, b)?;
            println!("Pythagorean Theorem:");
            for step in &result.steps {
                println!("  {}", step);
            }
            println!("\n✓ Result: c = {}", result.result);
        }

        Commands::Factorial { n } => {
            let result = probability::factorial(n);
            println!("{}! = {}", n, result);
        }

        Commands::Permutation { n, r } => {
            let result = probability::permutation(n, r)?;
            println!("P({},{}) = {}", n, r, result);
        }

        Commands::Combination { n, r } => {
            let result = probability::combination(n, r)?;
            println!("C({},{}) = {}", n, r, result);
        }

        Commands::Simultaneous { a, b, c, d, e, f } => {
            let result = simultaneous_equations::solve_simultaneous(a, b, c, d, e, f)?;
            println!("System of Linear Equations:");
            for step in &result.steps {
                println!("  {}", step);
            }
            match result.solution {
                simultaneous_equations::SimultaneousSolution::UniqueSolution { x, y } => {
                    println!("\n✓ Solution: x = {}, y = {}", x, y);
                }
                simultaneous_equations::SimultaneousSolution::NoSolution => {
                    println!("\n✗ No solution");
                }
                simultaneous_equations::SimultaneousSolution::InfiniteSolutions => {
                    println!("\n✓ Infinite solutions");
                }
            }
        }

        Commands::Factorize { n } => {
            let factors = prime::prime_factorize(n)?;
            println!("Prime factorization of {}:", n);
            let mut factors_vec: Vec<_> = factors.iter().collect();
            factors_vec.sort_by_key(|(prime, _)| *prime);

            for (prime, exponent) in factors_vec {
                println!("  {} ^ {}", prime, exponent);
            }
        }

        Commands::IsPrime { n } => {
            if prime::is_prime(n) {
                println!("{} is prime", n);
            } else {
                println!("{} is not prime", n);
            }
        }
    }

    Ok(())
}
