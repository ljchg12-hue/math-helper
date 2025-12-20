//! Math Helper CLI - 수학 계산기 명령줄 도구

use anyhow::Result;
use clap::{Parser, Subcommand};
use colored::*;
use math_core::*;

#[derive(Parser)]
#[command(name = "math-helper")]
#[command(version, about = "중학교 수학 계산기 CLI 도구", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// 일차방정식 풀이 (ax + b = 0)
    Linear {
        #[arg(help = "x의 계수 a", allow_hyphen_values = true)]
        a: f64,
        #[arg(help = "상수항 b", allow_hyphen_values = true)]
        b: f64,
    },

    /// 이차방정식 풀이 (ax² + bx + c = 0)
    Quadratic {
        #[arg(help = "x²의 계수 a", allow_hyphen_values = true)]
        a: f64,
        #[arg(help = "x의 계수 b", allow_hyphen_values = true)]
        b: f64,
        #[arg(help = "상수항 c", allow_hyphen_values = true)]
        c: f64,
    },

    /// 두 점 사이의 거리 계산
    Distance {
        #[arg(help = "첫 번째 점의 x 좌표", allow_hyphen_values = true)]
        x1: f64,
        #[arg(help = "첫 번째 점의 y 좌표", allow_hyphen_values = true)]
        y1: f64,
        #[arg(help = "두 번째 점의 x 좌표", allow_hyphen_values = true)]
        x2: f64,
        #[arg(help = "두 번째 점의 y 좌표", allow_hyphen_values = true)]
        y2: f64,
    },

    /// 통계 계산 (평균, 중앙값, 표준편차 등)
    Stats {
        #[arg(value_delimiter = ',', allow_hyphen_values = true, help = "쉼표로 구분된 숫자들 (예: 1,2,3,4,5)")]
        data: Vec<f64>,
    },

    /// 원의 넓이 계산
    Circle {
        #[arg(help = "반지름")]
        radius: f64,
    },

    /// 삼각형 넓이 계산 (밑변과 높이)
    Triangle {
        #[arg(help = "밑변")]
        base: f64,
        #[arg(help = "높이")]
        height: f64,
    },

    /// 피타고라스 정리 (a² + b² = c²)
    Pythagorean {
        #[arg(help = "첫 번째 변 a (0이면 계산됨)")]
        a: f64,
        #[arg(help = "두 번째 변 b (0이면 계산됨)")]
        b: f64,
        #[arg(help = "빗변 c (0이면 계산됨)")]
        c: f64,
    },

    /// 사다리꼴 넓이 계산
    Trapezoid {
        #[arg(help = "윗변")]
        upper: f64,
        #[arg(help = "아랫변")]
        lower: f64,
        #[arg(help = "높이")]
        height: f64,
    },
}

fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Linear { a, b } => handle_linear(a, b)?,
        Commands::Quadratic { a, b, c } => handle_quadratic(a, b, c)?,
        Commands::Distance { x1, y1, x2, y2 } => handle_distance(x1, y1, x2, y2)?,
        Commands::Stats { data } => handle_stats(&data)?,
        Commands::Circle { radius } => handle_circle(radius)?,
        Commands::Triangle { base, height } => handle_triangle(base, height)?,
        Commands::Pythagorean { a, b, c } => handle_pythagorean(a, b, c)?,
        Commands::Trapezoid {
            upper,
            lower,
            height,
        } => handle_trapezoid(upper, lower, height)?,
    }

    Ok(())
}

fn handle_linear(a: f64, b: f64) -> Result<()> {
    println!("{}", "=== 일차방정식 풀이 ===".bright_cyan().bold());
    println!();

    match solve_linear_equation(a, b) {
        Ok(result) => {
            println!("{} {}", "방정식:".bright_green(), result.equation);
            println!();
            println!("{}", "풀이 과정:".bright_yellow());
            for (i, step) in result.steps.iter().enumerate() {
                println!("  {}. {}", i + 1, step);
            }
            println!();
            println!(
                "{} x = {}",
                "해:".bright_green().bold(),
                result.solution.to_string().bright_white().bold()
            );
        }
        Err(e) => {
            eprintln!("{} {}", "에러:".bright_red().bold(), e);
            std::process::exit(1);
        }
    }

    Ok(())
}

fn handle_quadratic(a: f64, b: f64, c: f64) -> Result<()> {
    println!("{}", "=== 이차방정식 풀이 ===".bright_cyan().bold());
    println!();

    match solve_quadratic_equation(a, b, c) {
        Ok(result) => {
            println!("{} {}", "방정식:".bright_green(), result.equation);
            println!(
                "{} D = {}",
                "판별식:".bright_yellow(),
                result.discriminant
            );
            println!();
            println!("{}", "풀이 과정:".bright_yellow());
            for (i, step) in result.steps.iter().enumerate() {
                println!("  {}. {}", i + 1, step);
            }
            println!();

            match result.solution {
                QuadraticSolution::NoRealRoots { .. } => {
                    println!(
                        "{} {}",
                        "결과:".bright_red().bold(),
                        "실근이 없습니다".bright_white()
                    );
                }
                QuadraticSolution::OneRoot { root } => {
                    println!(
                        "{} x = {} (중근)",
                        "해:".bright_green().bold(),
                        root.to_string().bright_white().bold()
                    );
                }
                QuadraticSolution::TwoRoots { root1, root2 } => {
                    println!(
                        "{} x₁ = {}, x₂ = {}",
                        "해:".bright_green().bold(),
                        root1.to_string().bright_white().bold(),
                        root2.to_string().bright_white().bold()
                    );
                }
            }
        }
        Err(e) => {
            eprintln!("{} {}", "에러:".bright_red().bold(), e);
            std::process::exit(1);
        }
    }

    Ok(())
}

fn handle_distance(x1: f64, y1: f64, x2: f64, y2: f64) -> Result<()> {
    println!("{}", "=== 두 점 사이의 거리 ===".bright_cyan().bold());
    println!();

    let p1 = Point::new(x1, y1);
    let p2 = Point::new(x2, y2);
    let distance = p1.distance_to(&p2);

    println!("{} P1({}, {})", "첫 번째 점:".bright_green(), x1, y1);
    println!("{} P2({}, {})", "두 번째 점:".bright_green(), x2, y2);
    println!();
    println!(
        "{} √[({}−{})² + ({}−{})²]",
        "공식:".bright_yellow(),
        x2,
        x1,
        y2,
        y1
    );
    println!("     = √[{}² + {}²]", x2 - x1, y2 - y1);
    println!("     = √{}", (x2 - x1).powi(2) + (y2 - y1).powi(2));
    println!();
    println!(
        "{} {}",
        "거리:".bright_green().bold(),
        distance.to_string().bright_white().bold()
    );

    Ok(())
}

fn handle_stats(data: &[f64]) -> Result<()> {
    println!("{}", "=== 통계 계산 ===".bright_cyan().bold());
    println!();

    if data.is_empty() {
        eprintln!(
            "{} 데이터가 비어있습니다",
            "에러:".bright_red().bold()
        );
        std::process::exit(1);
    }

    println!("{} {:?}", "데이터:".bright_green(), data);
    println!("{} {} 개", "데이터 개수:".bright_green(), data.len());
    println!();

    match mean(data) {
        Ok(m) => println!("{} {}", "평균:".bright_yellow(), m),
        Err(e) => eprintln!("평균 계산 에러: {}", e),
    }

    match median(data) {
        Ok(m) => println!("{} {}", "중앙값:".bright_yellow(), m),
        Err(e) => eprintln!("중앙값 계산 에러: {}", e),
    }

    match mode(data) {
        Ok(modes) => {
            if modes.len() == 1 {
                println!("{} {}", "최빈값:".bright_yellow(), modes[0]);
            } else {
                println!("{} {:?}", "최빈값:".bright_yellow(), modes);
            }
        }
        Err(e) => eprintln!("최빈값 계산 에러: {}", e),
    }

    match variance(data, false) {
        Ok(v) => println!("{} {}", "분산 (모집단):".bright_yellow(), v),
        Err(e) => eprintln!("분산 계산 에러: {}", e),
    }

    if data.len() >= 2 {
        match variance(data, true) {
            Ok(v) => println!("{} {}", "분산 (표본):".bright_yellow(), v),
            Err(e) => eprintln!("표본 분산 계산 에러: {}", e),
        }
    }

    match std_dev(data, false) {
        Ok(s) => println!("{} {}", "표준편차 (모집단):".bright_yellow(), s),
        Err(e) => eprintln!("표준편차 계산 에러: {}", e),
    }

    if data.len() >= 2 {
        match std_dev(data, true) {
            Ok(s) => println!("{} {}", "표준편차 (표본):".bright_yellow(), s),
            Err(e) => eprintln!("표본 표준편차 계산 에러: {}", e),
        }
    }

    match range(data) {
        Ok(r) => println!("{} {}", "범위:".bright_yellow(), r),
        Err(e) => eprintln!("범위 계산 에러: {}", e),
    }

    if data.len() >= 4 {
        match quartiles(data) {
            Ok(q) => {
                println!();
                println!("{}", "사분위수:".bright_cyan());
                println!("  Q1 (25%): {}", q.q1);
                println!("  Q2 (50%): {}", q.q2);
                println!("  Q3 (75%): {}", q.q3);
                println!("  IQR: {}", q.q3 - q.q1);
            }
            Err(e) => eprintln!("사분위수 계산 에러: {}", e),
        }
    }

    Ok(())
}

fn handle_circle(radius: f64) -> Result<()> {
    println!("{}", "=== 원의 넓이 ===".bright_cyan().bold());
    println!();

    match circle_area(radius) {
        Ok(result) => {
            println!("{} r = {}", "반지름:".bright_green(), radius);
            println!("{} {}", "공식:".bright_yellow(), result.formula);
            println!();
            println!("{}", "계산 과정:".bright_yellow());
            for (i, step) in result.steps.iter().enumerate() {
                println!("  {}. {}", i + 1, step);
            }
            println!();
            println!(
                "{} {}",
                "넓이:".bright_green().bold(),
                result.result.to_string().bright_white().bold()
            );
        }
        Err(e) => {
            eprintln!("{} {}", "에러:".bright_red().bold(), e);
            std::process::exit(1);
        }
    }

    Ok(())
}

fn handle_triangle(base: f64, height: f64) -> Result<()> {
    println!("{}", "=== 삼각형 넓이 ===".bright_cyan().bold());
    println!();

    match triangle_area(base, height) {
        Ok(result) => {
            println!("{} {}", "밑변:".bright_green(), base);
            println!("{} {}", "높이:".bright_green(), height);
            println!("{} {}", "공식:".bright_yellow(), result.formula);
            println!();
            println!("{}", "계산 과정:".bright_yellow());
            for (i, step) in result.steps.iter().enumerate() {
                println!("  {}. {}", i + 1, step);
            }
            println!();
            println!(
                "{} {}",
                "넓이:".bright_green().bold(),
                result.result.to_string().bright_white().bold()
            );
        }
        Err(e) => {
            eprintln!("{} {}", "에러:".bright_red().bold(), e);
            std::process::exit(1);
        }
    }

    Ok(())
}

fn handle_pythagorean(a: f64, b: f64, c: f64) -> Result<()> {
    println!("{}", "=== 피타고라스 정리 ===".bright_cyan().bold());
    println!();

    match pythagorean_theorem(a, b, c) {
        Ok(result) => {
            println!("{} a = {}, b = {}, c = {}", "주어진 값:".bright_green(), a, b, c);
            println!("{} {}", "공식:".bright_yellow(), result.formula);
            println!();
            println!("{}", "계산 과정:".bright_yellow());
            for (i, step) in result.steps.iter().enumerate() {
                println!("  {}. {}", i + 1, step);
            }
            println!();
            println!(
                "{} {}",
                "결과:".bright_green().bold(),
                result.result.to_string().bright_white().bold()
            );
        }
        Err(e) => {
            eprintln!("{} {}", "에러:".bright_red().bold(), e);
            std::process::exit(1);
        }
    }

    Ok(())
}

fn handle_trapezoid(upper: f64, lower: f64, height: f64) -> Result<()> {
    println!("{}", "=== 사다리꼴 넓이 ===".bright_cyan().bold());
    println!();

    match trapezoid_area(upper, lower, height) {
        Ok(result) => {
            println!("{} {}", "윗변:".bright_green(), upper);
            println!("{} {}", "아랫변:".bright_green(), lower);
            println!("{} {}", "높이:".bright_green(), height);
            println!("{} {}", "공식:".bright_yellow(), result.formula);
            println!();
            println!("{}", "계산 과정:".bright_yellow());
            for (i, step) in result.steps.iter().enumerate() {
                println!("  {}. {}", i + 1, step);
            }
            println!();
            println!(
                "{} {}",
                "넓이:".bright_green().bold(),
                result.result.to_string().bright_white().bold()
            );
        }
        Err(e) => {
            eprintln!("{} {}", "에러:".bright_red().bold(), e);
            std::process::exit(1);
        }
    }

    Ok(())
}
