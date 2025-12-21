use crossterm::event::KeyCode;
use ratatui::{
    layout::{Alignment, Constraint, Direction, Layout},
    style::{Modifier, Style},
    text::{Line, Span},
    widgets::{Block, Borders, Paragraph},
    Frame,
};

use crate::app::App;
use crate::graph::draw_bar_chart;

pub fn draw(f: &mut Frame, app: &App) {
    let colors = app.colors();

    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .margin(2)
        .constraints([
            Constraint::Length(3),
            Constraint::Min(10),
            Constraint::Length(3),
        ])
        .split(f.size());

    // Title
    let title = Paragraph::new("📈 Learning Progress Dashboard")
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

    // Content area
    let content_chunks = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([Constraint::Percentage(50), Constraint::Percentage(50)])
        .split(chunks[1]);

    // Left: Statistics
    draw_statistics(f, content_chunks[0], app);

    // Right: Progress chart
    draw_progress_chart(f, content_chunks[1], app);

    // Instructions
    let instructions = Paragraph::new(Line::from(vec![
        Span::raw("Navigate Topics: "),
        Span::styled("↑↓", Style::default().fg(colors.info)),
        Span::raw(" | Back: "),
        Span::styled("Esc", Style::default().fg(colors.error)),
    ]))
    .alignment(Alignment::Center)
    .block(
        Block::default()
            .borders(Borders::ALL)
            .border_style(Style::default().fg(colors.border)),
    );

    f.render_widget(instructions, chunks[2]);
}

fn draw_statistics(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    let colors = app.colors();

    // Mock data - in real app, this would come from ProgressTracker
    let stats = vec![
        ("Total Problems Solved", "127"),
        ("Correct Answers", "98"),
        ("Accuracy Rate", "77.2%"),
        ("Current Streak", "12 days"),
        ("Total Study Time", "15h 32m"),
        ("Average Score", "84.5/100"),
    ];

    let mut lines = vec![Line::from("")];

    for (label, value) in stats {
        lines.push(Line::from(vec![
            Span::styled(
                format!("{:.<25} ", label),
                Style::default().fg(colors.muted),
            ),
            Span::styled(value, Style::default().fg(colors.highlight)),
        ]));
    }

    lines.push(Line::from(""));
    lines.push(Line::from(""));
    lines.push(Line::from(Span::styled(
        "🔥 Keep up the great work!",
        Style::default()
            .fg(colors.success)
            .add_modifier(Modifier::BOLD),
    )));

    let content = Paragraph::new(lines).block(
        Block::default()
            .title("Overall Statistics")
            .borders(Borders::ALL)
            .border_style(Style::default().fg(colors.border)),
    );

    f.render_widget(content, area);
}

fn draw_progress_chart(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    // Mock data - topic accuracy
    let topics = vec![
        ("Linear Eq.", 85),
        ("Quadratic", 72),
        ("Geometry", 91),
        ("Statistics", 68),
        ("Calculus", 78),
    ];

    draw_bar_chart(f, area, &topics, "Topic Accuracy (%)", app);
}

pub fn handle_input(_app: &mut App, key: KeyCode) -> bool {
    matches!(key, KeyCode::Esc | KeyCode::Char('q'))
}
