use crossterm::event::KeyCode;
use ratatui::{
    layout::{Alignment, Constraint, Direction, Layout},
    style::{Modifier, Style},
    text::{Line, Span, Text},
    widgets::{Block, Borders, List, ListItem, Paragraph},
    Frame,
};

use crate::app::App;

pub fn draw(f: &mut Frame, app: &App) {
    let colors = app.colors();

    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .margin(2)
        .constraints([
            Constraint::Length(3),
            Constraint::Min(10),
            Constraint::Length(5),
            Constraint::Length(3),
        ])
        .split(f.size());

    // Title
    let title = Paragraph::new("📝 Wrong Answer Review")
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

    // Wrong answers list
    draw_wrong_answers_list(f, chunks[1], app);

    // Selected answer detail
    draw_answer_detail(f, chunks[2], app);

    // Instructions
    let instructions = Paragraph::new(Line::from(vec![
        Span::raw("Navigate: "),
        Span::styled("↑↓", Style::default().fg(colors.info)),
        Span::raw(" | Review: "),
        Span::styled("Enter", Style::default().fg(colors.success)),
        Span::raw(" | Mark Reviewed: "),
        Span::styled("r", Style::default().fg(colors.warning)),
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

fn draw_wrong_answers_list(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    let colors = app.colors();

    // Mock data - in real app, this would come from WrongAnswerNote
    let wrong_answers = vec![
        ("Linear Eq: 2x + 3 = 7", "2 reviews", "⚠️"),
        ("Quadratic: x² - 5x + 6 = 0", "1 review", "⚠️"),
        ("Geometry: Area of circle r=5", "3 reviews", "✓"),
        ("Statistics: Mean of [1,2,3,4,5]", "1 review", "⚠️"),
    ];

    let items: Vec<ListItem> = wrong_answers
        .iter()
        .enumerate()
        .map(|(i, (problem, reviews, status))| {
            let style = if i == app.wrong_answers_selected {
                Style::default()
                    .fg(colors.highlight)
                    .add_modifier(Modifier::BOLD)
            } else {
                Style::default().fg(colors.fg)
            };

            let prefix = if i == app.wrong_answers_selected {
                "▶ "
            } else {
                "  "
            };

            ListItem::new(Line::from(vec![
                Span::styled(prefix, style),
                Span::styled(
                    format!("{} ", status),
                    Style::default().fg(if *status == "✓" {
                        colors.success
                    } else {
                        colors.warning
                    }),
                ),
                Span::styled(format!("{} ", problem), style),
                Span::styled(
                    format!("({})", reviews),
                    Style::default().fg(colors.muted),
                ),
            ]))
        })
        .collect();

    let list = List::new(items).block(
        Block::default()
            .title(format!("Wrong Answers ({} total)", wrong_answers.len()))
            .borders(Borders::ALL)
            .border_style(Style::default().fg(colors.border)),
    );

    f.render_widget(list, area);
}

fn draw_answer_detail(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    let colors = app.colors();

    // Mock data for selected answer
    let detail_lines = vec![
        Line::from(""),
        Line::from(vec![
            Span::styled("Problem: ", Style::default().fg(colors.info)),
            Span::raw("2x + 3 = 7"),
        ]),
        Line::from(vec![
            Span::styled("Your Answer: ", Style::default().fg(colors.error)),
            Span::raw("x = 3 ✗"),
        ]),
        Line::from(vec![
            Span::styled("Correct Answer: ", Style::default().fg(colors.success)),
            Span::raw("x = 2 ✓"),
        ]),
        Line::from(""),
        Line::from(vec![
            Span::styled("Common Mistake: ", Style::default().fg(colors.warning)),
            Span::raw("Forgot to subtract 3 from both sides"),
        ]),
    ];

    let content = Paragraph::new(Text::from(detail_lines)).block(
        Block::default()
            .title("Answer Analysis")
            .borders(Borders::ALL)
            .border_style(Style::default().fg(colors.border)),
    );

    f.render_widget(content, area);
}

pub fn handle_input(app: &mut App, key: KeyCode) -> bool {
    match key {
        KeyCode::Esc | KeyCode::Char('q') => return true,
        KeyCode::Up | KeyCode::Char('k') => {
            app.wrong_answers_selected = app.wrong_answers_selected.saturating_sub(1);
        }
        KeyCode::Down | KeyCode::Char('j') => {
            app.wrong_answers_selected = (app.wrong_answers_selected + 1).min(3);
        }
        KeyCode::Char('r') => {
            // Mark as reviewed (in real app, would update WrongAnswerNote)
        }
        _ => {}
    }
    false
}
