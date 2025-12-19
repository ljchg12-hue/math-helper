"""
계산 히스토리 모듈
모든 계산 기록을 저장하고 조회할 수 있는 기능을 제공합니다.
"""
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from ..utils.logger import get_logger

logger = get_logger()


@dataclass
class CalculationEntry:
    """계산 기록 클래스"""
    id: str
    calculator_type: str  # 계산기 종류
    timestamp: str
    inputs: Dict[str, Any]  # 입력값
    outputs: Dict[str, Any]  # 결과값
    steps: List[str]  # 풀이 과정
    is_favorite: bool  # 즐겨찾기 여부


class HistoryManager:
    """계산 히스토리 관리 클래스"""

    def __init__(self, storage_path: str = "data/history.json"):
        """
        초기화

        Args:
            storage_path: 히스토리 저장 경로
        """
        logger.info("계산 히스토리 관리자 초기화")
        self.storage_path = storage_path
        self.history: List[CalculationEntry] = []
        self._ensure_storage_dir()
        self._load_history()

    def _ensure_storage_dir(self):
        """저장 디렉토리 생성"""
        os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)

    def _load_history(self):
        """히스토리 불러오기"""
        if os.path.exists(self.storage_path):
            try:
                with open(self.storage_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.history = [
                        CalculationEntry(**entry) for entry in data
                    ]
                logger.info(f"히스토리 불러오기 완료: {len(self.history)}개")
            except Exception as e:
                logger.error(f"히스토리 불러오기 실패: {e}")
                self.history = []
        else:
            logger.info("새 히스토리 생성")
            self.history = []

    def _save_history(self):
        """히스토리 저장"""
        try:
            with open(self.storage_path, 'w', encoding='utf-8') as f:
                data = [asdict(entry) for entry in self.history]
                json.dump(data, f, ensure_ascii=False, indent=2)
            logger.info(f"히스토리 저장 완료: {len(self.history)}개")
        except Exception as e:
            logger.error(f"히스토리 저장 실패: {e}")

    def add_calculation(
        self,
        calculator_type: str,
        inputs: Dict[str, Any],
        outputs: Dict[str, Any],
        steps: List[str]
    ) -> str:
        """
        계산 기록 추가

        Args:
            calculator_type: 계산기 종류
            inputs: 입력값
            outputs: 결과값
            steps: 풀이 과정

        Returns:
            기록 ID
        """
        entry_id = f"{calculator_type}_{datetime.now().strftime('%Y%m%d%H%M%S%f')}"

        entry = CalculationEntry(
            id=entry_id,
            calculator_type=calculator_type,
            timestamp=datetime.now().isoformat(),
            inputs=inputs,
            outputs=outputs,
            steps=steps,
            is_favorite=False
        )

        self.history.insert(0, entry)  # 최신 항목을 맨 앞에 추가
        self._save_history()

        logger.info(f"계산 기록 추가: {entry_id}")
        return entry_id

    def get_recent_history(self, limit: int = 20) -> List[CalculationEntry]:
        """
        최근 계산 기록 조회

        Args:
            limit: 조회할 기록 수

        Returns:
            계산 기록 목록
        """
        return self.history[:limit]

    def get_history_by_type(self, calculator_type: str) -> List[CalculationEntry]:
        """
        계산기 종류별 히스토리 조회

        Args:
            calculator_type: 계산기 종류

        Returns:
            계산 기록 목록
        """
        return [
            entry for entry in self.history
            if entry.calculator_type == calculator_type
        ]

    def get_favorites(self) -> List[CalculationEntry]:
        """즐겨찾기 조회"""
        return [entry for entry in self.history if entry.is_favorite]

    def toggle_favorite(self, entry_id: str):
        """
        즐겨찾기 토글

        Args:
            entry_id: 기록 ID
        """
        for entry in self.history:
            if entry.id == entry_id:
                entry.is_favorite = not entry.is_favorite
                logger.info(f"즐겨찾기 토글: {entry_id} → {entry.is_favorite}")
                self._save_history()
                return

        logger.warning(f"기록을 찾을 수 없음: {entry_id}")

    def delete_entry(self, entry_id: str):
        """
        기록 삭제

        Args:
            entry_id: 기록 ID
        """
        self.history = [e for e in self.history if e.id != entry_id]
        logger.info(f"기록 삭제: {entry_id}")
        self._save_history()

    def search_history(self, keyword: str) -> List[CalculationEntry]:
        """
        키워드로 히스토리 검색

        Args:
            keyword: 검색 키워드

        Returns:
            계산 기록 목록
        """
        keyword_lower = keyword.lower()
        results = []

        for entry in self.history:
            # 계산기 종류, 입력값, 출력값, 풀이과정에서 검색
            if (keyword_lower in entry.calculator_type.lower() or
                keyword_lower in str(entry.inputs).lower() or
                keyword_lower in str(entry.outputs).lower() or
                any(keyword_lower in step.lower() for step in entry.steps)):
                results.append(entry)

        return results

    def get_statistics(self) -> Dict[str, Any]:
        """
        히스토리 통계

        Returns:
            통계 정보
        """
        total = len(self.history)
        favorites = len([e for e in self.history if e.is_favorite])

        # 계산기 종류별 사용 횟수
        type_counts = {}
        for entry in self.history:
            calc_type = entry.calculator_type
            type_counts[calc_type] = type_counts.get(calc_type, 0) + 1

        # 가장 많이 사용한 계산기
        most_used = max(type_counts.items(), key=lambda x: x[1]) if type_counts else ("없음", 0)

        return {
            "total_calculations": total,
            "favorite_count": favorites,
            "calculator_usage": type_counts,
            "most_used_calculator": most_used[0],
            "most_used_count": most_used[1]
        }

    def clear_all(self):
        """모든 히스토리 삭제"""
        self.history = []
        self._save_history()
        logger.info("모든 히스토리 삭제")

    def clear_old_entries(self, days: int = 30):
        """
        오래된 기록 삭제

        Args:
            days: 보관 기간 (일)
        """
        from datetime import timedelta
        cutoff_date = datetime.now() - timedelta(days=days)

        original_count = len(self.history)
        self.history = [
            entry for entry in self.history
            if datetime.fromisoformat(entry.timestamp) > cutoff_date
        ]

        deleted_count = original_count - len(self.history)
        logger.info(f"{days}일 이전 기록 {deleted_count}개 삭제")
        self._save_history()

    def export_to_json(self, output_path: str):
        """
        히스토리를 JSON 파일로 내보내기

        Args:
            output_path: 출력 파일 경로
        """
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                data = [asdict(entry) for entry in self.history]
                json.dump(data, f, ensure_ascii=False, indent=2)
            logger.info(f"히스토리 내보내기 완료: {output_path}")
        except Exception as e:
            logger.error(f"히스토리 내보내기 실패: {e}")
