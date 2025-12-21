use ratatui::{
    layout::Rect,
    style::{Modifier, Style},
    text::{Line, Span},
    widgets::{Block, Borders, Paragraph},
    Frame,
};

use crate::app::App;

/// Draw a simple ASCII bar chart
pub fn draw_bar_chart(
    f: &mut Frame,
    area: Rect,
    data: &[(&str, u8)],
    title: &str,
    app: &App,
) {
    let colors = app.colors();

    let max_value = data.iter().map(|(_, v)| *v).max().unwrap_or(100);
    let bar_width: usize = 20;

    let mut lines = vec![Line::from("")];

    for (label, value) in data {
        let filled = (((*value as f64) / (max_value as f64)) * (bar_width as f64)) as usize;
        let empty = bar_width.saturating_sub(filled);

        let bar_filled = "█".repeat(filled);
        let bar_empty = "░".repeat(empty);

        lines.push(Line::from(vec![
            Span::styled(
                format!("{:.<12} ", label),
                Style::default().fg(colors.muted),
            ),
            Span::styled(bar_filled, Style::default().fg(colors.success)),
            Span::styled(bar_empty, Style::default().fg(colors.muted)),
            Span::styled(
                format!(" {}%", value),
                Style::default()
                    .fg(colors.highlight)
                    .add_modifier(Modifier::BOLD),
            ),
        ]));
    }

    lines.push(Line::from(""));

    let content = Paragraph::new(lines).block(
        Block::default()
            .title(title)
            .borders(Borders::ALL)
            .border_style(Style::default().fg(colors.border)),
    );

    f.render_widget(content, area);
}

/// Draw a simple ASCII line graph (sparkline-style)
pub fn draw_sparkline(data: &[u8], width: usize) -> String {
    if data.is_empty() {
        return String::new();
    }

    let max = *data.iter().max().unwrap_or(&1);
    let min = *data.iter().min().unwrap_or(&0);
    let range = max - min;

    if range == 0 {
        return "─".repeat(width);
    }

    let chars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
    let mut result = String::new();

    for value in data.iter().take(width) {
        let normalized = ((value - min) as f64 / range as f64) * (chars.len() - 1) as f64;
        let index = normalized.round() as usize;
        result.push(chars[index]);
    }

    result
}
