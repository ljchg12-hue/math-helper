"""
오답 노트 모듈
틀린 문제를 저장하고 복습할 수 있는 기능을 제공합니다.
"""
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from ..utils.logger import get_logger

logger = get_logger()


@dataclass
class MistakeEntry:
    """오답 기록 클래스"""
    id: str
    topic: str
    question: str
    user_answer: Any
    correct_answer: Any
    timestamp: str
    attempts: int  # 재시도 횟수
    mastered: bool  # 마스터 여부
    notes: str  # 사용자 메모


class MistakeNotes:
    """오답 노트 클래스"""

    def __init__(self, storage_path: str = "data/mistakes.json"):
        """
        초기화

        Args:
            storage_path: 오답 노트 저장 경로
        """
        logger.info("오답 노트 초기화")
        self.storage_path = storage_path
        self.mistakes: List[MistakeEntry] = []
        self._ensure_storage_dir()
        self._load_mistakes()

    def _ensure_storage_dir(self):
        """저장 디렉토리 생성"""
        os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)

    def _load_mistakes(self):
        """오답 노트 불러오기"""
        if os.path.exists(self.storage_path):
            try:
                with open(self.storage_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.mistakes = [
                        MistakeEntry(**entry) for entry in data
                    ]
                logger.info(f"오답 노트 불러오기 완료: {len(self.mistakes)}개")
            except Exception as e:
                logger.error(f"오답 노트 불러오기 실패: {e}")
                self.mistakes = []
        else:
            logger.info("새 오답 노트 생성")
            self.mistakes = []

    def _save_mistakes(self):
        """오답 노트 저장"""
        try:
            with open(self.storage_path, 'w', encoding='utf-8') as f:
                data = [asdict(entry) for entry in self.mistakes]
                json.dump(data, f, ensure_ascii=False, indent=2)
            logger.info(f"오답 노트 저장 완료: {len(self.mistakes)}개")
        except Exception as e:
            logger.error(f"오답 노트 저장 실패: {e}")

    def add_mistake(
        self,
        topic: str,
        question: str,
        user_answer: Any,
        correct_answer: Any,
        notes: str = ""
    ) -> str:
        """
        오답 추가

        Args:
            topic: 주제
            question: 문제
            user_answer: 사용자 답안
            correct_answer: 정답
            notes: 메모

        Returns:
            오답 ID
        """
        entry_id = f"{topic}_{datetime.now().strftime('%Y%m%d%H%M%S')}"

        entry = MistakeEntry(
            id=entry_id,
            topic=topic,
            question=question,
            user_answer=user_answer,
            correct_answer=correct_answer,
            timestamp=datetime.now().isoformat(),
            attempts=0,
            mastered=False,
            notes=notes
        )

        self.mistakes.append(entry)
        self._save_mistakes()

        logger.info(f"오답 추가: {entry_id}")
        return entry_id

    def get_mistakes_by_topic(self, topic: str) -> List[MistakeEntry]:
        """
        주제별 오답 조회

        Args:
            topic: 주제

        Returns:
            오답 목록
        """
        return [m for m in self.mistakes if m.topic == topic]

    def get_unmastered_mistakes(self) -> List[MistakeEntry]:
        """마스터하지 못한 오답 조회"""
        return [m for m in self.mistakes if not m.mastered]

    def mark_as_mastered(self, mistake_id: str):
        """
        마스터 표시

        Args:
            mistake_id: 오답 ID
        """
        for mistake in self.mistakes:
            if mistake.id == mistake_id:
                mistake.mastered = True
                logger.info(f"마스터 표시: {mistake_id}")
                self._save_mistakes()
                return

        logger.warning(f"오답을 찾을 수 없음: {mistake_id}")

    def increment_attempts(self, mistake_id: str):
        """
        재시도 횟수 증가

        Args:
            mistake_id: 오답 ID
        """
        for mistake in self.mistakes:
            if mistake.id == mistake_id:
                mistake.attempts += 1
                logger.info(f"재시도 횟수 증가: {mistake_id} → {mistake.attempts}")
                self._save_mistakes()
                return

    def update_notes(self, mistake_id: str, notes: str):
        """
        메모 업데이트

        Args:
            mistake_id: 오답 ID
            notes: 새 메모
        """
        for mistake in self.mistakes:
            if mistake.id == mistake_id:
                mistake.notes = notes
                logger.info(f"메모 업데이트: {mistake_id}")
                self._save_mistakes()
                return

    def delete_mistake(self, mistake_id: str):
        """
        오답 삭제

        Args:
            mistake_id: 오답 ID
        """
        self.mistakes = [m for m in self.mistakes if m.id != mistake_id]
        logger.info(f"오답 삭제: {mistake_id}")
        self._save_mistakes()

    def get_statistics(self) -> Dict[str, Any]:
        """
        오답 노트 통계

        Returns:
            통계 정보
        """
        total = len(self.mistakes)
        mastered = len([m for m in self.mistakes if m.mastered])
        unmastered = total - mastered

        topics = {}
        for mistake in self.mistakes:
            if mistake.topic not in topics:
                topics[mistake.topic] = {"total": 0, "mastered": 0}
            topics[mistake.topic]["total"] += 1
            if mistake.mastered:
                topics[mistake.topic]["mastered"] += 1

        return {
            "total_mistakes": total,
            "mastered_count": mastered,
            "unmastered_count": unmastered,
            "mastery_rate": (mastered / total * 100) if total > 0 else 0,
            "topics": topics
        }

    def get_all_mistakes(self) -> List[MistakeEntry]:
        """모든 오답 조회"""
        return self.mistakes.copy()

    def clear_all(self):
        """모든 오답 삭제"""
        self.mistakes = []
        self._save_mistakes()
        logger.info("모든 오답 삭제")
