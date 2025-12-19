#!/bin/bash
# 테스트 실행 스크립트

echo "=========================================="
echo "Math Helper 테스트 실행"
echo "=========================================="

# 가상환경 활성화 확인
if [ -z "$VIRTUAL_ENV" ]; then
    echo "⚠️  경고: 가상환경이 활성화되지 않았습니다."
    echo "   권장: python -m venv venv && source venv/bin/activate"
    echo ""
fi

# pytest 설치 확인
if ! command -v pytest &> /dev/null; then
    echo "❌ pytest가 설치되지 않았습니다."
    echo "   설치: pip install -r requirements-dev.txt"
    exit 1
fi

# 테스트 실행
echo "🧪 테스트 실행 중..."
pytest "$@"

# 결과 확인
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 모든 테스트 통과!"
else
    echo ""
    echo "❌ 일부 테스트 실패"
    exit 1
fi
