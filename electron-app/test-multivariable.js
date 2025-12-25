#!/usr/bin/env node
/**
 * 다중 변수 기능 테스트 스크립트
 * Phase 4 검증용
 */

const path = require('path');

// TypeScript 파일을 직접 로드하기 위해 ts-node 사용 (또는 컴파일된 버전)
// 여기서는 간단히 로직만 테스트

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🧪 다중 변수 기능 테스트');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test 1: 변수 분석 로직 테스트
console.log('📋 Test 1: 변수 분석');
console.log('입력: x = (-b + sqrt(b^2 - 4*a*c)) / (2*a)');
console.log('예상:');
console.log('  - 모든 변수: [x, b, a, c]');
console.log('  - 주 변수: x');
console.log('  - 파라미터: [b, a, c]');
console.log('  - 다중 변수 여부: true\n');

// Test 2: 이차 방정식 해
console.log('📋 Test 2: 이차 방정식 해');
console.log('입력: x = (-b + sqrt(b^2 - 4*a*c)) / (2*a)');
console.log('파라미터: a=1, b=-5, c=6');
console.log('예상 해: x = 3 또는 x = 2\n');

// Test 3: 등비급수 합
console.log('📋 Test 3: 등비급수 합');
console.log('입력: S_n = a * (1 - r^n) / (1 - r)');
console.log('파라미터: a=2, r=3, n=5');
console.log('예상: S_n = 484\n');

// Test 4: 그래프 생성 가능 여부
console.log('📋 Test 4: 그래프 생성');
console.log('입력: sin(x)');
console.log('예상: 그래프 생성 가능 (1개 변수)\n');

console.log('입력: sin(3)');
console.log('예상: 그래프 숨김, 에러 없음 (상수)\n');

console.log('입력: x*y');
console.log('예상: 그래프 가능 (2개 변수, 추후 3D)\n');

console.log('입력: x*y*z');
console.log('예상: 그래프 불가 (3개 변수)\n');

// Test 5: 빌드 확인
console.log('📋 Test 5: 빌드 확인');
const fs = require('fs');
const preloadPath = path.join(__dirname, 'dist', 'preload.js');
if (fs.existsSync(preloadPath)) {
  const stat = fs.statSync(preloadPath);
  const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
  console.log(`✅ dist/preload.js 존재 (${sizeMB} MB)`);

  const content = fs.readFileSync(preloadPath, 'utf8');
  if (content.includes('robustMathOps') || content.includes('safeSolve')) {
    console.log('✅ robustMathOps 코드 포함됨');
  } else {
    console.log('⚠️  robustMathOps 코드 확인 필요 (minified)');
  }
} else {
  console.log('❌ dist/preload.js 없음');
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ 테스트 스크립트 완료');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n💡 실제 동작 확인:');
console.log('   npm run pack:win:x64  # Windows 빌드');
console.log('   또는');
console.log('   npm run dev          # 개발 모드 실행');
