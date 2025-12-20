# Math Helper - Complete Project Analysis
## Rust Migration Preparation Document

**Analysis Date**: 2025-12-21
**Python Version**: 3.x
**Total Files**: 38 Python files
**Total Lines of Code**: 11,161 lines
**Target**: Rust migration planning

---

## Executive Summary

This document provides a comprehensive analysis of the Math Helper Python project to facilitate migration to Rust. The project is a middle school mathematics learning assistant with 17 calculator modules, 8 feature modules for learning support, 7 UI modules using Streamlit, and 4 utility modules.

**Key Characteristics**:
- Heavy use of `@dataclass` for result objects
- Inline validation functions (NaN/Infinity checks)
- Step-by-step calculation tracking for educational purposes
- Epsilon-based floating point comparisons
- Streamlit-based web UI
- JSON/CSV data persistence

---

## Project Structure

```
src/
├── calculators/        # 17 math calculator modules (3,974 lines)
│   ├── algebraic_expression.py
│   ├── coordinate.py
│   ├── factorization.py
│   ├── function_graph.py
│   ├── geometry.py
│   ├── linear_equation.py
│   ├── linear_function.py
│   ├── linear_inequality.py
│   ├── prime_factor.py
│   ├── probability.py
│   ├── quadratic_equation.py
│   ├── quadratic_function.py
│   ├── rational_number.py
│   ├── simultaneous_equations.py
│   ├── square_root.py
│   ├── statistics.py
│   └── __init__.py
│
├── features/           # 8 learning support modules (2,172 lines)
│   ├── practice_generator.py
│   ├── mistake_notes.py
│   ├── progress_tracker.py
│   ├── history_manager.py
│   ├── visualizations.py
│   ├── visualizations_plotly.py
│   ├── data_export.py
│   └── __init__.py
│
├── ui/                 # 7 Streamlit UI modules (2,463 lines)
│   ├── themes.py
│   ├── feature_pages.py
│   ├── pages.py
│   ├── sidebar.py
│   ├── responsive.py
│   ├── accessibility.py
│   └── __init__.py
│
└── utils/              # 4 utility modules (952 lines)
    ├── logger.py
    ├── config.py
    ├── i18n.py
    └── __init__.py
```

---

## Core Dependencies Analysis

### Python Dependencies → Rust Crate Mapping

| Python Library | Usage | Rust Equivalent |
|---------------|-------|-----------------|
| **math** | sqrt, pi, isnan, isinf, gcd | `std::f64` methods + `num` crate |
| **numpy** | linspace, arrays | `ndarray` crate |
| **matplotlib** | Plotting graphs | `plotters` crate |
| **plotly** | Interactive plots | `plotly.rs` or `egui_plot` |
| **streamlit** | Web UI framework | `egui`/`iced` (desktop) or `axum`+frontend (web) |
| **fractions.Fraction** | Rational numbers | `num::rational::Ratio` |
| **dataclasses** | Data structures | Rust structs with `#[derive(...)]` |
| **typing** | Type hints | Native Rust type system |
| **yaml** | Config loading | `serde_yaml` crate |
| **json** | Data serialization | `serde_json` crate |
| **csv** | CSV export | `csv` crate |
| **datetime** | Timestamps | `chrono` crate |
| **collections.Counter** | Frequency counting | `HashMap<T, usize>` |
| **re** | Regex parsing | `regex` crate |
| **random** | Random numbers | `rand` crate |

---

## Module-by-Module Analysis

### 1. Calculators Module (17 files)

#### 1.1 Algebraic Expression (395 lines)

**Python Code Pattern**:
```python
@dataclass
class Term:
    coefficient: float
    variables: Dict[str, int]  # e.g., {'x': 2, 'y': 1} for x²y

class AlgebraicCalculator:
    def parse_term(self, term_str: str) -> Term:
        # Regex parsing: r'^([+-]?\d*\.?\d*)'
        ...
```

**Rust Migration**:
```rust
use std::collections::HashMap;
use regex::Regex;

#[derive(Debug, Clone)]
struct Term {
    coefficient: f64,
    variables: HashMap<String, i32>,
}

struct AlgebraicCalculator;

impl AlgebraicCalculator {
    fn parse_term(&self, term_str: &str) -> Result<Term, ParseError> {
        // Use regex crate for parsing
        ...
    }
}
```

**Key Algorithms**:
- Regex-based term parsing
- Variable power combination using dictionary operations
- Like term collection (grouping by same variables)

---

#### 1.2 Geometry (284 lines)

**Python Validation Pattern**:
```python
def validate_numeric_input(value, name):
    if not isinstance(value, (int, float)):
        return False, f"{name}는 숫자여야 합니다.", None
    if math.isnan(value):
        return False, f"{name}에 NaN이 입력되었습니다.", None
    if math.isinf(value):
        return False, f"{name}에 무한대가 입력되었습니다.", None
    return True, "", float(value)
```

**Rust Migration**:
```rust
#[derive(Debug)]
enum ValidationError {
    NotNumeric(String),
    NaN(String),
    Infinite(String),
}

fn validate_numeric_input(value: f64, name: &str) -> Result<f64, ValidationError> {
    if value.is_nan() {
        return Err(ValidationError::NaN(format!("{} contains NaN", name)));
    }
    if value.is_infinite() {
        return Err(ValidationError::Infinite(format!("{} is infinite", name)));
    }
    Ok(value)
}
```

**Geometric Functions**:
- Pythagorean theorem (all 3 variants: find a, b, or c)
- Area calculations (triangle, circle, rectangle, trapezoid, parallelogram)
- Perimeter calculations

---

#### 1.3 Quadratic Equation (355 lines)

**Python Code**:
```python
EPSILON = 1e-10

@dataclass
class QuadraticSolution:
    solution_type: str  # 'two_real', 'one_real', 'two_complex'
    x1: Optional[Union[float, complex]] = None
    x2: Optional[Union[float, complex]] = None
    discriminant: float = 0.0
    steps: List[str] = None

class QuadraticEquationSolver:
    def solve(self, a: float, b: float, c: float) -> QuadraticSolution:
        D = b * b - 4 * a * c
        if D > EPSILON:
            # Two real roots
        elif math.isclose(D, 0, abs_tol=EPSILON):
            # One real root (double)
        else:
            # Two complex roots
```

**Rust Migration**:
```rust
use num::Complex;
use approx::relative_eq;

const EPSILON: f64 = 1e-10;

#[derive(Debug, Clone)]
enum QuadraticSolution {
    TwoReal { x1: f64, x2: f64, steps: Vec<String> },
    OneReal { x: f64, steps: Vec<String> },
    TwoComplex { x1: Complex<f64>, x2: Complex<f64>, steps: Vec<String> },
}

struct QuadraticEquationSolver;

impl QuadraticEquationSolver {
    fn solve(&self, a: f64, b: f64, c: f64) -> Result<QuadraticSolution, String> {
        let d = b * b - 4.0 * a * c;

        if d > EPSILON {
            // Two real roots using quadratic formula
        } else if relative_eq!(d, 0.0, epsilon = EPSILON) {
            // One real root (double root)
        } else {
            // Two complex roots
            let real_part = -b / (2.0 * a);
            let imag_part = d.abs().sqrt() / (2.0 * a);
            // Use num::Complex
        }
    }
}
```

**Key Algorithms**:
- Discriminant calculation: D = b² - 4ac
- Quadratic formula: x = (-b ± √D) / (2a)
- Complex number handling for D < 0
- Completing the square method
- Integer factorization trial (brute force range -100 to 101)

---

#### 1.4 Simultaneous Equations (232 lines)

**Python Code**:
```python
def solve_by_elimination(self, a1, b1, c1, a2, b2, c2):
    # Determinant (Cramer's rule)
    det = a1 * b2 - a2 * b1

    if abs(det) < 1e-10:
        # No unique solution (infinite or none)
        ...
    else:
        # Solve using elimination method with LCM
        lcm_b = abs(b1 * b2) // self._gcd(abs(int(b1)), abs(int(b2)))
        ...
```

**Rust Migration**:
```rust
use num::integer::gcd;

#[derive(Debug, Clone)]
enum SimultaneousSolution {
    Unique { x: f64, y: f64, steps: Vec<String> },
    Infinite { steps: Vec<String> },
    None { steps: Vec<String> },
}

impl SimultaneousEquationsSolver {
    fn solve_by_elimination(&self, a1: f64, b1: f64, c1: f64,
                            a2: f64, b2: f64, c2: f64)
                            -> SimultaneousSolution {
        let det = a1 * b2 - a2 * b1;

        if det.abs() < EPSILON {
            // Check for infinite vs no solution
            ...
        } else {
            // Use GCD and LCM for elimination
            let lcm_b = (b1.abs() * b2.abs()) / gcd(b1.abs() as i64, b2.abs() as i64);
            ...
        }
    }
}
```

---

#### 1.5 Rational Number (279 lines)

**Python Code**:
```python
@dataclass
class RationalNumber:
    numerator: int
    denominator: int

    def __post_init__(self):
        if self.denominator == 0:
            raise ValueError("분모는 0이 될 수 없습니다.")

        # Auto-normalize negative denominator
        if self.denominator < 0:
            self.numerator = -self.numerator
            self.denominator = -self.denominator

        # Auto-reduce using GCD
        gcd = math.gcd(abs(self.numerator), abs(self.denominator))
        self.numerator //= gcd
        self.denominator //= gcd
```

**Rust Migration**:
```rust
use num::rational::Ratio;
use num::integer::gcd;

// Option 1: Use num-rational crate
type RationalNumber = Ratio<i64>;

// Option 2: Custom implementation
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct RationalNumber {
    numerator: i64,
    denominator: i64,
}

impl RationalNumber {
    fn new(numerator: i64, denominator: i64) -> Result<Self, &'static str> {
        if denominator == 0 {
            return Err("Denominator cannot be zero");
        }

        let (mut num, mut den) = (numerator, denominator);

        // Normalize negative denominator
        if den < 0 {
            num = -num;
            den = -den;
        }

        // Reduce using GCD
        let g = gcd(num.abs(), den.abs());
        Ok(RationalNumber {
            numerator: num / g,
            denominator: den / g,
        })
    }
}

// Implement std::ops traits for arithmetic
impl std::ops::Add for RationalNumber {
    type Output = Result<Self, &'static str>;
    fn add(self, other: Self) -> Self::Output {
        let num = self.numerator * other.denominator + other.numerator * self.denominator;
        let den = self.denominator * other.denominator;
        RationalNumber::new(num, den)
    }
}
```

---

#### 1.6 Statistics (229 lines)

**Python Code**:
```python
from collections import Counter

class StatisticsCalculator:
    def calculate_mean(self, data: List[float]) -> float:
        return sum(data) / len(data)

    def calculate_mode(self, data: List[float]) -> List[float]:
        counter = Counter(data)
        max_count = max(counter.values())
        return [k for k, v in counter.items() if v == max_count]
```

**Rust Migration**:
```rust
use std::collections::HashMap;

struct StatisticsCalculator;

impl StatisticsCalculator {
    fn calculate_mean(&self, data: &[f64]) -> Option<f64> {
        if data.is_empty() {
            return None;
        }
        Some(data.iter().sum::<f64>() / data.len() as f64)
    }

    fn calculate_mode(&self, data: &[f64]) -> Vec<f64> {
        let mut frequency: HashMap<&f64, usize> = HashMap::new();
        for value in data {
            *frequency.entry(value).or_insert(0) += 1;
        }

        let max_count = frequency.values().max().copied().unwrap_or(0);
        frequency.iter()
            .filter(|(_, &count)| count == max_count)
            .map(|(&value, _)| *value)
            .collect()
    }
}

// Or use the statrs crate for full statistical functions
```

---

### 2. Features Module (8 files)

#### 2.1 Practice Generator (323 lines)

**Python Code**:
```python
import random

@dataclass
class Problem:
    topic: str
    difficulty: str  # 'easy', 'medium', 'hard'
    question: str
    answer: Any
    solution_steps: List[str]
    hints: List[str]

class PracticeGenerator:
    def generate_linear_equation_problem(self, difficulty: str) -> Problem:
        if difficulty == 'easy':
            a = random.randint(1, 10)
            b = random.randint(1, 20)
        elif difficulty == 'medium':
            a = random.randint(-50, 50)
            b = random.randint(-100, 100)
        else:  # hard
            a = random.randint(-500, 500)
            b = random.randint(-1000, 1000)
```

**Rust Migration**:
```rust
use rand::Rng;

#[derive(Debug, Clone)]
struct Problem {
    topic: String,
    difficulty: Difficulty,
    question: String,
    answer: String,  // Or use enum for typed answers
    solution_steps: Vec<String>,
    hints: Vec<String>,
}

#[derive(Debug, Clone, Copy)]
enum Difficulty {
    Easy,
    Medium,
    Hard,
}

struct PracticeGenerator;

impl PracticeGenerator {
    fn generate_linear_equation_problem(&self, difficulty: Difficulty) -> Problem {
        let mut rng = rand::thread_rng();

        let (a_range, b_range) = match difficulty {
            Difficulty::Easy => (1..=10, 1..=20),
            Difficulty::Medium => (-50..=50, -100..=100),
            Difficulty::Hard => (-500..=500, -1000..=1000),
        };

        let a = rng.gen_range(a_range);
        let b = rng.gen_range(b_range);

        // Generate problem and solution
        ...
    }
}
```

---

#### 2.2 Mistake Notes (225 lines)

**Python Code**:
```python
@dataclass
class MistakeNote:
    topic: str
    problem: str
    wrong_answer: Any
    correct_answer: Any
    timestamp: str
    attempts: int = 0
    mastered: bool = False
    notes: str = ""

class MistakeNotesManager:
    def __init__(self):
        self.mistakes: List[MistakeNote] = []
        self.filepath = Path.home() / '.math_helper' / 'mistakes.json'

    def export_to_json(self, filepath: str):
        with open(filepath, 'w', encoding='utf-8') as f:
            data = [asdict(m) for m in self.mistakes]
            json.dump(data, f, ensure_ascii=False, indent=2)
```

**Rust Migration**:
```rust
use serde::{Serialize, Deserialize};
use chrono::{DateTime, Utc};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct MistakeNote {
    topic: String,
    problem: String,
    wrong_answer: String,
    correct_answer: String,
    timestamp: DateTime<Utc>,
    attempts: u32,
    mastered: bool,
    notes: String,
}

struct MistakeNotesManager {
    mistakes: Vec<MistakeNote>,
    filepath: PathBuf,
}

impl MistakeNotesManager {
    fn new() -> Self {
        let filepath = dirs::home_dir()
            .unwrap()
            .join(".math_helper")
            .join("mistakes.json");

        Self {
            mistakes: Vec::new(),
            filepath,
        }
    }

    fn export_to_json(&self, filepath: &str) -> std::io::Result<()> {
        let json = serde_json::to_string_pretty(&self.mistakes)?;
        std::fs::write(filepath, json)?;
        Ok(())
    }
}
```

---

#### 2.3 Progress Tracker (288 lines)

**Python Code**:
```python
@dataclass
class TopicProgress:
    topic: str
    problems_attempted: int = 0
    problems_correct: int = 0
    last_study_date: str = ""
    mastery_level: float = 0.0
    total_study_time: int = 0  # seconds

    def calculate_mastery(self):
        if self.problems_attempted == 0:
            return 0.0
        return self.problems_correct / self.problems_attempted
```

**Rust Migration**:
```rust
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
struct TopicProgress {
    topic: String,
    problems_attempted: u32,
    problems_correct: u32,
    last_study_date: DateTime<Utc>,
    total_study_time_seconds: u64,
}

impl TopicProgress {
    fn calculate_mastery(&self) -> f64 {
        if self.problems_attempted == 0 {
            return 0.0;
        }
        self.problems_correct as f64 / self.problems_attempted as f64
    }
}
```

---

#### 2.4 Data Export (365 lines)

**Python Security Pattern**:
```python
def sanitize_filename(filename: str) -> str:
    # Remove path traversal attempts
    filename = filename.replace('..', '')
    filename = filename.replace('/', '_')
    filename = filename.replace('\\', '_')
    return filename

def export_to_csv(self, data: List[dict], filepath: str):
    # Use safe export directory
    safe_dir = Path.home() / '.math_helper' / 'exports'
    safe_dir.mkdir(parents=True, exist_ok=True)

    safe_filename = sanitize_filename(filepath)
    full_path = safe_dir / safe_filename
```

**Rust Migration**:
```rust
use std::path::{Path, PathBuf};
use csv::Writer;

fn sanitize_filename(filename: &str) -> String {
    filename
        .replace("..", "")
        .replace('/', "_")
        .replace('\\', "_")
}

fn export_to_csv<T: Serialize>(data: &[T], filepath: &str) -> std::io::Result<()> {
    let safe_dir = dirs::home_dir()
        .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, "Home dir not found"))?
        .join(".math_helper")
        .join("exports");

    std::fs::create_dir_all(&safe_dir)?;

    let safe_filename = sanitize_filename(filepath);
    let full_path = safe_dir.join(safe_filename);

    // Canonicalize to prevent directory traversal
    let canonical_path = full_path.canonicalize()?;

    let mut wtr = Writer::from_path(canonical_path)?;
    for record in data {
        wtr.serialize(record)?;
    }
    wtr.flush()?;
    Ok(())
}
```

---

### 3. Utils Module (4 files)

#### 3.1 Logger (94 lines)

**Python Code**:
```python
import logging

class ColoredFormatter(logging.Formatter):
    COLORS = {
        'DEBUG': '\033[36m',    # Cyan
        'INFO': '\033[32m',     # Green
        'WARNING': '\033[33m',  # Yellow
        'ERROR': '\033[31m',    # Red
        'CRITICAL': '\033[35m', # Magenta
    }

def get_logger(name: str = 'math_helper') -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    handler = logging.StreamHandler()
    formatter = ColoredFormatter('%(asctime)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    return logger
```

**Rust Migration**:
```rust
use tracing::{info, warn, error, debug};
use tracing_subscriber::{fmt, EnvFilter};

// Initialize once at program start
fn init_logger() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env()
            .add_directive(tracing::Level::DEBUG.into()))
        .with_ansi(true)  // Enable colors
        .init();
}

// Usage throughout code
fn some_function() {
    info!("Starting calculation");
    debug!("Intermediate result: {}", value);
    error!("Validation failed: {}", error);
}

// Or use the log crate with env_logger
use log::{info, warn, error};

fn init_logger_simple() {
    env_logger::init();
}
```

---

#### 3.2 Config (128 lines)

**Python Singleton Pattern**:
```python
import yaml

class Config:
    _instance: Optional['Config'] = None
    _config: Optional[Dict[str, Any]] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if self._config is not None:
            return

        config_file = Path(__file__).parent.parent.parent / "config" / "settings.yaml"

        with open(config_file, 'r', encoding='utf-8') as f:
            self._config = yaml.safe_load(f)

    def get(self, key: str, default: Any = None) -> Any:
        # Support dot notation: 'app.title'
        keys = key.split('.')
        value = self._config
        for k in keys:
            value = value.get(k)
            if value is None:
                return default
        return value
```

**Rust Migration**:
```rust
use serde::{Deserialize, Serialize};
use std::sync::OnceLock;
use config::{Config as ConfigLib, File};

#[derive(Debug, Deserialize, Serialize, Clone)]
struct AppConfig {
    title: String,
    layout: String,
    initial_sidebar_state: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
struct Settings {
    app: AppConfig,
    calculators: CalculatorConfig,
}

// Global singleton using OnceLock (Rust 1.70+)
static CONFIG: OnceLock<Settings> = OnceLock::new();

fn get_config() -> &'static Settings {
    CONFIG.get_or_init(|| {
        ConfigLib::builder()
            .add_source(File::with_name("config/settings.yaml"))
            .build()
            .unwrap()
            .try_deserialize()
            .expect("Failed to load config")
    })
}

// Or use lazy_static for older Rust versions
use lazy_static::lazy_static;

lazy_static! {
    static ref CONFIG: Settings = load_config();
}

fn load_config() -> Settings {
    // Load YAML config
    ...
}
```

---

#### 3.3 I18n (418 lines)

**Python Code**:
```python
class I18nManager:
    SUPPORTED_LANGUAGES = {
        "ko": "한국어",
        "en": "English",
        "ja": "日本語"
    }

    TRANSLATIONS = {
        "ko": {
            "app_title": "중학교 1학년 수학 학습 도우미",
            "calculate": "계산하기",
            ...
        },
        "en": {
            "app_title": "Middle School Math Helper",
            "calculate": "Calculate",
            ...
        }
    }

    def t(self, key: str, **kwargs) -> str:
        text = self.get_text(key)
        if kwargs:
            return text.format(**kwargs)
        return text
```

**Rust Migration**:
```rust
use std::collections::HashMap;
use fluent::{FluentBundle, FluentResource};

// Option 1: Simple HashMap-based
struct I18nManager {
    current_language: String,
    translations: HashMap<String, HashMap<String, String>>,
}

impl I18nManager {
    fn new(lang: &str) -> Self {
        let mut translations = HashMap::new();

        // Load Korean translations
        let mut ko = HashMap::new();
        ko.insert("app_title".to_string(), "중학교 1학년 수학 학습 도우미".to_string());
        ko.insert("calculate".to_string(), "계산하기".to_string());
        translations.insert("ko".to_string(), ko);

        // Load English translations
        let mut en = HashMap::new();
        en.insert("app_title".to_string(), "Middle School Math Helper".to_string());
        en.insert("calculate".to_string(), "Calculate".to_string());
        translations.insert("en".to_string(), en);

        Self {
            current_language: lang.to_string(),
            translations,
        }
    }

    fn t(&self, key: &str) -> &str {
        self.translations
            .get(&self.current_language)
            .and_then(|lang| lang.get(key))
            .map(|s| s.as_str())
            .unwrap_or(key)
    }
}

// Option 2: Use fluent crate for production
// Fluent is Mozilla's L10n system, very powerful
```

---

### 4. UI Module (7 files)

#### Current UI Stack: Streamlit

The current Python implementation uses **Streamlit**, a pure Python web framework. For Rust migration, several approaches are possible:

**Option A: Native Desktop UI**
- **egui**: Immediate mode GUI, easy to use, cross-platform
- **iced**: Elm-inspired, reactive, clean architecture
- **slint**: Declarative UI with DSL, designed for embedded/desktop

**Option B: Web-based UI**
- **Backend**: `axum` or `actix-web` for REST API
- **Frontend**: Keep using web technologies (HTML/CSS/JS) or use Rust WASM (yew, leptos)
- **Hybrid**: Use Tauri (Rust backend + web frontend)

**Option C: Terminal UI (TUI)**
- **ratatui**: Modern terminal UI framework (if simple text UI is acceptable)

---

#### Theme System Migration

**Python (Streamlit)**:
```python
LIGHT_THEME = {
    "primary": "#1f77b4",
    "secondary": "#ff7f0e",
    "success": "#2ca02c",
    "background": "#ffffff"
}

def apply_theme(theme_name: str):
    st.markdown(f"""
    <style>
        .stButton > button {{
            background-color: {LIGHT_THEME['primary']};
        }}
    </style>
    """, unsafe_allow_html=True)
```

**Rust (egui example)**:
```rust
use egui::{Color32, Visuals, Style};

struct Theme {
    primary: Color32,
    secondary: Color32,
    success: Color32,
    background: Color32,
}

const LIGHT_THEME: Theme = Theme {
    primary: Color32::from_rgb(31, 119, 180),
    secondary: Color32::from_rgb(255, 127, 14),
    success: Color32::from_rgb(44, 160, 44),
    background: Color32::WHITE,
};

fn apply_theme(ctx: &egui::Context, theme: &Theme) {
    let mut style = (*ctx.style()).clone();

    // Customize colors
    style.visuals.widgets.noninteractive.bg_fill = theme.background;
    style.visuals.selection.bg_fill = theme.primary;

    ctx.set_style(style);
}
```

---

## Common Python Patterns → Rust Equivalents

### Pattern 1: Validation with Tuple Return

**Python**:
```python
def validate_nums(*values, param_names=None):
    if param_names is None:
        param_names = [f'값{i+1}' for i in range(len(values))]

    for val, name in zip(values, param_names):
        if not isinstance(val, (int, float)):
            return False, f"{name}는 숫자여야 합니다.", None
        if math.isnan(val):
            return False, f"{name}에 NaN이 입력되었습니다.", None

    return True, "", tuple(float(v) for v in values)
```

**Rust**:
```rust
#[derive(Debug)]
enum ValidationError {
    NotNumeric(String),
    NaN(String),
    Infinite(String),
}

fn validate_nums(values: &[f64], names: &[&str]) -> Result<Vec<f64>, ValidationError> {
    if values.len() != names.len() {
        return Err(ValidationError::NotNumeric("Length mismatch".to_string()));
    }

    let mut validated = Vec::new();
    for (&val, &name) in values.iter().zip(names.iter()) {
        if val.is_nan() {
            return Err(ValidationError::NaN(format!("{} is NaN", name)));
        }
        if val.is_infinite() {
            return Err(ValidationError::Infinite(format!("{} is infinite", name)));
        }
        validated.push(val);
    }

    Ok(validated)
}
```

---

### Pattern 2: Dataclass with __post_init__

**Python**:
```python
@dataclass
class RationalNumber:
    numerator: int
    denominator: int

    def __post_init__(self):
        if self.denominator == 0:
            raise ValueError("Denominator cannot be zero")
        # Auto-normalize and reduce
        ...
```

**Rust**:
```rust
#[derive(Debug, Clone)]
struct RationalNumber {
    numerator: i64,
    denominator: i64,
}

impl RationalNumber {
    fn new(numerator: i64, denominator: i64) -> Result<Self, &'static str> {
        if denominator == 0 {
            return Err("Denominator cannot be zero");
        }

        // Auto-normalize and reduce
        let g = gcd(numerator.abs(), denominator.abs());
        Ok(Self {
            numerator: numerator / g,
            denominator: denominator / g,
        })
    }
}
```

---

### Pattern 3: Step Tracking List

**Python**:
```python
steps = []
steps.append("주어진 방정식: 2x + 3 = 7")
steps.append("1. 상수항 이항")
steps.append("   2x = 7 - 3")
steps.append("   2x = 4")
steps.append("2. 양변을 2로 나눔")
steps.append("   x = 2")
```

**Rust**:
```rust
let mut steps = Vec::new();
steps.push("주어진 방정식: 2x + 3 = 7".to_string());
steps.push("1. 상수항 이항".to_string());
steps.push("   2x = 7 - 3".to_string());
steps.push("   2x = 4".to_string());
steps.push("2. 양변을 2로 나눔".to_string());
steps.push("   x = 2".to_string());

// Or use a macro for convenience
macro_rules! add_step {
    ($steps:expr, $($arg:tt)*) => {
        $steps.push(format!($($arg)*))
    };
}

add_step!(steps, "주어진 방정식: {}x + {} = {}", a, b, c);
```

---

### Pattern 4: Epsilon Comparison

**Python**:
```python
EPSILON = 1e-10

if math.isclose(a, b, abs_tol=EPSILON):
    # Values are equal
```

**Rust**:
```rust
const EPSILON: f64 = 1e-10;

// Option 1: Manual
if (a - b).abs() < EPSILON {
    // Values are equal
}

// Option 2: Use approx crate
use approx::relative_eq;

if relative_eq!(a, b, epsilon = EPSILON) {
    // Values are equal
}
```

---

### Pattern 5: Optional Imports

**Python**:
```python
try:
    import streamlit as st
except ImportError:
    st = None

def render():
    if st is None:
        print("Streamlit not available")
        return
    st.write("Hello")
```

**Rust (using feature flags)**:
```toml
# Cargo.toml
[features]
default = []
ui = ["egui", "eframe"]

[dependencies]
egui = { version = "0.24", optional = true }
eframe = { version = "0.24", optional = true }
```

```rust
#[cfg(feature = "ui")]
mod ui {
    use egui::*;

    pub fn render() {
        // UI code
    }
}

#[cfg(not(feature = "ui"))]
mod ui {
    pub fn render() {
        println!("UI not available");
    }
}
```

---

## Recommended Rust Project Structure

```
math-helper/
├── Cargo.toml              # Workspace root
├── config/
│   └── settings.yaml
├── crates/
│   ├── math-core/          # Core calculator logic
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── calculators/
│   │       │   ├── mod.rs
│   │       │   ├── algebra.rs
│   │       │   ├── geometry.rs
│   │       │   ├── equations.rs
│   │       │   └── statistics.rs
│   │       ├── validation.rs
│   │       └── types.rs    # Common result types
│   │
│   ├── math-features/      # Learning features
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── practice.rs
│   │       ├── mistakes.rs
│   │       ├── progress.rs
│   │       └── export.rs
│   │
│   ├── math-ui/            # UI layer (optional)
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── main.rs
│   │       ├── app.rs
│   │       ├── themes.rs
│   │       └── pages/
│   │
│   └── math-cli/           # CLI interface (optional)
│       ├── Cargo.toml
│       └── src/
│           └── main.rs
│
├── tests/                  # Integration tests
│   ├── calculator_tests.rs
│   └── feature_tests.rs
│
└── README.md
```

**Cargo.toml (workspace)**:
```toml
[workspace]
members = [
    "crates/math-core",
    "crates/math-features",
    "crates/math-ui",
    "crates/math-cli"
]

[workspace.dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
num = "0.4"
approx = "0.5"
```

---

## Migration Roadmap

### Phase 1: Core Mathematics (Weeks 1-4)

**Priority**: High
**Complexity**: Medium

**Tasks**:
1. Set up Rust workspace with crates structure
2. Migrate validation functions and common types
3. Implement all 17 calculator modules:
   - Start with simpler ones: linear equation, geometry
   - Move to complex: quadratic, simultaneous equations
   - Finish with advanced: algebraic expressions, factorization
4. Write comprehensive unit tests for each calculator
5. Benchmark performance vs Python

**Dependencies to add**:
```toml
[dependencies]
num = { version = "0.4", features = ["serde"] }
num-rational = "0.4"
num-complex = "0.4"
approx = "0.5"
serde = { version = "1.0", features = ["derive"] }
thiserror = "1.0"
```

---

### Phase 2: Features (Weeks 5-6)

**Priority**: Medium
**Complexity**: Medium

**Tasks**:
1. Implement practice problem generator
2. Implement mistake notes with persistence
3. Implement progress tracker
4. Implement history manager
5. Add JSON/CSV export functionality

**Dependencies to add**:
```toml
serde_json = "1.0"
csv = "1.2"
chrono = { version = "0.4", features = ["serde"] }
rand = "0.8"
dirs = "5.0"  # For home directory access
```

---

### Phase 3: Configuration & Utilities (Week 7)

**Priority**: Medium
**Complexity**: Low

**Tasks**:
1. Implement logger using `tracing` or `log`
2. Implement configuration system with `config` crate
3. Implement i18n system (simple HashMap or `fluent`)
4. Set up error handling with `thiserror`

**Dependencies to add**:
```toml
tracing = "0.1"
tracing-subscriber = "0.3"
config = "0.13"
serde_yaml = "0.9"
```

---

### Phase 4: UI (Weeks 8-10)

**Priority**: Low (can be delayed)
**Complexity**: High

**Decision Point**: Choose UI approach

**Option A: Native Desktop UI with egui**
```toml
[dependencies]
eframe = "0.24"  # egui framework
egui = "0.24"
egui_plot = "0.24"  # For graphing
```

**Option B: Web Backend + Frontend**
```toml
# Backend
axum = "0.7"
tower = "0.4"
tokio = { version = "1", features = ["full"] }

# Frontend: Use existing web stack or Rust WASM
yew = "0.21"  # React-like Rust WASM framework
```

**Option C: Tauri (Best of both worlds)**
```toml
[dependencies]
tauri = "1.5"
serde_json = "1.0"
# Frontend stays HTML/CSS/JS
```

---

### Phase 5: Visualization (Weeks 11-12)

**Priority**: Low
**Complexity**: Medium

**Tasks**:
1. Implement function graphing using `plotters`
2. Implement progress charts
3. Add interactive features (if using egui)

**Dependencies to add**:
```toml
plotters = "0.3"
# Or for egui
egui_plot = "0.24"
```

---

### Phase 6: Testing & Optimization (Weeks 13-14)

**Priority**: High
**Complexity**: Medium

**Tasks**:
1. Write integration tests
2. Add property-based testing with `proptest`
3. Benchmark critical paths
4. Optimize hot paths
5. Document public APIs with `cargo doc`

**Dependencies to add**:
```toml
[dev-dependencies]
criterion = "0.5"  # Benchmarking
proptest = "1.4"   # Property-based testing
```

---

## Type Mapping Reference

| Python Type | Rust Type | Notes |
|------------|-----------|-------|
| `int` | `i32`, `i64`, `isize` | Choose based on range needs |
| `float` | `f64` (prefer) or `f32` | f64 for precision |
| `str` | `String` (owned) or `&str` (borrowed) | Use &str for function parameters |
| `bool` | `bool` | Same |
| `List[T]` | `Vec<T>` | Dynamic array |
| `Dict[K, V]` | `HashMap<K, V>` or `BTreeMap<K, V>` | HashMap for speed, BTreeMap for sorted |
| `Tuple[T1, T2, ...]` | `(T1, T2, ...)` | Same |
| `Optional[T]` | `Option<T>` | None → None, Some(T) → Some(T) |
| `Union[T1, T2]` | `enum` with variants | Type-safe tagged union |
| `Any` | `Box<dyn Any>` or generics | Avoid if possible |
| `None` | `()` or `Option::None` | Unit type or None variant |
| `complex` | `num::Complex<f64>` | From num crate |
| `Fraction` | `num::Ratio<i64>` | From num-rational |
| `datetime` | `chrono::DateTime<Utc>` | From chrono crate |
| `Path` | `std::path::PathBuf` | Owned path |
| `@dataclass` | `struct` with `#[derive(...)]` | Add Serialize, Deserialize for serde |

---

## Error Handling Strategy

### Python Approach
```python
try:
    result = calculator.solve(a, b, c)
except ValueError as e:
    print(f"Error: {e}")
```

### Rust Approach (Recommended)

**1. Define Custom Error Type**:
```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum MathError {
    #[error("Invalid input: {0}")]
    InvalidInput(String),

    #[error("Division by zero")]
    DivisionByZero,

    #[error("Value is NaN: {0}")]
    NaN(String),

    #[error("Value is infinite: {0}")]
    Infinite(String),

    #[error("No solution exists")]
    NoSolution,
}

pub type MathResult<T> = Result<T, MathError>;
```

**2. Use in Functions**:
```rust
fn solve_linear_equation(a: f64, b: f64, c: f64) -> MathResult<EquationSolution> {
    if a.is_nan() {
        return Err(MathError::NaN("coefficient a".to_string()));
    }

    if a.abs() < EPSILON {
        return Err(MathError::InvalidInput("a cannot be zero".to_string()));
    }

    let x = (c - b) / a;
    Ok(EquationSolution::Unique { value: x, steps: vec![] })
}
```

**3. Handle at Call Site**:
```rust
match calculator.solve_linear_equation(2.0, 3.0, 7.0) {
    Ok(solution) => println!("Solution: {:?}", solution),
    Err(MathError::InvalidInput(msg)) => eprintln!("Invalid input: {}", msg),
    Err(e) => eprintln!("Error: {}", e),
}

// Or use ? operator to propagate
fn solve_and_print(a: f64, b: f64, c: f64) -> MathResult<()> {
    let solution = calculator.solve_linear_equation(a, b, c)?;
    println!("{:?}", solution);
    Ok(())
}
```

---

## Testing Strategy

### Unit Tests (in same file)
```rust
#[cfg(test)]
mod tests {
    use super::*;
    use approx::assert_relative_eq;

    #[test]
    fn test_pythagorean_theorem() {
        let calc = GeometryCalculator;
        let result = calc.pythagorean_theorem(Some(3.0), Some(4.0), None).unwrap();

        assert_relative_eq!(result.result, 5.0, epsilon = 1e-10);
    }

    #[test]
    fn test_validation_nan() {
        let result = validate_numeric_input(f64::NAN, "test");
        assert!(result.is_err());
    }
}
```

### Integration Tests (in tests/ directory)
```rust
// tests/calculator_integration.rs
use math_core::calculators::*;

#[test]
fn test_full_calculation_workflow() {
    let linear_calc = LinearEquationSolver::new();
    let solution = linear_calc.solve(2.0, 3.0, 7.0).unwrap();

    assert_eq!(solution.solution_type, SolutionType::Unique);
    assert_eq!(solution.value.unwrap(), 2.0);
}
```

### Property-Based Testing
```rust
use proptest::prelude::*;

proptest! {
    #[test]
    fn test_quadratic_discriminant(a in -100.0..100.0, b in -100.0..100.0, c in -100.0..100.0) {
        let d = b * b - 4.0 * a * c;

        // Property: discriminant should match manual calculation
        let solver = QuadraticEquationSolver;
        if let Ok(solution) = solver.solve(a, b, c) {
            assert_eq!(solution.discriminant(), d);
        }
    }
}
```

---

## Performance Considerations

### 1. Use References When Possible
```rust
// Bad: Clones entire vector
fn calculate_mean(data: Vec<f64>) -> f64 {
    data.iter().sum::<f64>() / data.len() as f64
}

// Good: Borrows vector
fn calculate_mean(data: &[f64]) -> f64 {
    data.iter().sum::<f64>() / data.len() as f64
}
```

### 2. Avoid Unnecessary String Allocations
```rust
// Bad
fn format_step(a: f64, b: f64) -> String {
    format!("Step: {} + {} = {}", a, b, a + b)
}

// Good (if steps are only displayed once)
fn format_step(a: f64, b: f64, buffer: &mut String) {
    use std::fmt::Write;
    write!(buffer, "Step: {} + {} = {}", a, b, a + b).unwrap();
}
```

### 3. Use `SmallVec` for Small Fixed-Size Collections
```toml
[dependencies]
smallvec = "1.11"
```

```rust
use smallvec::SmallVec;

// Most equations have <10 steps, avoid heap allocation
type Steps = SmallVec<[String; 10]>;

struct EquationSolution {
    value: f64,
    steps: Steps,
}
```

### 4. Parallelize Problem Generation
```rust
use rayon::prelude::*;

fn generate_many_problems(count: usize, difficulty: Difficulty) -> Vec<Problem> {
    (0..count)
        .into_par_iter()  // Parallel iterator
        .map(|_| generator.generate_problem(difficulty))
        .collect()
}
```

---

## Serialization Examples

### JSON with serde_json
```rust
use serde::{Serialize, Deserialize};
use serde_json;

#[derive(Serialize, Deserialize)]
struct MistakeNote {
    topic: String,
    problem: String,
    timestamp: chrono::DateTime<chrono::Utc>,
}

// Serialize
let note = MistakeNote { ... };
let json = serde_json::to_string_pretty(&note)?;
std::fs::write("mistake.json", json)?;

// Deserialize
let json = std::fs::read_to_string("mistake.json")?;
let note: MistakeNote = serde_json::from_str(&json)?;
```

### CSV with csv crate
```rust
use csv::Writer;

let mut wtr = Writer::from_path("progress.csv")?;
wtr.write_record(&["topic", "correct", "attempted"])?;
wtr.write_record(&["algebra", "15", "20"])?;
wtr.flush()?;
```

---

## Deployment Considerations

### 1. Cross-Platform Binary
```bash
# Build for current platform
cargo build --release

# Build for Windows (from Linux/Mac)
cargo build --release --target x86_64-pc-windows-gnu

# Build for Linux (from Mac)
cargo build --release --target x86_64-unknown-linux-gnu

# Binary will be in target/release/ or target/<triple>/release/
```

### 2. WASM for Web
```toml
[dependencies]
wasm-bindgen = "0.2"
```

```bash
# Build for web
wasm-pack build --target web
```

### 3. Desktop Bundle (with Tauri)
```bash
# Create distributable packages
cargo tauri build

# Outputs: .dmg (Mac), .exe installer (Windows), .deb/.AppImage (Linux)
```

---

## Conclusion

This Python math helper project is well-structured and ready for Rust migration. The main challenges will be:

1. **UI Framework Decision**: Choose between native (egui/iced), web (axum+frontend), or hybrid (Tauri)
2. **Visualization**: Migrate matplotlib/plotly to Rust plotting libraries
3. **Testing**: Ensure all calculations match Python precision

**Advantages of Rust Migration**:
- ⚡ **Performance**: 10-100x faster for intensive calculations
- 🔒 **Type Safety**: Catch errors at compile time
- 📦 **Single Binary**: No Python runtime dependency
- 🌐 **Cross-Platform**: Compile to Windows, Mac, Linux, WASM
- 🧵 **Concurrency**: Easy parallelization with rayon
- 💾 **Memory Efficiency**: No GC overhead

**Estimated Timeline**: 12-14 weeks for full migration with UI

**Recommended First Steps**:
1. Week 1: Set up project structure, migrate validation functions
2. Week 2-3: Migrate 5 simple calculators (linear equation, geometry, prime factor)
3. Week 4: Add comprehensive tests, benchmark vs Python
4. Week 5-6: Continue with remaining calculators and features

---

## Additional Resources

- **Rust Book**: https://doc.rust-lang.org/book/
- **Rust by Example**: https://doc.rust-lang.org/rust-by-example/
- **egui**: https://github.com/emilk/egui
- **num crate**: https://docs.rs/num/
- **serde**: https://serde.rs/
- **Tauri**: https://tauri.app/

---

**Document Generated**: 2025-12-21
**For Questions**: Refer to project-analysis.json for detailed API mappings
