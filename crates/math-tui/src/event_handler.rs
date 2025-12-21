use crossterm::event::KeyCode;

pub fn is_quit_key(key: KeyCode) -> bool {
    matches!(key, KeyCode::Char('q') | KeyCode::Esc)
}

pub fn is_navigation_key(key: KeyCode) -> bool {
    matches!(
        key,
        KeyCode::Up
            | KeyCode::Down
            | KeyCode::Left
            | KeyCode::Right
            | KeyCode::Char('h')
            | KeyCode::Char('j')
            | KeyCode::Char('k')
            | KeyCode::Char('l')
    )
}

pub fn is_confirm_key(key: KeyCode) -> bool {
    matches!(key, KeyCode::Enter)
}

pub fn is_digit(key: KeyCode) -> Option<char> {
    match key {
        KeyCode::Char(c) if c.is_ascii_digit() => Some(c),
        _ => None,
    }
}

pub fn is_backspace(key: KeyCode) -> bool {
    matches!(key, KeyCode::Backspace)
}

pub fn char_from_key(key: KeyCode) -> Option<char> {
    match key {
        KeyCode::Char(c) => Some(c),
        _ => None,
    }
}
