import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import './i18n' // ✅ LOW #9: i18n 초기화

// ✅ v1.0.25: ErrorBoundary로 앱 전체 래핑
// React 컴포넌트 에러 발생 시 백색화면 대신 친절한 에러 UI 표시
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
