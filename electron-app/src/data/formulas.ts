export interface Formula {
  id: string
  category: string
  name: string
  formula: string
  description: string
  variables?: string
}

export const formulaCategories = [
  { id: 'algebra', name: '대수', nameEn: 'Algebra' },
  { id: 'geometry', name: '기하학', nameEn: 'Geometry' },
  { id: 'trigonometry', name: '삼각함수', nameEn: 'Trigonometry' },
  { id: 'calculus', name: '미적분', nameEn: 'Calculus' },
  { id: 'statistics', name: '통계', nameEn: 'Statistics' },
  { id: 'physics', name: '물리', nameEn: 'Physics' },
]

export const formulas: Formula[] = [
  // 대수 (Algebra)
  {
    id: 'alg-1',
    category: 'algebra',
    name: '이차방정식 해의 공식',
    formula: 'x = (-b ± sqrt(b^2 - 4*a*c)) / (2*a)',
    description: 'ax² + bx + c = 0의 해',
    variables: 'a, b, c'
  },
  {
    id: 'alg-2',
    category: 'algebra',
    name: '완전제곱식',
    formula: '(a + b)^2 = a^2 + 2*a*b + b^2',
    description: '합의 제곱',
  },
  {
    id: 'alg-3',
    category: 'algebra',
    name: '완전제곱식 (차)',
    formula: '(a - b)^2 = a^2 - 2*a*b + b^2',
    description: '차의 제곱',
  },
  {
    id: 'alg-4',
    category: 'algebra',
    name: '곱셈 공식',
    formula: '(a + b) * (a - b) = a^2 - b^2',
    description: '합차공식',
  },
  {
    id: 'alg-5',
    category: 'algebra',
    name: '세제곱 합',
    formula: '(a + b)^3 = a^3 + 3*a^2*b + 3*a*b^2 + b^3',
    description: '합의 세제곱',
  },
  {
    id: 'alg-6',
    category: 'algebra',
    name: '세제곱 차',
    formula: '(a - b)^3 = a^3 - 3*a^2*b + 3*a*b^2 - b^3',
    description: '차의 세제곱',
  },
  {
    id: 'alg-7',
    category: 'algebra',
    name: '인수분해 (합)',
    formula: 'a^3 + b^3 = (a + b) * (a^2 - a*b + b^2)',
    description: '세제곱의 합',
  },
  {
    id: 'alg-8',
    category: 'algebra',
    name: '인수분해 (차)',
    formula: 'a^3 - b^3 = (a - b) * (a^2 + a*b + b^2)',
    description: '세제곱의 차',
  },
  {
    id: 'alg-9',
    category: 'algebra',
    name: '등차수열 합',
    formula: 'S_n = n * (a_1 + a_n) / 2',
    description: '첫째항 a₁, 끝항 aₙ',
    variables: 'n, a_1, a_n'
  },
  {
    id: 'alg-10',
    category: 'algebra',
    name: '등비수열 합',
    formula: 'S_n = a * (1 - r^n) / (1 - r)',
    description: '첫째항 a, 공비 r',
    variables: 'a, r, n'
  },

  // 기하학 (Geometry)
  {
    id: 'geo-1',
    category: 'geometry',
    name: '직선의 기울기',
    formula: 'm = (y_2 - y_1) / (x_2 - x_1)',
    description: '두 점을 지나는 직선',
    variables: 'x_1, y_1, x_2, y_2'
  },
  {
    id: 'geo-2',
    category: 'geometry',
    name: '두 점 사이 거리',
    formula: 'd = sqrt((x_2 - x_1)^2 + (y_2 - y_1)^2)',
    description: '평면 위의 두 점 사이 거리',
    variables: 'x_1, y_1, x_2, y_2'
  },
  {
    id: 'geo-3',
    category: 'geometry',
    name: '원의 방정식',
    formula: '(x - h)^2 + (y - k)^2 = r^2',
    description: '중심 (h, k), 반지름 r',
    variables: 'h, k, r'
  },
  {
    id: 'geo-4',
    category: 'geometry',
    name: '원의 넓이',
    formula: 'A = pi * r^2',
    description: '반지름 r인 원의 넓이',
    variables: 'r'
  },
  {
    id: 'geo-5',
    category: 'geometry',
    name: '원의 둘레',
    formula: 'C = 2 * pi * r',
    description: '반지름 r인 원의 둘레',
    variables: 'r'
  },
  {
    id: 'geo-6',
    category: 'geometry',
    name: '삼각형 넓이',
    formula: 'A = (b * h) / 2',
    description: '밑변 b, 높이 h',
    variables: 'b, h'
  },
  {
    id: 'geo-7',
    category: 'geometry',
    name: '헤론의 공식',
    formula: 'A = sqrt(s * (s-a) * (s-b) * (s-c))',
    description: 's = (a+b+c)/2',
    variables: 'a, b, c'
  },
  {
    id: 'geo-8',
    category: 'geometry',
    name: '구의 부피',
    formula: 'V = (4/3) * pi * r^3',
    description: '반지름 r인 구',
    variables: 'r'
  },
  {
    id: 'geo-9',
    category: 'geometry',
    name: '구의 겉넓이',
    formula: 'S = 4 * pi * r^2',
    description: '반지름 r인 구',
    variables: 'r'
  },
  {
    id: 'geo-10',
    category: 'geometry',
    name: '원기둥 부피',
    formula: 'V = pi * r^2 * h',
    description: '반지름 r, 높이 h',
    variables: 'r, h'
  },

  // 삼각함수 (Trigonometry)
  {
    id: 'trig-1',
    category: 'trigonometry',
    name: '피타고라스 정리',
    formula: 'a^2 + b^2 = c^2',
    description: '직각삼각형의 빗변',
  },
  {
    id: 'trig-2',
    category: 'trigonometry',
    name: '사인 법칙',
    formula: 'a / sin(A) = b / sin(B) = c / sin(C)',
    description: '삼각형의 변과 각',
  },
  {
    id: 'trig-3',
    category: 'trigonometry',
    name: '코사인 법칙',
    formula: 'c^2 = a^2 + b^2 - 2*a*b*cos(C)',
    description: '삼각형의 변과 각',
  },
  {
    id: 'trig-4',
    category: 'trigonometry',
    name: '삼각함수 항등식',
    formula: 'sin^2(x) + cos^2(x) = 1',
    description: '기본 항등식',
  },
  {
    id: 'trig-5',
    category: 'trigonometry',
    name: '탄젠트 정의',
    formula: 'tan(x) = sin(x) / cos(x)',
    description: '탄젠트 함수',
  },
  {
    id: 'trig-6',
    category: 'trigonometry',
    name: '사인 덧셈공식',
    formula: 'sin(a + b) = sin(a)*cos(b) + cos(a)*sin(b)',
    description: '합의 사인',
  },
  {
    id: 'trig-7',
    category: 'trigonometry',
    name: '코사인 덧셈공식',
    formula: 'cos(a + b) = cos(a)*cos(b) - sin(a)*sin(b)',
    description: '합의 코사인',
  },
  {
    id: 'trig-8',
    category: 'trigonometry',
    name: '배각공식 (사인)',
    formula: 'sin(2*x) = 2*sin(x)*cos(x)',
    description: '2배각 사인',
  },
  {
    id: 'trig-9',
    category: 'trigonometry',
    name: '배각공식 (코사인)',
    formula: 'cos(2*x) = cos^2(x) - sin^2(x)',
    description: '2배각 코사인',
  },
  {
    id: 'trig-10',
    category: 'trigonometry',
    name: '반각공식 (사인)',
    formula: 'sin(x/2) = ±sqrt((1 - cos(x)) / 2)',
    description: '반각 사인',
  },

  // 미적분 (Calculus)
  {
    id: 'calc-1',
    category: 'calculus',
    name: '거듭제곱 미분',
    formula: 'd/dx(x^n) = n*x^(n-1)',
    description: 'x의 n제곱 미분',
  },
  {
    id: 'calc-2',
    category: 'calculus',
    name: '사인 미분',
    formula: 'd/dx(sin(x)) = cos(x)',
    description: '사인 함수 미분',
  },
  {
    id: 'calc-3',
    category: 'calculus',
    name: '코사인 미분',
    formula: 'd/dx(cos(x)) = -sin(x)',
    description: '코사인 함수 미분',
  },
  {
    id: 'calc-4',
    category: 'calculus',
    name: '지수함수 미분',
    formula: 'd/dx(e^x) = e^x',
    description: '자연지수함수 미분',
  },
  {
    id: 'calc-5',
    category: 'calculus',
    name: '로그함수 미분',
    formula: 'd/dx(ln(x)) = 1/x',
    description: '자연로그 미분',
  },
  {
    id: 'calc-6',
    category: 'calculus',
    name: '곱의 미분',
    formula: 'd/dx(f*g) = f\'*g + f*g\'',
    description: '곱의 법칙',
  },
  {
    id: 'calc-7',
    category: 'calculus',
    name: '몫의 미분',
    formula: 'd/dx(f/g) = (f\'*g - f*g\') / g^2',
    description: '몫의 법칙',
  },
  {
    id: 'calc-8',
    category: 'calculus',
    name: '합성함수 미분',
    formula: 'd/dx(f(g(x))) = f\'(g(x)) * g\'(x)',
    description: '연쇄법칙',
  },
  {
    id: 'calc-9',
    category: 'calculus',
    name: '거듭제곱 적분',
    formula: '∫ x^n dx = x^(n+1) / (n+1) + C',
    description: 'n ≠ -1',
  },
  {
    id: 'calc-10',
    category: 'calculus',
    name: '지수함수 적분',
    formula: '∫ e^x dx = e^x + C',
    description: '자연지수함수 적분',
  },
  {
    id: 'calc-11',
    category: 'calculus',
    name: '사인 적분',
    formula: '∫ sin(x) dx = -cos(x) + C',
    description: '사인 함수 적분',
  },
  {
    id: 'calc-12',
    category: 'calculus',
    name: '코사인 적분',
    formula: '∫ cos(x) dx = sin(x) + C',
    description: '코사인 함수 적분',
  },

  // 통계 (Statistics)
  {
    id: 'stat-1',
    category: 'statistics',
    name: '평균',
    formula: 'μ = (x_1 + x_2 + ... + x_n) / n',
    description: '산술평균',
  },
  {
    id: 'stat-2',
    category: 'statistics',
    name: '분산',
    formula: 'σ^2 = Σ(x_i - μ)^2 / n',
    description: '모분산',
  },
  {
    id: 'stat-3',
    category: 'statistics',
    name: '표준편차',
    formula: 'σ = sqrt(Σ(x_i - μ)^2 / n)',
    description: '모표준편차',
  },
  {
    id: 'stat-4',
    category: 'statistics',
    name: '조합',
    formula: 'C(n,r) = n! / (r! * (n-r)!)',
    description: 'n개 중 r개 선택',
  },
  {
    id: 'stat-5',
    category: 'statistics',
    name: '순열',
    formula: 'P(n,r) = n! / (n-r)!',
    description: 'n개 중 r개 순서배열',
  },
  {
    id: 'stat-6',
    category: 'statistics',
    name: '확률 (독립사건)',
    formula: 'P(A ∩ B) = P(A) * P(B)',
    description: 'A와 B가 독립',
  },
  {
    id: 'stat-7',
    category: 'statistics',
    name: '조건부 확률',
    formula: 'P(A|B) = P(A ∩ B) / P(B)',
    description: 'B가 일어났을 때 A',
  },
  {
    id: 'stat-8',
    category: 'statistics',
    name: '베이즈 정리',
    formula: 'P(A|B) = P(B|A) * P(A) / P(B)',
    description: '역확률',
  },

  // 물리 (Physics)
  {
    id: 'phys-1',
    category: 'physics',
    name: '등가속도 운동',
    formula: 'v = v_0 + a*t',
    description: '속도 = 초속도 + 가속도×시간',
  },
  {
    id: 'phys-2',
    category: 'physics',
    name: '등가속도 변위',
    formula: 's = v_0*t + (1/2)*a*t^2',
    description: '변위 공식',
  },
  {
    id: 'phys-3',
    category: 'physics',
    name: '운동에너지',
    formula: 'E_k = (1/2) * m * v^2',
    description: '질량 m, 속도 v',
  },
  {
    id: 'phys-4',
    category: 'physics',
    name: '위치에너지',
    formula: 'E_p = m * g * h',
    description: '질량 m, 높이 h, 중력가속도 g',
  },
  {
    id: 'phys-5',
    category: 'physics',
    name: '뉴턴 제2법칙',
    formula: 'F = m * a',
    description: '힘 = 질량 × 가속도',
  },
  {
    id: 'phys-6',
    category: 'physics',
    name: '만유인력',
    formula: 'F = G * m_1 * m_2 / r^2',
    description: '중력 상수 G',
  },
  {
    id: 'phys-7',
    category: 'physics',
    name: '일',
    formula: 'W = F * d * cos(θ)',
    description: '힘 F, 변위 d, 각도 θ',
  },
  {
    id: 'phys-8',
    category: 'physics',
    name: '일률(파워)',
    formula: 'P = W / t',
    description: '일 W, 시간 t',
  },
  {
    id: 'phys-9',
    category: 'physics',
    name: '운동량',
    formula: 'p = m * v',
    description: '질량 m, 속도 v',
  },
  {
    id: 'phys-10',
    category: 'physics',
    name: '충격량',
    formula: 'J = F * Δt = Δp',
    description: '힘 × 시간 = 운동량 변화',
  },
]
