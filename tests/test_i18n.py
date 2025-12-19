"""
국제화(i18n) 모듈 테스트
"""
import pytest
import os
import tempfile
import json
from src.utils.i18n import I18nManager


class TestI18nManager:
    """국제화 관리 테스트 클래스"""

    def setup_method(self):
        """각 테스트 전에 실행"""
        self.i18n = I18nManager(language="ko")

    def test_initialization_default(self):
        """기본 초기화 (한국어)"""
        assert self.i18n is not None
        assert self.i18n.current_language == "ko"

    def test_initialization_english(self):
        """영어 초기화"""
        i18n_en = I18nManager(language="en")
        assert i18n_en.current_language == "en"

    def test_initialization_japanese(self):
        """일본어 초기화"""
        i18n_ja = I18nManager(language="ja")
        assert i18n_ja.current_language == "ja"

    def test_initialization_invalid_language(self):
        """잘못된 언어 코드 (기본값으로 폴백)"""
        i18n_invalid = I18nManager(language="invalid")
        assert i18n_invalid.current_language == "ko"

    def test_get_text_korean(self):
        """한국어 텍스트 가져오기"""
        text = self.i18n.get_text("app_title")
        assert text == "중학교 1학년 수학 학습 도우미"

    def test_get_text_english(self):
        """영어 텍스트 가져오기"""
        i18n_en = I18nManager(language="en")
        text = i18n_en.get_text("app_title")
        assert text == "Middle School Math Helper"

    def test_get_text_japanese(self):
        """일본어 텍스트 가져오기"""
        i18n_ja = I18nManager(language="ja")
        text = i18n_ja.get_text("app_title")
        assert text == "中学1年生数学学習ヘルパー"

    def test_get_text_missing_key(self):
        """존재하지 않는 키 (키 반환)"""
        text = self.i18n.get_text("nonexistent_key")
        assert text == "nonexistent_key"

    def test_get_text_with_default(self):
        """기본값이 있는 경우"""
        text = self.i18n.get_text("nonexistent_key", default="Default Value")
        assert text == "Default Value"

    def test_t_method_simple(self):
        """t() 메서드 간략 사용"""
        text = self.i18n.t("calculate")
        assert text == "계산하기"

    def test_t_method_with_formatting(self):
        """t() 메서드 포맷팅"""
        # 포맷팅 지원하는 키 추가 필요 (현재는 기본 동작 테스트)
        text = self.i18n.t("topic")
        assert text == "주제"

    def test_set_language_valid(self):
        """언어 변경 (유효)"""
        result = self.i18n.set_language("en")
        assert result is True
        assert self.i18n.current_language == "en"

    def test_set_language_invalid(self):
        """언어 변경 (무효)"""
        original = self.i18n.current_language
        result = self.i18n.set_language("invalid")
        assert result is False
        assert self.i18n.current_language == original

    def test_get_current_language(self):
        """현재 언어 코드 반환"""
        lang = self.i18n.get_current_language()
        assert lang == "ko"

    def test_get_language_name_current(self):
        """현재 언어 이름"""
        name = self.i18n.get_language_name()
        assert name == "한국어"

    def test_get_language_name_specific(self):
        """특정 언어 이름"""
        name = self.i18n.get_language_name("en")
        assert name == "English"

    def test_get_language_name_japanese(self):
        """일본어 이름"""
        name = self.i18n.get_language_name("ja")
        assert name == "日本語"

    def test_get_supported_languages(self):
        """지원 언어 목록"""
        langs = self.i18n.get_supported_languages()
        assert "ko" in langs
        assert "en" in langs
        assert "ja" in langs
        assert len(langs) == 3

    def test_load_custom_translations(self):
        """커스텀 번역 로드"""
        # 임시 번역 파일 생성 (모든 지원 언어 포함)
        custom_data = {
            "ko": {"custom_key": "커스텀 값"},
            "en": {"custom_key": "Custom Value"},
            "ja": {"custom_key": "カスタム値"}
        }

        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            json.dump(custom_data, f, ensure_ascii=False)
            temp_path = f.name

        try:
            result = self.i18n.load_custom_translations(temp_path)
            assert result is True
            assert self.i18n.get_text("custom_key") == "커스텀 값"

            # 클린업: 테스트 후 custom_key 제거
            for lang in ["ko", "en", "ja"]:
                if "custom_key" in I18nManager.TRANSLATIONS[lang]:
                    del I18nManager.TRANSLATIONS[lang]["custom_key"]
        finally:
            os.unlink(temp_path)

    def test_load_custom_translations_nonexistent(self):
        """존재하지 않는 파일 로드 (실패)"""
        result = self.i18n.load_custom_translations("nonexistent.json")
        assert result is False

    def test_export_translations_single_language(self):
        """단일 언어 내보내기"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            temp_path = f.name

        try:
            result = self.i18n.export_translations(temp_path, language="ko")
            assert result is True
            assert os.path.exists(temp_path)

            with open(temp_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            assert "ko" in data
            assert "app_title" in data["ko"]
        finally:
            if os.path.exists(temp_path):
                os.unlink(temp_path)

    def test_export_translations_all_languages(self):
        """전체 언어 내보내기"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            temp_path = f.name

        try:
            result = self.i18n.export_translations(temp_path)
            assert result is True

            with open(temp_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            assert "ko" in data
            assert "en" in data
            assert "ja" in data
        finally:
            if os.path.exists(temp_path):
                os.unlink(temp_path)

    def test_translations_consistency(self):
        """번역 키 일관성 확인"""
        ko_keys = set(I18nManager.TRANSLATIONS["ko"].keys())
        en_keys = set(I18nManager.TRANSLATIONS["en"].keys())
        ja_keys = set(I18nManager.TRANSLATIONS["ja"].keys())

        # 모든 언어가 같은 키를 가져야 함
        assert ko_keys == en_keys
        assert en_keys == ja_keys

    def test_common_keys_present(self):
        """공통 키 존재 확인"""
        common_keys = [
            "app_title", "menu_title", "language", "theme",
            "calculate", "solve", "save", "delete",
            "success", "error", "warning", "info"
        ]

        for key in common_keys:
            assert key in I18nManager.TRANSLATIONS["ko"]
            assert key in I18nManager.TRANSLATIONS["en"]
            assert key in I18nManager.TRANSLATIONS["ja"]
