#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};

// ============================================
// 일차방정식
// ============================================

#[derive(Deserialize)]
struct LinearInput {
    a: f64,
    b: f64,
}

#[derive(Serialize)]
struct LinearResult {
    x: f64,
    steps: Vec<String>,
}

#[tauri::command]
fn solve_linear(input: LinearInput) -> Result<LinearResult, String> {
    if input.a == 0.0 {
        return Err("a는 0이 될 수 없습니다".to_string());
    }

    let x = -input.b / input.a;

    let steps = vec![
        format!("주어진 방정식: {}x + {} = 0", input.a, input.b),
        format!("{}x = {}", input.a, -input.b),
        format!("x = {} ÷ {}", -input.b, input.a),
        format!("∴ x = {:.4}", x),
    ];

    Ok(LinearResult { x, steps })
}

// ============================================
// 이차방정식
// ============================================

#[derive(Deserialize)]
struct QuadraticInput {
    a: f64,
    b: f64,
    c: f64,
}

#[derive(Serialize)]
struct QuadraticResult {
    has_real_roots: bool,
    x1: Option<f64>,
    x2: Option<f64>,
    discriminant: f64,
    steps: Vec<String>,
}

#[tauri::command]
fn solve_quadratic(input: QuadraticInput) -> Result<QuadraticResult, String> {
    if input.a == 0.0 {
        return Err("a는 0이 될 수 없습니다".to_string());
    }

    let d = input.b * input.b - 4.0 * input.a * input.c;

    let mut steps = vec![
        format!("주어진 방정식: {}x² + {}x + {} = 0", input.a, input.b, input.c),
        format!("판별식 D = b² - 4ac = {:.4}", d),
    ];

    let result = if d < 0.0 {
        steps.push("D < 0이므로 실근이 없습니다".to_string());
        QuadraticResult {
            has_real_roots: false,
            x1: None,
            x2: None,
            discriminant: d,
            steps,
        }
    } else if d == 0.0 {
        let x = -input.b / (2.0 * input.a);
        steps.push("D = 0이므로 중근입니다".to_string());
        steps.push(format!("x = -b / 2a = {:.4}", x));
        QuadraticResult {
            has_real_roots: true,
            x1: Some(x),
            x2: Some(x),
            discriminant: d,
            steps,
        }
    } else {
        let sqrt_d = d.sqrt();
        let x1 = (-input.b + sqrt_d) / (2.0 * input.a);
        let x2 = (-input.b - sqrt_d) / (2.0 * input.a);
        steps.push("D > 0이므로 서로 다른 두 실근이 존재합니다".to_string());
        steps.push("x = (-b ± √D) / 2a".to_string());
        steps.push(format!("∴ x₁ = {:.4}, x₂ = {:.4}", x1, x2));
        QuadraticResult {
            has_real_roots: true,
            x1: Some(x1),
            x2: Some(x2),
            discriminant: d,
            steps,
        }
    };

    Ok(result)
}

// ============================================
// 메인
// ============================================

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            solve_linear,
            solve_quadratic,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
