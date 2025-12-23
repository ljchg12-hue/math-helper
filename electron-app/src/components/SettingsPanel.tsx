import { useState, useEffect } from 'react'
import Card from './Card'
import ConfirmDialog from './ConfirmDialog'
import { getItem, setItem, removeItem } from '../utils/safeStorage'

type Theme = 'light' | 'dark' | 'auto'
type FontSize = 'small' | 'medium' | 'large'
type Precision = 2 | 4 | 6 | 8

interface Settings {
  theme: Theme
  fontSize: FontSize
  precision: Precision
  showSteps: boolean
  saveHistory: boolean
}

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    fontSize: 'medium',
    precision: 6,
    showSteps: true,
    saveHistory: true,
  })

  const [saved, setSaved] = useState(false)

  // ✅ Phase 2: ConfirmDialog 상태
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })

  // 로컬 스토리지에서 설정 불러오기
  useEffect(() => {
    const savedSettings = getItem<Settings>('math-helper-settings')
    if (savedSettings) {
      setSettings(savedSettings)
    }
  }, [])

  // ✅ Phase 2: Auto-save (설정 변경 시 자동 저장)
  useEffect(() => {
    const timer = setTimeout(() => {
      setItem('math-helper-settings', settings)
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [settings])

  // 설정 저장
  const handleSave = () => {
    setItem('math-helper-settings', settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // 설정 초기화
  const handleReset = () => {
    const defaultSettings: Settings = {
      theme: 'light',
      fontSize: 'medium',
      precision: 6,
      showSteps: true,
      saveHistory: true,
    }
    setSettings(defaultSettings)
    setItem('math-helper-settings', defaultSettings)
  }

  // 히스토리 내보내기
  const handleExportHistory = () => {
    const history = JSON.stringify(getItem('math-helper-history', { fallback: [] }))
    const blob = new Blob([history], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `math-helper-history-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ✅ Phase 2: 히스토리 초기화 (ConfirmDialog 사용)
  const handleClearHistory = () => {
    setConfirmDialog({
      isOpen: true,
      title: '계산 기록 삭제',
      message: '정말 모든 계산 기록을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
      onConfirm: () => {
        removeItem('math-helper-history')
        setConfirmDialog({ ...confirmDialog, isOpen: false })
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    })
  }

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">설정</h2>
          <p className="text-gray-600">앱 환경을 사용자 맞춤으로 설정하세요</p>
        </div>

        {/* 테마 설정 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            🎨 테마
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light' as Theme, name: '라이트', icon: '☀️' },
              { id: 'dark' as Theme, name: '다크', icon: '🌙' },
              { id: 'auto' as Theme, name: '자동', icon: '⚙️' },
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSettings({ ...settings, theme: theme.id })}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  settings.theme === theme.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {theme.icon} {theme.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            현재: {settings.theme === 'light' ? '라이트 모드' :
                   settings.theme === 'dark' ? '다크 모드' : '시스템 설정'}
          </p>
        </div>

        {/* 폰트 크기 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            🔤 폰트 크기
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'small' as FontSize, name: '작게', size: '14px' },
              { id: 'medium' as FontSize, name: '보통', size: '16px' },
              { id: 'large' as FontSize, name: '크게', size: '18px' },
            ].map((font) => (
              <button
                key={font.id}
                onClick={() => setSettings({ ...settings, fontSize: font.id })}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  settings.fontSize === font.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{ fontSize: font.size }}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>

        {/* 계산 정밀도 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            🎯 계산 정밀도 (소수점 자릿수)
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[2, 4, 6, 8].map((precision) => (
              <button
                key={precision}
                onClick={() => setSettings({ ...settings, precision: precision as Precision })}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  settings.precision === precision
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {precision}자리
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            예시: π ≈ {Math.PI.toFixed(settings.precision)}
          </p>
        </div>

        {/* 표시 옵션 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            📋 표시 옵션
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={settings.showSteps}
                onChange={(e) => setSettings({ ...settings, showSteps: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">풀이 과정 자동 표시</div>
                <div className="text-xs text-gray-500">계산 결과와 함께 풀이 과정을 표시합니다</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={settings.saveHistory}
                onChange={(e) => setSettings({ ...settings, saveHistory: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">계산 기록 저장</div>
                <div className="text-xs text-gray-500">계산 내역을 자동으로 저장합니다</div>
              </div>
            </label>
          </div>
        </div>

        {/* 히스토리 관리 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            📜 계산 기록 관리
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportHistory}
              className="px-4 py-3 bg-green-100 hover:bg-green-200 text-green-700 font-medium rounded-lg transition-all"
            >
              📤 내보내기
            </button>
            <button
              onClick={handleClearHistory}
              className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-all"
            >
              🗑️ 전체 삭제
            </button>
          </div>
        </div>

        {/* 저장/초기화 버튼 */}
        <div className="flex gap-2 pt-4 border-t">
          <button
            onClick={handleSave}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {saved ? '✓ 저장됨!' : '💾 설정 저장'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
          >
            🔄 초기화
          </button>
        </div>

        {/* 정보 */}
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-blue-900">
            💡 설정은 자동 저장되며, 앱을 다시 열어도 유지됩니다.
          </p>
        </div>
      </div>

      {/* ✅ Phase 2: ConfirmDialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        variant="danger"
      />
    </Card>
  )
}
