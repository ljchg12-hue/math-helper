"""
데이터 백업 및 내보내기 모듈
JSON, CSV 형식 지원
"""
import json
import csv
from typing import List, Dict, Any
from pathlib import Path
from datetime import datetime
from ..utils.logger import get_logger

logger = get_logger()


class DataExporter:
    """데이터 내보내기 클래스"""

    @staticmethod
    def export_to_json(data: Any, filepath: str) -> bool:
        """
        데이터를 JSON 파일로 내보내기

        Args:
            data: 내보낼 데이터
            filepath: 저장 경로

        Returns:
            성공 여부
        """
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            logger.info(f"JSON 내보내기 성공: {filepath}")
            return True
        except Exception as e:
            logger.error(f"JSON 내보내기 실패: {e}")
            return False

    @staticmethod
    def import_from_json(filepath: str) -> Any:
        """
        JSON 파일에서 데이터 가져오기

        Args:
            filepath: 파일 경로

        Returns:
            불러온 데이터
        """
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            logger.info(f"JSON 가져오기 성공: {filepath}")
            return data
        except Exception as e:
            logger.error(f"JSON 가져오기 실패: {e}")
            return None

    @staticmethod
    def export_to_csv(
        data: List[Dict[str, Any]],
        filepath: str,
        fieldnames: List[str] = None
    ) -> bool:
        """
        데이터를 CSV 파일로 내보내기

        Args:
            data: 딕셔너리 리스트
            filepath: 저장 경로
            fieldnames: 컬럼 이름 (None이면 첫 번째 항목의 키 사용)

        Returns:
            성공 여부
        """
        try:
            if not data:
                logger.warning("내보낼 데이터가 없습니다")
                return False

            if fieldnames is None:
                fieldnames = list(data[0].keys())

            with open(filepath, 'w', newline='', encoding='utf-8-sig') as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(data)

            logger.info(f"CSV 내보내기 성공: {filepath}")
            return True
        except Exception as e:
            logger.error(f"CSV 내보내기 실패: {e}")
            return False

    @staticmethod
    def import_from_csv(filepath: str) -> List[Dict[str, Any]]:
        """
        CSV 파일에서 데이터 가져오기

        Args:
            filepath: 파일 경로

        Returns:
            딕셔너리 리스트
        """
        try:
            data = []
            with open(filepath, 'r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                data = list(reader)

            logger.info(f"CSV 가져오기 성공: {filepath} ({len(data)}개 항목)")
            return data
        except Exception as e:
            logger.error(f"CSV 가져오기 실패: {e}")
            return []

    @staticmethod
    def create_backup(
        history_data: List[Any],
        progress_data: Dict[str, Any],
        mistakes_data: List[Any],
        backup_dir: str = "./backups"
    ) -> str:
        """
        전체 데이터 통합 백업

        Args:
            history_data: 히스토리 데이터
            progress_data: 진도 데이터
            mistakes_data: 오답 데이터
            backup_dir: 백업 디렉토리

        Returns:
            백업 파일 경로
        """
        try:
            # 백업 디렉토리 생성
            Path(backup_dir).mkdir(parents=True, exist_ok=True)

            # 백업 파일명 생성 (타임스탬프 포함)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_file = f"{backup_dir}/math_helper_backup_{timestamp}.json"

            # 백업 데이터 구조
            backup_data = {
                'backup_info': {
                    'timestamp': datetime.now().isoformat(),
                    'version': '1.0',
                    'app': 'Math Helper'
                },
                'history': history_data,
                'progress': progress_data,
                'mistakes': mistakes_data
            }

            # JSON으로 저장
            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(backup_data, f, ensure_ascii=False, indent=2)

            logger.info(f"통합 백업 성공: {backup_file}")
            return backup_file

        except Exception as e:
            logger.error(f"통합 백업 실패: {e}")
            return ""

    @staticmethod
    def restore_backup(backup_file: str) -> Dict[str, Any]:
        """
        백업 파일에서 데이터 복원

        Args:
            backup_file: 백업 파일 경로

        Returns:
            복원된 데이터 딕셔너리
        """
        try:
            with open(backup_file, 'r', encoding='utf-8') as f:
                backup_data = json.load(f)

            logger.info(f"백업 복원 성공: {backup_file}")
            return {
                'history': backup_data.get('history', []),
                'progress': backup_data.get('progress', {}),
                'mistakes': backup_data.get('mistakes', []),
                'backup_info': backup_data.get('backup_info', {})
            }

        except Exception as e:
            logger.error(f"백업 복원 실패: {e}")
            return {
                'history': [],
                'progress': {},
                'mistakes': [],
                'backup_info': {}
            }


class ProgressDataFormatter:
    """학습 진도 데이터 포맷터"""

    @staticmethod
    def to_csv_format(topic_progress: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        진도 데이터를 CSV 형식으로 변환

        Args:
            topic_progress: 주제별 진도 데이터

        Returns:
            CSV용 딕셔너리 리스트
        """
        csv_data = []
        for topic, progress in topic_progress.items():
            csv_data.append({
                '주제': topic,
                '시도한_문제': progress.problems_attempted,
                '정답_수': progress.problems_correct,
                '숙달도': f"{progress.mastery_level * 100:.1f}%",
                '학습_시간(분)': progress.study_time_minutes,
                '마지막_학습': progress.last_studied
            })
        return csv_data

    @staticmethod
    def to_summary_report(
        topic_progress: Dict[str, Any],
        overall_stats: Dict[str, Any]
    ) -> str:
        """
        진도 데이터를 텍스트 리포트로 변환

        Args:
            topic_progress: 주제별 진도
            overall_stats: 전체 통계

        Returns:
            텍스트 리포트
        """
        report_lines = [
            "=" * 60,
            "학습 진도 리포트",
            "=" * 60,
            f"생성 일시: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "",
            "[ 전체 통계 ]",
            f"학습한 주제 수: {overall_stats.get('total_topics', 0)}개",
            f"총 풀이 문제: {overall_stats.get('total_problems_attempted', 0)}개",
            f"총 정답 수: {overall_stats.get('total_problems_correct', 0)}개",
            f"전체 정답률: {overall_stats.get('overall_accuracy', 0):.1f}%",
            f"총 학습 시간: {overall_stats.get('total_study_time_minutes', 0)}분",
            "",
            "[ 주제별 상세 ]",
            "-" * 60
        ]

        for topic, progress in topic_progress.items():
            report_lines.extend([
                f"주제: {topic}",
                f"  - 시도: {progress.problems_attempted}개 | 정답: {progress.problems_correct}개",
                f"  - 숙달도: {progress.mastery_level * 100:.1f}%",
                f"  - 학습 시간: {progress.study_time_minutes}분",
                f"  - 마지막 학습: {progress.last_studied}",
                ""
            ])

        report_lines.extend([
            "=" * 60,
            "리포트 끝"
        ])

        return "\n".join(report_lines)


class MistakeDataFormatter:
    """오답 데이터 포맷터"""

    @staticmethod
    def to_csv_format(mistakes: List[Any]) -> List[Dict[str, Any]]:
        """
        오답 데이터를 CSV 형식으로 변환

        Args:
            mistakes: 오답 리스트

        Returns:
            CSV용 딕셔너리 리스트
        """
        csv_data = []
        for mistake in mistakes:
            csv_data.append({
                'ID': mistake.id[:8],
                '주제': mistake.topic,
                '문제': mistake.question,
                '내_답변': mistake.user_answer,
                '정답': mistake.correct_answer,
                '시도_횟수': mistake.attempts,
                '마스터_여부': '완료' if mistake.mastered else '복습필요',
                '메모': mistake.notes or '',
                '등록일': mistake.timestamp
            })
        return csv_data

    @staticmethod
    def to_review_sheet(mistakes: List[Any], unmastered_only: bool = True) -> str:
        """
        오답을 복습용 시트로 변환

        Args:
            mistakes: 오답 리스트
            unmastered_only: 미완료 오답만 포함

        Returns:
            복습 시트 텍스트
        """
        if unmastered_only:
            mistakes = [m for m in mistakes if not m.mastered]

        sheet_lines = [
            "=" * 60,
            "오답 복습 시트",
            "=" * 60,
            f"생성 일시: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"총 {len(mistakes)}개 문제",
            ""
        ]

        for idx, mistake in enumerate(mistakes, 1):
            sheet_lines.extend([
                f"[ 문제 {idx} ] {mistake.topic}",
                f"Q: {mistake.question}",
                f"내 답변: {mistake.user_answer}",
                f"정답: {mistake.correct_answer}",
                f"시도 횟수: {mistake.attempts}회",
                f"메모: {mistake.notes or '없음'}",
                "",
                "-" * 60,
                ""
            ])

        return "\n".join(sheet_lines)
