use ratatui::{
    layout::{Alignment, Constraint, Direction, Layout, Rect},
    style::{Modifier, Style},
    text::{Line, Span, Text},
    widgets::{Block, Borders, List, ListItem, Paragraph},
    Frame,
};

use crate::app::{App, AppState};

pub fn draw(f: &mut Frame, app: &App) {
    let colors = app.colors();

    match app.state {
        AppState::MainMenu => draw_main_menu(f, app),
        AppState::Calculator => crate::calculator::draw(f, app),
        AppState::Dashboard => crate::dashboard::draw(f, app),
        AppState::WrongAnswers => crate::wrong_answer::draw(f, app),
        AppState::Settings => draw_settings(f, app),
    }

    // Footer with theme indicator
    let footer_rect = Rect {
        x: 0,
        y: f.size().height.saturating_sub(1),
        width: f.size().width,
        height: 1,
    };

    let theme_text = match app.theme {
        crate::theme::Theme::Dark => "🌙 Dark",
        crate::theme::Theme::Light => "☀️  Light",
    };

    let footer = Paragraph::new(Line::from(vec![
        Span::raw("Press "),
        Span::styled("q", Style::default().fg(colors.highlight)),
        Span::raw(" to quit | Theme: "),
        Span::styled(theme_text, Style::default().fg(colors.info)),
    ]))
    .alignment(Alignment::Center)
    .style(Style::default().fg(colors.muted));

    f.render_widget(footer, footer_rect);
}

fn draw_main_menu(f: &mut Frame, app: &App) {
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
    let title = Paragraph::new(Text::from(vec![
        Line::from(Span::styled(
            "🧮 Math Helper TUI",
            Style::default()
                .fg(colors.title)
                .add_modifier(Modifier::BOLD),
        )),
        Line::from(Span::styled(
            "Interactive Terminal User Interface",
            Style::default().fg(colors.muted),
        )),
    ]))
    .alignment(Alignment::Center)
    .block(
        Block::default()
            .borders(Borders::ALL)
            .border_style(Style::default().fg(colors.border)),
    );

    f.render_widget(title, chunks[0]);

    // Menu items
    let menu_items = vec![
        "1. 📊 Calculator - Interactive problem solving",
        "2. 📈 Progress Dashboard - Track your learning",
        "3. 📝 Wrong Answers - Review mistakes",
        "4. ⚙️  Settings - Theme and preferences",
    ];

    let items: Vec<ListItem> = menu_items
        .iter()
        .enumerate()
        .map(|(i, item)| {
            let style = if i == app.menu_index {
                Style::default()
                    .fg(colors.highlight)
                    .add_modifier(Modifier::BOLD)
            } else {
                Style::default().fg(colors.fg)
            };

            let prefix = if i == app.menu_index { "▶ " } else { "  " };
            ListItem::new(Line::from(Span::styled(
                format!("{}{}", prefix, item),
                style,
            )))
        })
        .collect();

    let list = List::new(items).block(
        Block::default()
            .title("Main Menu")
            .borders(Borders::ALL)
            .border_style(Style::default().fg(colors.border)),
    );

    f.render_widget(list, chunks[1]);

    // Instructions
    let instructions = Paragraph::new(Line::from(vec![
        Span::raw("Navigate: "),
        Span::styled("↑↓", Style::default().fg(colors.info)),
        Span::raw(" or "),
        Span::styled("j/k", Style::default().fg(colors.info)),
        Span::raw(" | Select: "),
        Span::styled("Enter", Style::default().fg(colors.success)),
        Span::raw(" or "),
        Span::styled("1-4", Style::default().fg(colors.success)),
        Span::raw(" | Quit: "),
        Span::styled("q", Style::default().fg(colors.error)),
    ]))
    .alignment(Alignment::Center)
    .block(
        Block::default()
            .borders(Borders::ALL)
            .border_style(Style::default().fg(colors.border)),
    );

    f.render_widget(instructions, chunks[2]);
}

fn draw_settings(f: &mut Frame, app: &App) {
    let colors = app.colors();

    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .margin(2)
        .constraints([
            Constraint::Length(3),
            Constraint::Min(5),
            Constraint::Length(3),
        ])
        .split(f.size());

    // Title
    let title = Paragraph::new("⚙️  Settings")
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

    // Settings content
    let theme_name = match app.theme {
        crate::theme::Theme::Dark => "🌙 Dark Mode",
        crate::theme::Theme::Light => "☀️  Light Mode",
    };

    let content = Paragraph::new(Text::from(vec![
        Line::from(""),
        Line::from(vec![
            Span::raw("Current Theme: "),
            Span::styled(theme_name, Style::default().fg(colors.highlight)),
        ]),
        Line::from(""),
        Line::from(vec![
            Span::raw("Press "),
            Span::styled("t", Style::default().fg(colors.info)),
            Span::raw(" to toggle theme"),
        ]),
    ]))
    .block(
        Block::default()
            .borders(Borders::ALL)
            .border_style(Style::default().fg(colors.border)),
    );

    f.render_widget(content, chunks[1]);

    // Instructions
    let instructions = Paragraph::new(Line::from(vec![
        Span::raw("Toggle Theme: "),
        Span::styled("t", Style::default().fg(colors.info)),
        Span::raw(" | Back: "),
        Span::styled("Esc", Style::default().fg(colors.warning)),
    ]))
    .alignment(Alignment::Center)
    .block(
        Block::default()
            .borders(Borders::ALL)
            .border_style(Style::default().fg(colors.border)),
    );

    f.render_widget(instructions, chunks[2]);
}
