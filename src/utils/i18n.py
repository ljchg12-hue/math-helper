"""
국제화(i18n) 모듈
다국어 지원 시스템
"""
import json
from pathlib import Path
from typing import Dict, Optional
from ..utils.logger import get_logger

logger = get_logger()


class I18nManager:
    """국제화 관리 클래스"""

    # 지원 언어
    SUPPORTED_LANGUAGES = {
        "ko": "한국어",
        "en": "English",
        "ja": "日本語"
    }

    # 번역 데이터 (기본 내장)
    TRANSLATIONS = {
        "ko": {
            # 일반
            "app_title": "중학교 1학년 수학 학습 도우미",
            "menu_title": "학습 메뉴 선택",
            "language": "언어",
            "theme": "테마",
            "light": "라이트",
            "dark": "다크",

            # 계산기
            "prime_factorization": "소인수분해",
            "linear_equation": "일차방정식",
            "function_graph": "함수와 그래프",
            "integers": "정수와 유리수",
            "equations": "연립방정식",
            "linear_function": "일차함수",
            "square_roots": "제곱근과 실수",
            "factorization": "인수분해",
            "quadratic_equation": "이차방정식",
            "quadratic_function": "이차함수",
            "statistics": "통계",
            "probability": "확률",
            "geometry": "기하",
            "coordinate_plane": "좌표평면",

            # 학습 기능
            "practice_problems": "연습 문제",
            "mistake_notes": "오답 노트",
            "progress_tracker": "학습 진도",
            "calculation_history": "계산 히스토리",

            # 버튼
            "calculate": "계산하기",
            "solve": "풀이하기",
            "draw_graph": "그래프 그리기",
            "generate": "생성하기",
            "save": "저장",
            "delete": "삭제",
            "export": "내보내기",
            "import": "가져오기",
            "reset": "초기화",

            # 메시지
            "success": "성공",
            "error": "오류",
            "warning": "경고",
            "info": "정보",
            "no_data": "데이터가 없습니다",
            "loading": "로딩 중...",
            "completed": "완료",

            # 레이블
            "input": "입력",
            "output": "출력",
            "result": "결과",
            "solution": "풀이",
            "steps": "단계",
            "answer": "답",
            "question": "문제",
            "topic": "주제",
            "difficulty": "난이도",
            "easy": "쉬움",
            "medium": "보통",
            "hard": "어려움",

            # 통계
            "total": "전체",
            "attempted": "시도",
            "correct": "정답",
            "incorrect": "오답",
            "accuracy": "정답률",
            "mastery": "숙달도",
            "study_time": "학습 시간",

            # 날짜/시간
            "date": "날짜",
            "time": "시간",
            "today": "오늘",
            "yesterday": "어제",
            "week": "주",
            "month": "월",
            "year": "년",
        },
        "en": {
            # General
            "app_title": "Middle School Math Helper",
            "menu_title": "Select Learning Menu",
            "language": "Language",
            "theme": "Theme",
            "light": "Light",
            "dark": "Dark",

            # Calculators
            "prime_factorization": "Prime Factorization",
            "linear_equation": "Linear Equation",
            "function_graph": "Function Graph",
            "integers": "Integers & Rational Numbers",
            "equations": "System of Equations",
            "linear_function": "Linear Function",
            "square_roots": "Square Roots & Real Numbers",
            "factorization": "Factorization",
            "quadratic_equation": "Quadratic Equation",
            "quadratic_function": "Quadratic Function",
            "statistics": "Statistics",
            "probability": "Probability",
            "geometry": "Geometry",
            "coordinate_plane": "Coordinate Plane",

            # Learning Features
            "practice_problems": "Practice Problems",
            "mistake_notes": "Mistake Notes",
            "progress_tracker": "Progress Tracker",
            "calculation_history": "Calculation History",

            # Buttons
            "calculate": "Calculate",
            "solve": "Solve",
            "draw_graph": "Draw Graph",
            "generate": "Generate",
            "save": "Save",
            "delete": "Delete",
            "export": "Export",
            "import": "Import",
            "reset": "Reset",

            # Messages
            "success": "Success",
            "error": "Error",
            "warning": "Warning",
            "info": "Information",
            "no_data": "No data available",
            "loading": "Loading...",
            "completed": "Completed",

            # Labels
            "input": "Input",
            "output": "Output",
            "result": "Result",
            "solution": "Solution",
            "steps": "Steps",
            "answer": "Answer",
            "question": "Question",
            "topic": "Topic",
            "difficulty": "Difficulty",
            "easy": "Easy",
            "medium": "Medium",
            "hard": "Hard",

            # Statistics
            "total": "Total",
            "attempted": "Attempted",
            "correct": "Correct",
            "incorrect": "Incorrect",
            "accuracy": "Accuracy",
            "mastery": "Mastery",
            "study_time": "Study Time",

            # Date/Time
            "date": "Date",
            "time": "Time",
            "today": "Today",
            "yesterday": "Yesterday",
            "week": "Week",
            "month": "Month",
            "year": "Year",
        },
        "ja": {
            # 一般
            "app_title": "中学1年生数学学習ヘルパー",
            "menu_title": "学習メニュー選択",
            "language": "言語",
            "theme": "テーマ",
            "light": "ライト",
            "dark": "ダーク",

            # 計算機
            "prime_factorization": "素因数分解",
            "linear_equation": "一次方程式",
            "function_graph": "関数とグラフ",
            "integers": "整数と有理数",
            "equations": "連立方程式",
            "linear_function": "一次関数",
            "square_roots": "平方根と実数",
            "factorization": "因数分解",
            "quadratic_equation": "二次方程式",
            "quadratic_function": "二次関数",
            "statistics": "統計",
            "probability": "確率",
            "geometry": "幾何",
            "coordinate_plane": "座標平面",

            # 学習機能
            "practice_problems": "練習問題",
            "mistake_notes": "間違いノート",
            "progress_tracker": "学習進度",
            "calculation_history": "計算履歴",

            # ボタン
            "calculate": "計算する",
            "solve": "解く",
            "draw_graph": "グラフを描く",
            "generate": "生成",
            "save": "保存",
            "delete": "削除",
            "export": "エクスポート",
            "import": "インポート",
            "reset": "リセット",

            # メッセージ
            "success": "成功",
            "error": "エラー",
            "warning": "警告",
            "info": "情報",
            "no_data": "データがありません",
            "loading": "読み込み中...",
            "completed": "完了",

            # ラベル
            "input": "入力",
            "output": "出力",
            "result": "結果",
            "solution": "解法",
            "steps": "ステップ",
            "answer": "答え",
            "question": "問題",
            "topic": "トピック",
            "difficulty": "難易度",
            "easy": "簡単",
            "medium": "普通",
            "hard": "難しい",

            # 統計
            "total": "合計",
            "attempted": "試行",
            "correct": "正解",
            "incorrect": "不正解",
            "accuracy": "正解率",
            "mastery": "習熟度",
            "study_time": "学習時間",

            # 日付/時間
            "date": "日付",
            "time": "時間",
            "today": "今日",
            "yesterday": "昨日",
            "week": "週",
            "month": "月",
            "year": "年",
        }
    }

    def __init__(self, language: str = "ko"):
        """
        초기화

        Args:
            language: 언어 코드 (ko, en, ja)
        """
        self.current_language = language if language in self.SUPPORTED_LANGUAGES else "ko"
        logger.info(f"I18nManager 초기화 (언어: {self.current_language})")

    def get_text(self, key: str, default: Optional[str] = None) -> str:
        """
        번역 텍스트 가져오기

        Args:
            key: 번역 키
            default: 기본값 (없으면 키 반환)

        Returns:
            번역된 텍스트
        """
        try:
            return self.TRANSLATIONS[self.current_language].get(key, default or key)
        except KeyError:
            logger.warning(f"번역 키를 찾을 수 없음: {key}")
            return default or key

    def t(self, key: str, **kwargs) -> str:
        """
        번역 텍스트 가져오기 (간략 버전, 포맷팅 지원)

        Args:
            key: 번역 키
            **kwargs: 포맷 인자

        Returns:
            번역된 텍스트
        """
        text = self.get_text(key)

        if kwargs:
            try:
                return text.format(**kwargs)
            except KeyError as e:
                logger.error(f"번역 포맷팅 오류: {e}")
                return text

        return text

    def set_language(self, language: str) -> bool:
        """
        언어 변경

        Args:
            language: 언어 코드

        Returns:
            성공 여부
        """
        if language in self.SUPPORTED_LANGUAGES:
            self.current_language = language
            logger.info(f"언어 변경: {language}")
            return True
        else:
            logger.warning(f"지원하지 않는 언어: {language}")
            return False

    def get_current_language(self) -> str:
        """현재 언어 코드 반환"""
        return self.current_language

    def get_language_name(self, language: Optional[str] = None) -> str:
        """
        언어 이름 반환

        Args:
            language: 언어 코드 (None이면 현재 언어)

        Returns:
            언어 이름
        """
        lang = language or self.current_language
        return self.SUPPORTED_LANGUAGES.get(lang, "Unknown")

    def get_supported_languages(self) -> Dict[str, str]:
        """지원 언어 목록 반환"""
        return self.SUPPORTED_LANGUAGES.copy()

    def load_custom_translations(self, filepath: str) -> bool:
        """
        커스텀 번역 파일 로드

        Args:
            filepath: JSON 번역 파일 경로

        Returns:
            성공 여부
        """
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                custom_translations = json.load(f)

            # 기존 번역에 병합
            for lang, translations in custom_translations.items():
                if lang in self.TRANSLATIONS:
                    self.TRANSLATIONS[lang].update(translations)
                else:
                    self.TRANSLATIONS[lang] = translations

            logger.info(f"커스텀 번역 로드 성공: {filepath}")
            return True

        except Exception as e:
            logger.error(f"커스텀 번역 로드 실패: {e}")
            return False

    def export_translations(self, filepath: str, language: Optional[str] = None) -> bool:
        """
        번역 데이터 내보내기

        Args:
            filepath: 저장 경로
            language: 언어 코드 (None이면 전체)

        Returns:
            성공 여부
        """
        try:
            if language:
                data = {language: self.TRANSLATIONS.get(language, {})}
            else:
                data = self.TRANSLATIONS

            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

            logger.info(f"번역 데이터 내보내기 성공: {filepath}")
            return True

        except Exception as e:
            logger.error(f"번역 데이터 내보내기 실패: {e}")
            return False
