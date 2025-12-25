import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp, Check, X, Clock, Zap } from 'lucide-react'
import { prioritizeResults } from '../utils/resultPriority'
import './SmartResultView.css'

interface SmartResultViewProps {
  results: UnifiedCalcResult[]
  input: string
  onModeClick?: (mode: CalculatorMode) => void
}

/**
 * 스마트 결과 뷰 - 주 결과 강조 + 상세 정보 접기
 *
 * 통합 계산 결과를 우선순위에 따라 표시:
 * - 주 결과: 크게 강조 표시
 * - 부가 정보: 접기/펼치기로 표시
 * - 적용 불가: 회색으로 이유와 함께 표시
 */
export default function SmartResultView({ results, input, onModeClick }: SmartResultViewProps) {
  const { t } = useTranslation()
  const [showDetails, setShowDetails] = useState(false)
  const [showNotApplicable, setShowNotApplicable] = useState(false)

  const { primary, secondary, notApplicable, stats } = prioritizeResults(results, input)

  /**
   * 모드 이름을 한국어 레이블로 변환
   */
  const getModeLabel = (mode: CalculatorMode): string => {
    return t(`modes.${mode}`)
  }

  /**
   * 결과 값을 문자열로 포맷팅
   */
  const formatResultValue = (result: UnifiedCalcResult): string => {
    if (!result.success || !result.result) {
      return result.error || t('errors.cannotCalculate')
    }

    const res = result.result

    // 해 풀이 결과
    if (res.solutions && res.solutions.length > 0) {
      if (res.variable) {
        return res.solutions.map(s => `${res.variable} = ${s}`).join(', ')
      }
      return res.solutions.join(', ')
    }

    // 일반 결과
    if (res.result !== undefined) {
      return String(res.result)
    }

    return t('errors.cannotCalculate')
  }

  return (
    <div className="smart-result-container">
      {/* 통계 배너 */}
      <div className="stats-banner">
        <div className="stats-content">
          <div className="stats-item">
            <Zap className="stats-icon" size={16} />
            <span className="stats-label">{t('ui.calculateAllComplete') || '통합 계산 완료'}</span>
          </div>
          <div className="stats-metrics">
            <span className="metric success">
              <Check size={14} />
              {t('ui.success') || '성공'} {stats.success}
            </span>
            <span className="metric failure">
              <X size={14} />
              {t('ui.failure') || '실패'} {stats.failure}
            </span>
            <span className="metric time">
              <Clock size={14} />
              {stats.totalTime.toFixed(1)}ms
            </span>
          </div>
        </div>
      </div>

      {/* 주 결과 - 크게 강조 */}
      <div
        className="primary-result"
        onClick={() => onModeClick?.(primary.mode)}
        style={{ cursor: onModeClick ? 'pointer' : 'default' }}
      >
        <div className="result-label">{t('ui.finalAnswer') || '최종 답'}</div>
        <div className="result-value">{formatResultValue(primary.result)}</div>
        <div className="result-mode-badge">
          {primary.result.icon} {getModeLabel(primary.mode)}
        </div>

        {/* 계산 과정 (있는 경우) */}
        {primary.result.success && primary.result.result?.steps && primary.result.result.steps.length > 0 && (
          <details className="calculation-steps">
            <summary>{t('ui.viewSteps') || '계산 과정 보기'}</summary>
            <ol>
              {primary.result.result.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </details>
        )}

        {/* 실행 시간 */}
        <div className="execution-time">
          {t('ui.executionTime') || '실행 시간'}: {primary.result.executionTime.toFixed(1)}ms
        </div>
      </div>

      {/* 추가 정보 - 접기/펼치기 */}
      {secondary.length > 0 && (
        <div className="secondary-results">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="toggle-details"
          >
            {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            <span>{t('ui.additionalInfo') || '추가 정보'} ({secondary.length}개)</span>
          </button>

          {showDetails && (
            <div className="details-grid">
              {secondary.map(({ mode, result }) => (
                <div
                  key={mode}
                  className="detail-card success"
                  onClick={() => onModeClick?.(mode)}
                  style={{ cursor: onModeClick ? 'pointer' : 'default' }}
                >
                  <div className="detail-header">
                    <span className="detail-icon">{result.icon}</span>
                    <span className="detail-label">{getModeLabel(mode)}</span>
                  </div>
                  <div className="detail-value">{formatResultValue(result)}</div>
                  <div className="detail-time">
                    {result.executionTime.toFixed(1)}ms
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 적용 불가 - 별도 섹션 */}
      {notApplicable.length > 0 && (
        <div className="secondary-results">
          <button
            onClick={() => setShowNotApplicable(!showNotApplicable)}
            className="toggle-details na-toggle"
          >
            {showNotApplicable ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            <span>{t('ui.notApplicable') || '적용 불가'} ({notApplicable.length}개)</span>
          </button>

          {showNotApplicable && (
            <div className="not-applicable">
              <div className="na-list">
                {notApplicable.map(({ mode, reason }) => (
                  <div key={mode} className="na-item">
                    <div className="na-item-header">
                      <X size={16} className="na-icon" />
                      <span className="na-mode">{getModeLabel(mode)}</span>
                    </div>
                    <span className="na-reason">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
