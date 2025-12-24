import { useState } from 'react'
import Card from './Card'
import UniversalCalculator from './UniversalCalculator'

interface Category {
  id: string
  name: string
  icon: string
  samples: string[]
  description: string
}

interface CategoryCalculatorProps {
  initialInput?: string
  onInputUsed?: () => void
}

export default function CategoryCalculator({ initialInput, onInputUsed }: CategoryCalculatorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories: Category[] = [
    {
      id: 'linear_equation',
      name: '일차방정식',
      icon: '📏',
      samples: [
        '2x + 3 = 7',
        '5x - 2 = 3x + 4',
        '3(x + 2) = 15',
        '7x + 5 = 2x + 20',
        '4(x - 3) = 2(x + 1)',
        '6x - 9 = 3x + 12',
        '10 - 3x = 4x + 3',
        '2(3x + 1) = 5(x - 2)',
        '8x + 12 = 4(2x + 3)',
        '15 - 2x = 3x + 5',
        '9x - 7 = 2x + 14',
        '5(x + 1) = 3(x + 5)',
        '12 - 4x = 2x + 6',
        '3x + 8 = 5x - 4',
        '7(x - 2) = 4(x + 1)',
        '6x + 3 = 9x - 12',
        '11 - 2x = 5x + 4',
        '4(2x - 1) = 3(x + 2)',
        '8x - 5 = 3x + 15',
        '2(x + 3) = 5(x - 1)',
        '13x - 9 = 7x + 15',
        '6(x - 1) = 2(3x + 2)',
        '10x + 7 = 4x + 31',
        '3(2x + 1) = 4(x + 3)',
        '14 - 3x = 2x + 9',
        '5x + 12 = 8x - 9',
        '9(x + 2) = 6(x + 5)',
        '7x - 11 = 2x + 14',
        '4x + 15 = 7x - 6',
        '2(5x - 3) = 3(2x + 1)'
      ],
      description: 'ax + b = 0 형태의 방정식'
    },
    {
      id: 'quadratic_equation',
      name: '이차방정식',
      icon: '📐',
      samples: [
        'x^2 - 5x + 6 = 0',
        '2x^2 + 3x - 2 = 0',
        'x^2 - 4 = 0',
        'x^2 + 6x + 9 = 0',
        '3x^2 - 12x + 12 = 0',
        'x^2 - 7x + 10 = 0',
        '2x^2 - 8x + 6 = 0',
        'x^2 + 4x - 5 = 0',
        '4x^2 - 9 = 0',
        'x^2 - 2x - 15 = 0',
        'x^2 + 8x + 16 = 0',
        '3x^2 - 7x + 2 = 0',
        'x^2 - 9x + 20 = 0',
        '2x^2 + 5x - 3 = 0',
        'x^2 - 6x + 8 = 0',
        '4x^2 - 12x + 9 = 0',
        'x^2 + 3x - 10 = 0',
        '5x^2 - 20x + 20 = 0',
        'x^2 - 10x + 25 = 0',
        '3x^2 + 6x - 9 = 0',
        'x^2 + 2x - 8 = 0',
        '2x^2 - 7x + 5 = 0',
        'x^2 - 11x + 24 = 0',
        '6x^2 - 5x + 1 = 0',
        'x^2 + 5x - 14 = 0',
        '4x^2 - 16 = 0',
        'x^2 - 3x - 18 = 0',
        '3x^2 + 8x + 4 = 0',
        'x^2 + 7x + 12 = 0',
        '2x^2 - 9x + 10 = 0'
      ],
      description: 'ax² + bx + c = 0 형태의 방정식'
    },
    {
      id: 'geometry',
      name: '기하학',
      icon: '📊',
      samples: [
        'pi * 5^2',
        '2 * pi * 3',
        '4/3 * pi * 2^3',
        'pi * 10^2',
        '2 * pi * 7',
        '4 * pi * 4^2',
        '1/2 * 8 * 6',
        'sqrt(3) / 4 * 5^2',
        '1/3 * pi * 3^2 * 5',
        '4/3 * pi * 6^3',
        'pi * 8^2',
        '2 * pi * 12',
        '1/2 * 10 * 8',
        '4 * pi * 5^2',
        'pi * 15^2',
        '1/3 * pi * 4^2 * 6',
        'sqrt(3) / 4 * 8^2',
        '2 * pi * 9',
        '4/3 * pi * 3^3',
        '1/2 * 12 * 5',
        'pi * 7^2',
        '4 * pi * 6^2',
        '2 * pi * 15',
        '1/3 * pi * 5^2 * 8',
        'sqrt(3) / 4 * 10^2',
        'pi * 20^2',
        '4/3 * pi * 8^3',
        '1/2 * 15 * 10',
        '2 * pi * 20',
        '4 * pi * 10^2'
      ],
      description: '원, 구, 삼각형 등의 넓이/부피 계산'
    },
    {
      id: 'statistics',
      name: '통계',
      icon: '📈',
      samples: [
        'mean([1, 2, 3, 4, 5])',
        'median([10, 20, 30, 40])',
        'std([5, 10, 15, 20])',
        'mean([2, 4, 6, 8, 10])',
        'median([1, 3, 5, 7, 9])',
        'variance([10, 20, 30])',
        'min([5, 2, 8, 1, 9])',
        'max([3, 7, 2, 9, 5])',
        'mean([100, 200, 150, 180])',
        'std([1, 2, 3, 4, 5, 6])',
        'median([15, 25, 35, 45, 55])',
        'mean([12, 18, 24, 30])',
        'variance([5, 10, 15, 20, 25])',
        'std([10, 20, 30, 40, 50])',
        'min([100, 50, 75, 25, 90])',
        'max([15, 30, 45, 60, 75])',
        'mean([50, 60, 70, 80, 90])',
        'median([2, 4, 6, 8, 10, 12])',
        'variance([1, 4, 9, 16, 25])',
        'std([5, 15, 25, 35, 45])',
        'mean([7, 14, 21, 28, 35])',
        'min([200, 150, 180, 120, 170])',
        'max([8, 16, 24, 32, 40])',
        'median([100, 200, 300])',
        'variance([2, 4, 6, 8, 10])',
        'std([20, 40, 60, 80])',
        'mean([3, 6, 9, 12, 15, 18])',
        'median([50, 100, 150, 200, 250])',
        'min([1000, 500, 750, 250])',
        'max([11, 22, 33, 44, 55])'
      ],
      description: '평균, 중앙값, 표준편차 계산'
    },
    {
      id: 'factorization',
      name: '인수분해',
      icon: '🔨',
      samples: [
        'x^2 - 5x + 6',
        'x^2 - 9',
        'x^2 + 4x + 4',
        'x^2 - 16',
        'x^2 + 6x + 9',
        'x^2 - 7x + 12',
        '2x^2 + 7x + 3',
        'x^2 - x - 6',
        'x^3 - 8',
        'x^2 + 5x + 6',
        'x^2 - 25',
        'x^2 + 8x + 16',
        '3x^2 - 12x',
        'x^2 - 3x - 10',
        'x^2 + 10x + 25',
        '2x^2 - 8',
        'x^2 - 6x + 9',
        'x^3 - 27',
        '4x^2 - 16',
        'x^2 + 7x + 10',
        'x^2 - 49',
        '3x^2 + 9x + 6',
        'x^2 - 4x - 12',
        'x^2 + 12x + 36',
        '5x^2 - 20x',
        'x^2 - 8x + 15',
        'x^3 + 64',
        '6x^2 - 24',
        'x^2 + 9x + 18',
        '2x^2 - 18'
      ],
      description: '다항식을 인수의 곱으로 표현'
    },
    {
      id: 'prime',
      name: '소수 판정',
      icon: '🔢',
      samples: [
        'isPrime(17)',
        'isPrime(24)',
        'primeFactors(36)',
        'isPrime(29)',
        'isPrime(100)',
        'primeFactors(48)',
        'isPrime(2)',
        'isPrime(97)',
        'primeFactors(60)',
        'primeFactors(120)',
        'isPrime(31)',
        'primeFactors(72)',
        'isPrime(51)',
        'isPrime(89)',
        'primeFactors(84)',
        'isPrime(3)',
        'primeFactors(100)',
        'isPrime(67)',
        'isPrime(91)',
        'primeFactors(144)',
        'isPrime(73)',
        'primeFactors(90)',
        'isPrime(121)',
        'isPrime(53)',
        'primeFactors(150)',
        'isPrime(5)',
        'primeFactors(200)',
        'isPrime(83)',
        'isPrime(77)',
        'primeFactors(180)'
      ],
      description: '소수 판정 및 소인수분해'
    },
    {
      id: 'simultaneous_equations',
      name: '연립방정식',
      icon: '⚖️',
      samples: [
        '2x + y = 5, x - y = 1',
        '3x + 2y = 12, x + y = 5',
        'x + y = 10, x - y = 2',
        '2x + 3y = 13, x + 2y = 8',
        '4x + y = 14, x + 3y = 11',
        '3x - y = 7, x + y = 5',
        '5x + 2y = 16, 3x + y = 10',
        '2x - 3y = 1, x + 2y = 7',
        'x + 4y = 13, 2x + y = 7',
        '3x + 5y = 21, 2x + 3y = 13',
        '4x + 2y = 18, 2x + y = 9',
        'x + 3y = 11, 3x + y = 9',
        '5x + y = 17, 2x + 3y = 13',
        '3x + 4y = 25, x + 2y = 11',
        '6x + 2y = 20, 3x + y = 10',
        '2x + 5y = 19, x + 3y = 11',
        '4x + 3y = 23, 2x + y = 11',
        'x + 2y = 9, 3x + y = 13',
        '7x + 2y = 24, 3x + y = 11',
        '2x + 4y = 16, x + 2y = 8',
        '5x + 3y = 26, 2x + y = 10',
        '3x + 2y = 16, x + y = 7',
        '4x + 5y = 29, 2x + 3y = 17',
        'x + 5y = 16, 2x + y = 8',
        '6x + y = 19, 2x + 3y = 13',
        '3x + 6y = 27, x + 2y = 9',
        '5x + 4y = 31, 3x + 2y = 19',
        '2x + y = 11, x + 3y = 14',
        '4x + 6y = 34, 2x + 3y = 17',
        '7x + 3y = 31, 3x + 2y = 16'
      ],
      description: '두 개 이상의 방정식을 동시에 만족하는 해'
    },
    {
      id: 'polynomial',
      name: '다항식',
      icon: '📦',
      samples: [
        '(x+2)(x+3)',
        '(x-1)^3',
        'x^3 + 3x^2 + 3x + 1',
        '(x+5)(x-2)',
        '(2x+1)(x+3)',
        '(x-4)^2',
        '(x+1)(x^2+2x+1)',
        '(3x-2)(x+4)',
        '(x+2)^3',
        '(x-3)(x+3)',
        '(x+4)(x+5)',
        '(2x-3)^2',
        '(x-2)(x^2+3x+2)',
        '(x+6)(x-1)',
        '(3x+1)(2x+1)',
        '(x-5)^2',
        '(x+3)(x^2+x+1)',
        '(2x+3)(x-2)',
        '(x-1)^2',
        '(x+7)(x-3)',
        '(4x-1)(x+2)',
        '(x+3)^3',
        '(x-4)(x+4)',
        '(3x-1)^2',
        '(x+2)(x^2-x+1)',
        '(2x+5)(x-3)',
        '(x+8)(x-2)',
        '(5x+2)(x+1)',
        '(x-6)^2',
        '(x+1)(x^2+3x+3)'
      ],
      description: '다항식 전개 및 정리'
    },
    {
      id: 'inequality',
      name: '부등식',
      icon: '⚡',
      samples: [
        '2x + 3 > 7',
        'x^2 - 4 < 0',
        '3x - 1 >= 5',
        '5x - 10 > 0',
        'x + 7 <= 15',
        '4x - 8 >= 12',
        '2x + 5 < 13',
        '6 - 2x > 0',
        '3x + 9 <= 21',
        'x^2 - 9 > 0',
        '7x - 14 >= 0',
        '4x + 2 < 18',
        'x^2 - 16 <= 0',
        '5x + 3 > 23',
        '8 - 3x >= 2',
        '2x - 6 < 4',
        'x^2 - 25 > 0',
        '6x + 1 <= 25',
        '9 - 4x > 1',
        '3x - 12 >= 6',
        'x^2 - 1 < 0',
        '10x - 5 > 35',
        '7 - x <= 3',
        '4x + 7 < 27',
        'x^2 - 36 >= 0',
        '8x - 16 > 0',
        '12 - 5x <= 2',
        '5x + 8 < 33',
        'x^2 - 49 > 0',
        '9x - 18 >= 9'
      ],
      description: '부등호를 포함한 식'
    },
    {
      id: 'probability',
      name: '확률',
      icon: '🎲',
      samples: [
        'combinations(5, 2)',
        'permutations(4, 2)',
        'factorial(5)',
        'combinations(6, 3)',
        'permutations(5, 3)',
        'factorial(7)',
        'combinations(10, 2)',
        'permutations(6, 2)',
        'factorial(4)',
        'combinations(8, 4)',
        'permutations(7, 3)',
        'factorial(6)',
        'combinations(9, 2)',
        'permutations(8, 4)',
        'factorial(8)',
        'combinations(7, 3)',
        'permutations(5, 2)',
        'factorial(9)',
        'combinations(12, 3)',
        'permutations(6, 4)',
        'factorial(10)',
        'combinations(11, 4)',
        'permutations(7, 2)',
        'combinations(8, 3)',
        'permutations(9, 3)',
        'factorial(11)',
        'combinations(10, 5)',
        'permutations(8, 2)',
        'combinations(15, 3)',
        'permutations(10, 2)'
      ],
      description: '조합, 순열, 팩토리얼'
    },
    {
      id: 'matrix',
      name: '행렬',
      icon: '🔷',
      samples: [
        '[[1,2],[3,4]] * [[5,6],[7,8]]',
        'det([[1,2],[3,4]])',
        'inv([[1,2],[3,4]])',
        '[[2,0],[0,2]] * [[1,1],[1,1]]',
        'det([[2,3],[1,4]])',
        'transpose([[1,2,3],[4,5,6]])',
        '[[1,0],[0,1]] + [[2,3],[4,5]]',
        'det([[1,0,0],[0,1,0],[0,0,1]])',
        '[[3,1],[2,4]] - [[1,1],[1,1]]',
        'inv([[2,1],[1,1]])',
        '[[2,3],[1,4]] * [[5,6],[7,8]]',
        'det([[3,4],[1,2]])',
        'transpose([[1,2],[3,4],[5,6]])',
        '[[1,1],[1,1]] + [[3,4],[5,6]]',
        'inv([[3,2],[1,1]])',
        '[[4,2],[1,3]] * [[2,1],[3,4]]',
        'det([[5,6],[3,4]])',
        '[[2,3],[4,5]] - [[1,2],[3,4]]',
        'transpose([[7,8,9],[1,2,3]])',
        'inv([[4,3],[2,1]])',
        '[[1,2,3],[4,5,6]] * transpose([[1,2],[3,4],[5,6]])',
        'det([[2,0],[0,2]])',
        '[[5,6],[7,8]] + [[1,2],[3,4]]',
        'inv([[5,4],[3,2]])',
        '[[3,4],[5,6]] * [[1,0],[0,1]]',
        'det([[4,5],[2,3]])',
        'transpose([[10,20],[30,40]])',
        '[[6,7],[8,9]] - [[2,3],[4,5]]',
        'inv([[6,5],[4,3]])',
        'det([[7,8],[5,6]])'
      ],
      description: '행렬 연산 (곱셈, 역행렬, 행렬식)'
    },
    {
      id: 'exponent',
      name: '지수/로그',
      icon: '📉',
      samples: [
        '2^10',
        'log(100, 10)',
        'log(e^3)',
        '3^5',
        'log(1000, 10)',
        'log(e^2)',
        '5^3',
        'log(64, 2)',
        'log10(100)',
        '2^8',
        '4^4',
        'log(10000, 10)',
        'log(e^5)',
        '6^3',
        'log(128, 2)',
        '2^12',
        '7^3',
        'log10(1000)',
        'log(e^4)',
        '3^6',
        'log(256, 2)',
        '5^4',
        '2^15',
        'log(100000, 10)',
        '8^3',
        'log(e^6)',
        '4^5',
        'log(512, 2)',
        'log10(10000)',
        '9^3'
      ],
      description: '지수 계산 및 로그 계산'
    },
    {
      id: 'trigonometry',
      name: '삼각함수',
      icon: '📐',
      samples: [
        'sin(pi/6)',
        'cos(pi/4)',
        'tan(pi/3)',
        'sin(pi/3)',
        'cos(pi/6)',
        'tan(pi/4)',
        'sin(0)',
        'cos(pi/2)',
        'sin(pi)',
        'cos(pi)',
        'tan(pi/6)',
        'sin(pi/4)',
        'cos(pi/3)',
        'sin(2*pi/3)',
        'cos(3*pi/4)',
        'tan(0)',
        'sin(3*pi/2)',
        'cos(2*pi)',
        'sin(5*pi/6)',
        'cos(5*pi/6)',
        'tan(2*pi/3)',
        'sin(pi/2)',
        'cos(0)',
        'sin(7*pi/6)',
        'cos(4*pi/3)',
        'tan(3*pi/4)',
        'sin(4*pi/3)',
        'cos(7*pi/6)',
        'sin(5*pi/3)',
        'cos(5*pi/3)'
      ],
      description: '사인, 코사인, 탄젠트 계산'
    },
    {
      id: 'sequence',
      name: '수열',
      icon: '🔗',
      samples: [
        '2n + 1 (n=1~10)',
        'n^2 (n=1~5)',
        'sum(1~100)',
        '3n - 2 (n=1~8)',
        'n^3 (n=1~4)',
        'sum(1~50)',
        '5n + 3 (n=1~6)',
        '2^n (n=1~5)',
        'sum(1~20)',
        'n(n+1)/2 (n=1~10)',
        '4n - 1 (n=1~7)',
        'n^2 + n (n=1~6)',
        'sum(1~30)',
        '7n + 2 (n=1~5)',
        '3^n (n=1~4)',
        'sum(1~75)',
        '6n - 5 (n=1~8)',
        'n(n-1) (n=1~7)',
        'sum(1~40)',
        '8n + 1 (n=1~6)',
        'n^2 - 1 (n=1~5)',
        '5^n (n=1~3)',
        'sum(1~60)',
        '10n - 3 (n=1~5)',
        'n(n+2) (n=1~6)',
        'sum(1~80)',
        '9n + 4 (n=1~5)',
        'n^3 - n (n=1~4)',
        'sum(1~90)',
        '12n - 7 (n=1~5)'
      ],
      description: '등차수열, 등비수열, 수열의 합'
    },
    {
      id: 'vector',
      name: '벡터',
      icon: '➡️',
      samples: [
        '[1,2,3] + [4,5,6]',
        'dot([1,2], [3,4])',
        'cross([1,0,0], [0,1,0])',
        '[2,3] + [1,4]',
        'dot([2,3,1], [1,0,2])',
        'cross([1,2,0], [0,0,1])',
        '[5,6] - [2,3]',
        'norm([3,4])',
        'dot([1,1,1], [2,2,2])',
        '[10,20] + [30,40]',
        '[3,4,5] + [1,2,3]',
        'dot([5,6], [7,8])',
        'cross([0,1,0], [0,0,1])',
        '[7,8] - [3,4]',
        'norm([5,12])',
        'dot([3,4,5], [2,1,3])',
        '[15,25] + [10,20]',
        'cross([1,1,0], [0,1,1])',
        '[9,12] - [4,5]',
        'norm([8,15])',
        'dot([2,3,4], [1,2,3])',
        '[20,30] + [5,10]',
        'cross([2,0,0], [0,3,0])',
        '[11,13] - [6,7]',
        'norm([6,8])',
        'dot([4,5,6], [3,2,1])',
        '[25,35] + [15,20]',
        'cross([1,0,1], [0,1,0])',
        '[14,18] - [8,9]',
        'norm([9,12])'
      ],
      description: '벡터 덧셈, 내적, 외적'
    },
    {
      id: 'complex_number',
      name: '복소수',
      icon: '🌀',
      samples: [
        '(2 + 3i) + (1 - 2i)',
        '(1 + i) * (1 - i)',
        'abs(3 + 4i)',
        '(5 + 2i) - (3 + i)',
        '(2 + i) * (3 + 4i)',
        'abs(5 + 12i)',
        '(4 + 3i) + (2 - i)',
        '(1 + 2i) / (1 - i)',
        'conj(3 + 4i)',
        '(6 + 8i) / 2',
        '(3 + 2i) + (4 + 5i)',
        '(2 + 3i) * (1 + i)',
        'abs(6 + 8i)',
        '(7 + 4i) - (2 + 3i)',
        '(3 + i) * (2 - i)',
        'abs(8 + 15i)',
        '(5 + 6i) + (1 - 2i)',
        '(2 + 4i) / (1 + i)',
        'conj(5 + 12i)',
        '(10 + 5i) / 5',
        '(4 + 5i) + (3 - 2i)',
        '(3 + 3i) * (2 + i)',
        'abs(9 + 12i)',
        '(8 + 3i) - (4 + 2i)',
        '(4 + 2i) * (1 - 2i)',
        'abs(7 + 24i)',
        '(6 + 7i) + (2 + 3i)',
        '(3 + 5i) / (2 - i)',
        'conj(8 + 6i)',
        '(12 + 16i) / 4'
      ],
      description: '복소수 연산 및 절댓값'
    },
    {
      id: 'calculus',
      name: '미분/적분',
      icon: '∫',
      samples: [
        'differentiate: x^3 + 2x^2',
        'integrate: 2x + 1',
        'limit: (x^2-1)/(x-1)',
        'differentiate: sin(x)',
        'integrate: x^2',
        'differentiate: e^x',
        'integrate: cos(x)',
        'differentiate: ln(x)',
        'integrate: 1/x',
        'limit: sin(x)/x as x->0',
        'differentiate: x^4 - 3x^2',
        'integrate: 3x^2 + 2x',
        'limit: (x^3-8)/(x-2)',
        'differentiate: cos(x)',
        'integrate: sin(x)',
        'differentiate: x * e^x',
        'integrate: e^x',
        'limit: (x^2-4)/(x-2)',
        'differentiate: tan(x)',
        'integrate: 1/x^2',
        'differentiate: x^2 * ln(x)',
        'limit: (e^x-1)/x as x->0',
        'integrate: x^3',
        'differentiate: sqrt(x)',
        'integrate: 1/sqrt(x)',
        'differentiate: sin(x) * cos(x)',
        'limit: (1-cos(x))/x as x->0',
        'integrate: x * e^x',
        'differentiate: ln(x^2)',
        'integrate: sec(x)^2'
      ],
      description: '함수의 미분, 적분, 극한'
    },
  ]

  if (selectedCategory === null) {
    return (
      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">계산기 카테고리</h2>
            <p className="text-gray-600 dark:text-gray-400">원하는 계산 유형을 선택하세요</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {category.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {category.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  const category = categories.find(c => c.id === selectedCategory)
  if (!category) return null

  return (
    <div className="space-y-4">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => setSelectedCategory(null)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
      >
        ← 카테고리 목록으로
      </button>

      {/* 선택된 카테고리 정보 */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{category.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{category.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
            </div>
          </div>

          {/* 샘플 예제 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📝 예제:</h3>
            <div className="grid gap-2">
              {category.samples.map((sample, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg font-mono text-sm text-blue-900 dark:text-blue-300"
                >
                  {sample}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 범용 계산기 (mathjs/nerdamer 기반) */}
      <UniversalCalculator
        key={selectedCategory}
        initialInput={initialInput}
        onInputUsed={onInputUsed}
      />
    </div>
  )
}
