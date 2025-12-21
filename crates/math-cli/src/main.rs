//! Math CLI - Command-line interface for math-core library

use clap::{Parser, Subcommand};
use math_core::*;
use math_features::*;

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

    /// Calculate power: base^exponent
    Power {
        base: f64,
        exponent: f64,
    },

    /// Calculate logarithm: log_base(value)
    Log {
        value: f64,
        base: f64,
    },

    /// Calculate sine (degrees)
    Sin {
        angle: f64,
    },

    /// Calculate cosine (degrees)
    Cos {
        angle: f64,
    },

    /// Calculate tangent (degrees)
    Tan {
        angle: f64,
    },

    /// Generate arithmetic sequence
    ArithSeq {
        first: f64,
        diff: f64,
        n: usize,
    },

    /// Generate Fibonacci sequence
    Fibonacci {
        n: usize,
    },

    /// Calculate vector dot product
    VectorDot {
        x1: f64,
        y1: f64,
        z1: f64,
        x2: f64,
        y2: f64,
        z2: f64,
    },

    /// Add complex numbers
    ComplexAdd {
        re1: f64,
        im1: f64,
        re2: f64,
        im2: f64,
    },

    /// Numerical derivative
    Derivative {
        /// Polynomial coefficients (e.g., "1,0,-3" for x² - 3)
        #[arg(value_delimiter = ',')]
        coeffs: Vec<f64>,
        x: f64,
    },

    /// Generate practice problems
    Practice {
        /// Topic: linear, quadratic, geometry
        topic: String,
        #[arg(short, long, default_value = "easy")]
        difficulty: String,
        #[arg(short = 'n', long, default_value_t = 5)]
        count: usize,
    },

    /// View learning progress
    Progress {
        #[arg(short, long)]
        topic: Option<String>,
    },

    /// View wrong answer notebook
    WrongAnswers {
        #[arg(short, long)]
        topic: Option<String>,
    },

    /// Export data (requires existing data file)
    Export {
        /// Format: csv or json
        format: String,
        #[arg(short, long)]
        output: String,
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

        Commands::Power { base, exponent } => {
            let result = exponent::power(base, exponent)?;
            println!("Power Calculation:");
            for step in &result.steps {
                println!("  {}", step);
            }
        }

        Commands::Log { value, base } => {
            let result = exponent::logarithm(value, base)?;
            println!("Logarithm Calculation:");
            for step in &result.steps {
                println!("  {}", step);
            }
        }

        Commands::Sin { angle } => {
            let result = trigonometry::sin_deg(angle)?;
            println!("sin({angle}°) = {}", result.result);
        }

        Commands::Cos { angle } => {
            let result = trigonometry::cos_deg(angle)?;
            println!("cos({angle}°) = {}", result.result);
        }

        Commands::Tan { angle } => {
            let result = trigonometry::tan_deg(angle)?;
            println!("tan({angle}°) = {}", result.result);
        }

        Commands::ArithSeq { first, diff, n } => {
            let result = sequence::arithmetic_sequence(first, diff, n)?;
            println!("Arithmetic Sequence:");
            println!("  Formula: {}", result.formula);
            println!("  Terms: {:?}", result.terms);
            println!("  Sum: {}", result.sum);
        }

        Commands::Fibonacci { n } => {
            let result = sequence::fibonacci_sequence(n)?;
            println!("Fibonacci Sequence ({} terms):", n);
            println!("  Terms: {:?}", result.terms);
            println!("  Sum: {}", result.sum);
        }

        Commands::VectorDot { x1, y1, z1, x2, y2, z2 } => {
            let v1 = vector::Vector3D::new(x1, y1, z1);
            let v2 = vector::Vector3D::new(x2, y2, z2);
            let dot = v1.dot(&v2);
            println!("Vector Dot Product:");
            println!("  v1 = ({}, {}, {})", x1, y1, z1);
            println!("  v2 = ({}, {}, {})", x2, y2, z2);
            println!("  v1 · v2 = {}", dot);
        }

        Commands::ComplexAdd { re1, im1, re2, im2 } => {
            use num_complex::Complex64;
            let c1 = Complex64::new(re1, im1);
            let c2 = Complex64::new(re2, im2);
            let result = complex_number::complex_add(c1, c2);
            println!("Complex Addition:");
            println!("  ({} + {}i) + ({} + {}i) = {} + {}i", re1, im1, re2, im2, result.real, result.imag);
        }

        Commands::Derivative { coeffs, x } => {
            // Create polynomial function from coefficients
            let f = |x: f64| {
                coeffs.iter().enumerate()
                    .map(|(i, &c)| c * x.powi(i as i32))
                    .sum()
            };

            let deriv = calculus::numerical_derivative(f, x, 0.0001);
            println!("Numerical Derivative:");
            println!("  f'({}) ≈ {}", x, deriv);
        }

        Commands::Practice { topic, difficulty, count } => {
            let diff = match difficulty.to_lowercase().as_str() {
                "easy" => Difficulty::Easy,
                "medium" => Difficulty::Medium,
                "hard" => Difficulty::Hard,
                _ => {
                    println!("Invalid difficulty. Using 'easy'.");
                    Difficulty::Easy
                }
            };

            let mut manager = PracticeManager::new();
            manager.generate_problems(&topic, diff, count);

            println!("\n📚 Generated {} {} problems (difficulty: {})\n", count, topic, difficulty);

            for (i, problem) in manager.problems.iter().enumerate() {
                println!("Problem {}:", i + 1);
                println!("  {}", problem.question);
                println!("  Answer: {}", problem.answer);
                println!("  Hints: {}", problem.hints.len());
                println!();
            }
        }

        Commands::Progress { topic } => {
            println!("\n📊 Learning Progress\n");
            println!("Note: This displays example progress data.");
            println!("In a full implementation, this would load from saved data.\n");

            if let Some(t) = topic {
                println!("Topic: {}", t);
                println!("  Total Problems: 10");
                println!("  Solved: 7");
                println!("  Accuracy: 70.0%");
                println!("  Current Streak: 3");
            } else {
                println!("Overall Statistics:");
                println!("  Total Problems: 25");
                println!("  Solved: 18");
                println!("  Overall Accuracy: 72.0%");
                println!("  Total Study Time: 45 minutes");
            }
        }

        Commands::WrongAnswers { topic } => {
            println!("\n📝 Wrong Answer Notebook\n");
            println!("Note: This displays example wrong answer data.");
            println!("In a full implementation, this would load from saved data.\n");

            if let Some(t) = topic {
                println!("Wrong answers for topic: {}", t);
                println!("  Total: 3");
                println!("  Mastered: 1");
                println!("  Still reviewing: 2");
            } else {
                println!("All Wrong Answers:");
                println!("  Total: 7");
                println!("  Mastered: 4");
                println!("  Still reviewing: 3");
                println!("\nTopics needing review:");
                println!("  - linear_equation: 2 problems");
                println!("  - quadratic_equation: 1 problem");
            }
        }

        Commands::Export { format, output } => {
            println!("\n💾 Data Export\n");

            match format.to_lowercase().as_str() {
                "csv" => {
                    println!("Exporting to CSV: {}", output);
                    println!("Note: In a full implementation, this would export actual data.");
                    println!("Example data would be written to the file.");
                }
                "json" => {
                    println!("Exporting to JSON: {}", output);
                    println!("Note: In a full implementation, this would export actual data.");
                    println!("Example data would be written to the file.");
                }
                _ => {
                    println!("Error: Invalid format '{}'. Use 'csv' or 'json'.", format);
                }
            }
        }
    }

    Ok(())
}
