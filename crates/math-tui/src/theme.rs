use ratatui::style::Color;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Theme {
    Dark,
    Light,
}

pub struct ThemeColors {
    pub bg: Color,
    pub fg: Color,
    pub border: Color,
    pub highlight: Color,
    pub title: Color,
    pub success: Color,
    pub error: Color,
    pub warning: Color,
    pub info: Color,
    pub muted: Color,
}

impl Theme {
    pub fn colors(self) -> ThemeColors {
        match self {
            Theme::Dark => ThemeColors {
                bg: Color::Reset,
                fg: Color::White,
                border: Color::Cyan,
                highlight: Color::Yellow,
                title: Color::Magenta,
                success: Color::Green,
                error: Color::Red,
                warning: Color::Yellow,
                info: Color::Blue,
                muted: Color::DarkGray,
            },
            Theme::Light => ThemeColors {
                bg: Color::White,
                fg: Color::Black,
                border: Color::Blue,
                highlight: Color::Magenta,
                title: Color::Blue,
                success: Color::Green,
                error: Color::Red,
                warning: Color::Yellow,
                info: Color::Cyan,
                muted: Color::Gray,
            },
        }
    }
}
