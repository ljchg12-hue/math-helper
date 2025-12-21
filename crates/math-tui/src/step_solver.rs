/// Generate step-by-step solution for linear equation: ax + b = c
pub fn solve_linear_steps(a: f64, b: f64, c: f64) -> Vec<String> {
    let mut steps = Vec::new();

    steps.push(format!("Given equation: {}x + {} = {}", a, b, c));

    // Step 1: Move constant to right side
    let c_minus_b = c - b;
    steps.push(format!("Subtract {} from both sides:", b));
    steps.push(format!("  {}x = {} - {}", a, c, b));
    steps.push(format!("  {}x = {}", a, c_minus_b));

    // Step 2: Divide by coefficient
    if a != 0.0 {
        let x = c_minus_b / a;
        steps.push(format!("Divide both sides by {}:", a));
        steps.push(format!("  x = {} / {}", c_minus_b, a));
        steps.push(format!("  x = {:.4}", x));
    } else {
        steps.push("Error: a cannot be zero".to_string());
    }

    // Step 3: Verification
    if a != 0.0 {
        let x = c_minus_b / a;
        let left_side = a * x + b;
        steps.push(format!("\nVerification:"));
        steps.push(format!("  {}({:.4}) + {} = {:.4}", a, x, b, left_side));
        steps.push(format!("  {:.4} ≈ {} ✓", left_side, c));
    }

    steps
}

/// Generate step-by-step solution for quadratic equation: ax² + bx + c = 0
pub fn solve_quadratic_steps(a: f64, b: f64, c: f64) -> Vec<String> {
    let mut steps = Vec::new();

    steps.push(format!("Given equation: {}x² + {}x + {} = 0", a, b, c));

    // Discriminant
    let discriminant = b * b - 4.0 * a * c;
    steps.push(format!("\nStep 1: Calculate discriminant"));
    steps.push(format!("  Δ = b² - 4ac"));
    steps.push(format!("  Δ = ({})² - 4({})({}) ", b, a, c));
    steps.push(format!("  Δ = {:.4}", discriminant));

    if discriminant > 0.0 {
        steps.push("\nΔ > 0: Two distinct real roots".to_string());
        let sqrt_d = discriminant.sqrt();
        let x1 = (-b + sqrt_d) / (2.0 * a);
        let x2 = (-b - sqrt_d) / (2.0 * a);

        steps.push(format!("\nStep 2: Apply quadratic formula"));
        steps.push(format!("  x = (-b ± √Δ) / 2a"));
        steps.push(format!("  x₁ = ({} + {:.4}) / {}", -b, sqrt_d, 2.0 * a));
        steps.push(format!("  x₁ = {:.4}", x1));
        steps.push(format!("  x₂ = ({} - {:.4}) / {}", -b, sqrt_d, 2.0 * a));
        steps.push(format!("  x₂ = {:.4}", x2));
    } else if discriminant == 0.0 {
        steps.push("\nΔ = 0: One repeated real root".to_string());
        let x = -b / (2.0 * a);
        steps.push(format!("  x = -b / 2a"));
        steps.push(format!("  x = {} / {}", -b, 2.0 * a));
        steps.push(format!("  x = {:.4}", x));
    } else {
        steps.push("\nΔ < 0: Two complex conjugate roots".to_string());
        let real_part = -b / (2.0 * a);
        let imag_part = (-discriminant).sqrt() / (2.0 * a);
        steps.push(format!("  x₁ = {:.4} + {:.4}i", real_part, imag_part));
        steps.push(format!("  x₂ = {:.4} - {:.4}i", real_part, imag_part));
    }

    steps
}
