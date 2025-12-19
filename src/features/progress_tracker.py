"""
학습 진도 추적 모듈
학생의 학습 진도와 성취도를 추적합니다.
"""
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from ..utils.logger import get_logger

logger = get_logger()


@dataclass
class TopicProgress:
    """주제별 학습 진도 클래스"""
    topic: str
    problems_attempted: int  # 시도한 문제 수
    problems_correct: int  # 맞힌 문제 수
    last_studied: str  # 마지막 학습 일시
    mastery_level: float  # 숙달도 (0.0 ~ 1.0)
    study_time_minutes: int  # 총 학습 시간 (분)


@dataclass
class StudySession:
    """학습 세션 클래스"""
    session_id: str
    topic: str
    start_time: str
    end_time: Optional[str]
    problems_solved: int
    problems_correct: int
    duration_minutes: int


class ProgressTracker:
    """학습 진도 추적 클래스"""

    def __init__(self, storage_path: str = "data/progress.json"):
        """
        초기화

        Args:
            storage_path: 진도 데이터 저장 경로
        """
        logger.info("학습 진도 추적기 초기화")
        self.storage_path = storage_path
        self.topic_progress: Dict[str, TopicProgress] = {}
        self.sessions: List[StudySession] = []
        self._ensure_storage_dir()
        self._load_progress()

    def _ensure_storage_dir(self):
        """저장 디렉토리 생성"""
        os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)

    def _load_progress(self):
        """진도 데이터 불러오기"""
        if os.path.exists(self.storage_path):
            try:
                with open(self.storage_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                    # 주제별 진도
                    self.topic_progress = {
                        topic: TopicProgress(**prog)
                        for topic, prog in data.get("topics", {}).items()
                    }

                    # 세션 기록
                    self.sessions = [
                        StudySession(**session)
                        for session in data.get("sessions", [])
                    ]

                logger.info(f"진도 데이터 불러오기 완료: {len(self.topic_progress)}개 주제")
            except Exception as e:
                logger.error(f"진도 데이터 불러오기 실패: {e}")
                self.topic_progress = {}
                self.sessions = []
        else:
            logger.info("새 진도 데이터 생성")
            self.topic_progress = {}
            self.sessions = []

    def _save_progress(self):
        """진도 데이터 저장"""
        try:
            data = {
                "topics": {
                    topic: asdict(prog)
                    for topic, prog in self.topic_progress.items()
                },
                "sessions": [asdict(session) for session in self.sessions]
            }

            with open(self.storage_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            logger.info("진도 데이터 저장 완료")
        except Exception as e:
            logger.error(f"진도 데이터 저장 실패: {e}")

    def record_attempt(
        self,
        topic: str,
        is_correct: bool,
        study_time_minutes: int = 0
    ):
        """
        문제 풀이 기록

        Args:
            topic: 주제
            is_correct: 정답 여부
            study_time_minutes: 학습 시간 (분)
        """
        if topic not in self.topic_progress:
            self.topic_progress[topic] = TopicProgress(
                topic=topic,
                problems_attempted=0,
                problems_correct=0,
                last_studied=datetime.now().isoformat(),
                mastery_level=0.0,
                study_time_minutes=0
            )

        progress = self.topic_progress[topic]
        progress.problems_attempted += 1
        if is_correct:
            progress.problems_correct += 1
        progress.last_studied = datetime.now().isoformat()
        progress.study_time_minutes += study_time_minutes

        # 숙달도 계산 (정답률 기반)
        if progress.problems_attempted > 0:
            progress.mastery_level = progress.problems_correct / progress.problems_attempted

        logger.info(f"학습 기록: {topic}, 정답={is_correct}")
        self._save_progress()

    def start_session(self, topic: str) -> str:
        """
        학습 세션 시작

        Args:
            topic: 주제

        Returns:
            세션 ID
        """
        session_id = f"session_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        session = StudySession(
            session_id=session_id,
            topic=topic,
            start_time=datetime.now().isoformat(),
            end_time=None,
            problems_solved=0,
            problems_correct=0,
            duration_minutes=0
        )
        self.sessions.append(session)
        logger.info(f"세션 시작: {session_id}, {topic}")
        return session_id

    def end_session(
        self,
        session_id: str,
        problems_solved: int,
        problems_correct: int
    ):
        """
        학습 세션 종료

        Args:
            session_id: 세션 ID
            problems_solved: 푼 문제 수
            problems_correct: 맞힌 문제 수
        """
        for session in self.sessions:
            if session.session_id == session_id:
                session.end_time = datetime.now().isoformat()
                session.problems_solved = problems_solved
                session.problems_correct = problems_correct

                # 세션 시간 계산
                start = datetime.fromisoformat(session.start_time)
                end = datetime.fromisoformat(session.end_time)
                session.duration_minutes = int((end - start).total_seconds() / 60)

                logger.info(f"세션 종료: {session_id}, {session.duration_minutes}분")
                self._save_progress()
                return

    def get_topic_progress(self, topic: str) -> Optional[TopicProgress]:
        """
        주제별 진도 조회

        Args:
            topic: 주제

        Returns:
            TopicProgress 또는 None
        """
        return self.topic_progress.get(topic)

    def get_all_progress(self) -> Dict[str, TopicProgress]:
        """모든 주제의 진도 조회"""
        return self.topic_progress.copy()

    def get_overall_statistics(self) -> Dict[str, Any]:
        """
        전체 학습 통계

        Returns:
            통계 정보
        """
        total_problems = sum(p.problems_attempted for p in self.topic_progress.values())
        total_correct = sum(p.problems_correct for p in self.topic_progress.values())
        total_time = sum(p.study_time_minutes for p in self.topic_progress.values())

        return {
            "total_topics": len(self.topic_progress),
            "total_problems_attempted": total_problems,
            "total_problems_correct": total_correct,
            "overall_accuracy": (total_correct / total_problems * 100) if total_problems > 0 else 0,
            "total_study_time_minutes": total_time,
            "total_study_time_hours": round(total_time / 60, 2),
            "average_mastery_level": (
                sum(p.mastery_level for p in self.topic_progress.values()) /
                len(self.topic_progress)
            ) if self.topic_progress else 0
        }

    def get_weak_topics(self, threshold: float = 0.6) -> List[str]:
        """
        약한 주제 찾기

        Args:
            threshold: 숙달도 기준 (기본값 0.6)

        Returns:
            약한 주제 목록
        """
        weak_topics = [
            topic for topic, progress in self.topic_progress.items()
            if progress.mastery_level < threshold
        ]
        return weak_topics

    def get_recent_sessions(self, limit: int = 10) -> List[StudySession]:
        """
        최근 세션 조회

        Args:
            limit: 조회할 세션 수

        Returns:
            세션 목록
        """
        # 최신순으로 정렬
        sorted_sessions = sorted(
            self.sessions,
            key=lambda s: s.start_time,
            reverse=True
        )
        return sorted_sessions[:limit]

    def reset_topic_progress(self, topic: str):
        """
        주제별 진도 초기화

        Args:
            topic: 주제
        """
        if topic in self.topic_progress:
            del self.topic_progress[topic]
            logger.info(f"진도 초기화: {topic}")
            self._save_progress()

    def reset_all_progress(self):
        """모든 진도 초기화"""
        self.topic_progress = {}
        self.sessions = []
        logger.info("모든 진도 초기화")
        self._save_progress()
