use anyhow::Result;
use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode, KeyEventKind},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{
    backend::CrosstermBackend,
    Terminal,
};
use std::io;

mod app;
mod calculator;
mod dashboard;
mod event_handler;
mod graph;
mod step_solver;
mod theme;
mod ui;
mod wrong_answer;

use app::{App, AppState};

fn main() -> Result<()> {
    // Setup terminal
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    // Create app state
    let mut app = App::new();
    let result = run_app(&mut terminal, &mut app);

    // Restore terminal
    disable_raw_mode()?;
    execute!(
        terminal.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    if let Err(err) = result {
        eprintln!("Error: {}", err);
    }

    Ok(())
}

fn run_app<B: ratatui::backend::Backend>(
    terminal: &mut Terminal<B>,
    app: &mut App,
) -> Result<()> {
    loop {
        terminal.draw(|f| ui::draw(f, app))?;

        if let Event::Key(key) = event::read()? {
            if key.kind == KeyEventKind::Press {
                match app.state {
                    AppState::MainMenu => {
                        if handle_main_menu_input(app, key.code) {
                            break;
                        }
                    }
                    AppState::Calculator => {
                        if calculator::handle_input(app, key.code) {
                            app.state = AppState::MainMenu;
                        }
                    }
                    AppState::Dashboard => {
                        if dashboard::handle_input(app, key.code) {
                            app.state = AppState::MainMenu;
                        }
                    }
                    AppState::WrongAnswers => {
                        if wrong_answer::handle_input(app, key.code) {
                            app.state = AppState::MainMenu;
                        }
                    }
                    AppState::Settings => {
                        if handle_settings_input(app, key.code) {
                            app.state = AppState::MainMenu;
                        }
                    }
                }
            }
        }
    }

    Ok(())
}

fn handle_main_menu_input(app: &mut App, key: KeyCode) -> bool {
    match key {
        KeyCode::Char('q') | KeyCode::Esc => return true,
        KeyCode::Char('1') => app.state = AppState::Calculator,
        KeyCode::Char('2') => app.state = AppState::Dashboard,
        KeyCode::Char('3') => app.state = AppState::WrongAnswers,
        KeyCode::Char('4') => app.state = AppState::Settings,
        KeyCode::Down | KeyCode::Char('j') => {
            app.menu_index = (app.menu_index + 1).min(3);
        }
        KeyCode::Up | KeyCode::Char('k') => {
            app.menu_index = app.menu_index.saturating_sub(1);
        }
        KeyCode::Enter => match app.menu_index {
            0 => app.state = AppState::Calculator,
            1 => app.state = AppState::Dashboard,
            2 => app.state = AppState::WrongAnswers,
            3 => app.state = AppState::Settings,
            _ => {}
        },
        _ => {}
    }
    false
}

fn handle_settings_input(app: &mut App, key: KeyCode) -> bool {
    match key {
        KeyCode::Char('q') | KeyCode::Esc => return true,
        KeyCode::Char('t') => app.toggle_theme(),
        _ => {}
    }
    false
}
