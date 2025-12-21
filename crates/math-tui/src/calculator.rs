use crossterm::event::KeyCode;
use ratatui::{
    layout::{Alignment, Constraint, Direction, Layout},
    style::{Modifier, Style},
    text::{Line, Span, Text},
    widgets::{Block, Borders, List, ListItem, Paragraph},
    Frame,
};

use crate::app::{App, CalculatorMode};

pub fn draw(f: &mut Frame, app: &App) {
    let colors = app.colors();

    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .margin(2)
        .constraints([
            Constraint::Length(3),
            Constraint::Length(7),
            Constraint::Min(8),
            Constraint::Length(3),
        ])
        .split(f.size());

    // Title
    let title = Paragraph::new("📊 Interactive Calculator")
        .style(
            Style::default()
                .fg(colors.title)
                .add_modifier(Modifier::BOLD),
        )
        .alignment(Alignment::Center)
        .block(
            Block::default()
                .borders(Borders::ALL)
                .border_style(Style::default().fg(colors.border)),
        );

    f.render_widget(title, chunks[0]);

    // Calculator type selection
    let calc_types = vec![
        "1. Linear Equation (ax + b = c)",
        "2. Quadratic Equation (ax² + bx + c = 0)",
        "3. Geometry (Area, Volume, Pythagorean)",
        "4. Statistics (Mean, Median, Mode, StdDev)",
    ];

    let items: Vec<ListItem> = calc_types
        .iter()
        .enumerate()
        .map(|(i, item)| {
            let style = if i == app.calculator_index {
                Style::default()
                    .fg(colors.highlight)
                    .add_modifier(Modifier::BOLD)
            } else {
                Style::default().fg(colors.fg)
            };

            let prefix = if i == app.calculator_index {
                "▶ "
            } else {
                "  "
            };
            ListItem::new(Line::from(Span::styled(
                format!("{}{}", prefix, item),
                style,
            )))
        })
        .collect();

    let list = List::new(items).block(
        Block::default()
            .title("Select Calculator Type")
            .borders(Borders::ALL)
            .border_style(Style::default().fg(colors.border)),
    );

    f.render_widget(list, chunks[1]);

    // Input/Output area
    draw_calculator_content(f, chunks[2], app);

    // Instructions
    let instructions = Paragraph::new(Line::from(vec![
        Span::raw("Navigate: "),
        Span::styled("↑↓ / j/k", Style::default().fg(colors.info)),
        Span::raw(" | Select: "),
        Span::styled("Enter", Style::default().fg(colors.success)),
        Span::raw(" | Steps: "),
        Span::styled("s", Style::default().fg(colors.info)),
        Span::raw(" | Clear: "),
        Span::styled("c", Style::default().fg(colors.warning)),
        Span::raw(" | Back: "),
        Span::styled("Esc", Style::default().fg(colors.error)),
    ]))
    .alignment(Alignment::Center)
    .block(
        Block::default()
            .borders(Borders::ALL)
            .border_style(Style::default().fg(colors.border)),
    );

    f.render_widget(instructions, chunks[3]);
}

fn draw_calculator_content(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    match app.calculator_mode {
        CalculatorMode::Linear => draw_linear_calculator(f, area, app),
        CalculatorMode::Quadratic => draw_quadratic_calculator(f, area, app),
        CalculatorMode::Geometry => draw_geometry_calculator(f, area, app),
        CalculatorMode::Statistics => draw_statistics_calculator(f, area, app),
    }
}

fn draw_linear_calculator(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    let colors = app.colors();

    let mut lines = vec![
        Line::from(""),
        Line::from(Span::styled(
            "Linear Equation: ax + b = c",
            Style::default().fg(colors.title),
        )),
        Line::from(""),
    ];

    // Input fields
    let field_names = ["a (coefficient)", "b (constant)", "c (right side)"];
    let empty_string = String::new();
    for (i, name) in field_names.iter().enumerate() {
        let value = app.input_fields.get(i).unwrap_or(&empty_string);
        let is_current = i == app.current_field;

        let style = if is_current {
            Style::default()
                .fg(colors.highlight)
                .add_modifier(Modifier::BOLD)
        } else {
            Style::default().fg(colors.fg)
        };

        let prefix = if is_current { "▶ " } else { "  " };
        lines.push(Line::from(vec![
            Span::raw(prefix),
            Span::styled(format!("{}: ", name), style),
            Span::styled(
                if value.is_empty() {
                    "_".to_string()
                } else {
                    value.clone()
                },
                Style::default().fg(colors.info),
            ),
        ]));
    }

    lines.push(Line::from(""));

    // Result
    if let Some(result) = &app.calculation_result {
        lines.push(Line::from(vec![
            Span::styled("Result: ", Style::default().fg(colors.success)),
            Span::styled(result, Style::default().fg(colors.highlight)),
        ]));
    }

    // Solution steps
    if app.show_steps && !app.solution_steps.is_empty() {
        lines.push(Line::from(""));
        lines.push(Line::from(Span::styled(
            "Solution Steps:",
            Style::default()
                .fg(colors.info)
                .add_modifier(Modifier::BOLD),
        )));
        for step in &app.solution_steps {
            lines.push(Line::from(Span::styled(
                format!("  • {}", step),
                Style::default().fg(colors.muted),
            )));
        }
    }

    let content = Paragraph::new(Text::from(lines)).block(
        Block::default()
            .title("Input Values")
            .borders(Borders::ALL)
            .border_style(Style::default().fg(colors.border)),
    );

    f.render_widget(content, area);
}

fn draw_quadratic_calculator(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    let colors = app.colors();
    let content = Paragraph::new("Quadratic calculator (coming soon)")
        .style(Style::default().fg(colors.muted))
        .block(
            Block::default()
                .borders(Borders::ALL)
                .border_style(Style::default().fg(colors.border)),
        );
    f.render_widget(content, area);
}

fn draw_geometry_calculator(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    let colors = app.colors();
    let content = Paragraph::new("Geometry calculator (coming soon)")
        .style(Style::default().fg(colors.muted))
        .block(
            Block::default()
                .borders(Borders::ALL)
                .border_style(Style::default().fg(colors.border)),
        );
    f.render_widget(content, area);
}

fn draw_statistics_calculator(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    let colors = app.colors();
    let content = Paragraph::new("Statistics calculator (coming soon)")
        .style(Style::default().fg(colors.muted))
        .block(
            Block::default()
                .borders(Borders::ALL)
                .border_style(Style::default().fg(colors.border)),
        );
    f.render_widget(content, area);
}

pub fn handle_input(app: &mut App, key: KeyCode) -> bool {
    match key {
        KeyCode::Esc => return true,
        KeyCode::Up | KeyCode::Char('k') => {
            app.calculator_index = app.calculator_index.saturating_sub(1);
        }
        KeyCode::Down | KeyCode::Char('j') => {
            app.calculator_index = (app.calculator_index + 1).min(3);
        }
        KeyCode::Char('1') => app.calculator_mode = CalculatorMode::Linear,
        KeyCode::Char('2') => app.calculator_mode = CalculatorMode::Quadratic,
        KeyCode::Char('3') => app.calculator_mode = CalculatorMode::Geometry,
        KeyCode::Char('4') => app.calculator_mode = CalculatorMode::Statistics,
        KeyCode::Char('s') => app.show_steps = !app.show_steps,
        KeyCode::Char('c') => app.reset_calculator(),
        KeyCode::Tab => {
            app.current_field = (app.current_field + 1) % app.input_fields.len();
        }
        KeyCode::Char(c) if c.is_ascii_digit() || c == '.' || c == '-' => {
            if let Some(field) = app.input_fields.get_mut(app.current_field) {
                field.push(c);
            }
        }
        KeyCode::Backspace => {
            if let Some(field) = app.input_fields.get_mut(app.current_field) {
                field.pop();
            }
        }
        KeyCode::Enter => {
            calculate_result(app);
        }
        _ => {}
    }
    false
}

fn calculate_result(app: &mut App) {
    use math_core::linear_equation::solve_linear_equation;

    match app.calculator_mode {
        CalculatorMode::Linear => {
            let a = app.input_fields[0].parse::<f64>().ok();
            let b = app.input_fields[1].parse::<f64>().ok();
            let c = app.input_fields[2].parse::<f64>().ok();

            if let (Some(a), Some(b), Some(c)) = (a, b, c) {
                match solve_linear_equation(a, b, c) {
                    Ok(solution) => {
                        use math_core::linear_equation::SolutionType;
                        let result_text = match solution.solution_type {
                            SolutionType::Unique(x) => format!("x = {:.4}", x),
                            SolutionType::Infinite => "Infinite solutions (identity)".to_string(),
                            SolutionType::None => "No solution (contradiction)".to_string(),
                        };
                        app.calculation_result = Some(result_text);
                        app.solution_steps = crate::step_solver::solve_linear_steps(a, b, c);
                    }
                    Err(e) => {
                        app.calculation_result = Some(format!("Error: {}", e));
                        app.solution_steps.clear();
                    }
                }
            } else {
                app.calculation_result = Some("Error: Invalid input".to_string());
                app.solution_steps.clear();
            }
        }
        _ => {
            app.calculation_result = Some("Not implemented yet".to_string());
        }
    }
}
