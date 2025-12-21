use crate::theme::{Theme, ThemeColors};

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AppState {
    MainMenu,
    Calculator,
    Dashboard,
    WrongAnswers,
    Settings,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum CalculatorMode {
    Linear,
    Quadratic,
    Geometry,
    Statistics,
}

pub struct App {
    pub state: AppState,
    pub menu_index: usize,
    pub theme: Theme,

    // Calculator state
    pub calculator_mode: CalculatorMode,
    pub calculator_index: usize,
    pub input_buffer: String,
    pub input_fields: Vec<String>,
    pub current_field: usize,
    pub calculation_result: Option<String>,
    pub show_steps: bool,
    pub solution_steps: Vec<String>,

    // Dashboard state
    pub dashboard_selected: usize,

    // Wrong answers state
    pub wrong_answers_selected: usize,
}

impl Default for App {
    fn default() -> Self {
        Self::new()
    }
}

impl App {
    pub fn new() -> Self {
        Self {
            state: AppState::MainMenu,
            menu_index: 0,
            theme: Theme::Dark,

            calculator_mode: CalculatorMode::Linear,
            calculator_index: 0,
            input_buffer: String::new(),
            input_fields: vec![String::new(); 3],
            current_field: 0,
            calculation_result: None,
            show_steps: false,
            solution_steps: Vec::new(),

            dashboard_selected: 0,
            wrong_answers_selected: 0,
        }
    }

    pub fn toggle_theme(&mut self) {
        self.theme = match self.theme {
            Theme::Dark => Theme::Light,
            Theme::Light => Theme::Dark,
        };
    }

    pub fn colors(&self) -> ThemeColors {
        self.theme.colors()
    }

    pub fn reset_calculator(&mut self) {
        self.input_buffer.clear();
        self.input_fields = vec![String::new(); 3];
        self.current_field = 0;
        self.calculation_result = None;
        self.solution_steps.clear();
        self.show_steps = false;
    }
}
