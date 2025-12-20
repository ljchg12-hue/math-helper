#!/usr/bin/env python3
"""
Performance benchmarks for Python math calculators

This script measures the execution time of various mathematical
operations implemented in Python to compare with Rust implementation.
"""

import time
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / 'src'))

from calculators.linear_equation import solve_linear_equation
from calculators.quadratic_equation import solve_quadratic_equation
from calculators.geometry import Point, Circle, Triangle, distance, circle_area, triangle_area, pythagorean_theorem, trapezoid_area
from calculators.statistics import mean, median, mode, variance, std_dev, quartiles, range_stat


def benchmark(name, func, iterations=1_000_000, *args, **kwargs):
    """Run a benchmark and return the elapsed time."""
    print(f"Running {name}... ", end='', flush=True)
    start = time.perf_counter()
    for _ in range(iterations):
        func(*args, **kwargs)
    elapsed = time.perf_counter() - start
    print(f"{elapsed:.3f}s ({iterations:,} iterations)")
    return elapsed


def benchmark_with_data(name, func, data, iterations=1):
    """Run a benchmark with pre-generated data."""
    print(f"Running {name}... ", end='', flush=True)
    start = time.perf_counter()
    for _ in range(iterations):
        func(data)
    elapsed = time.perf_counter() - start
    print(f"{elapsed:.3f}s")
    return elapsed


def main():
    print("=" * 70)
    print("Python Math Calculator Performance Benchmarks")
    print("=" * 70)
    print()

    results = {}

    # Equation Benchmarks
    print("📐 Equation Benchmarks")
    print("-" * 70)
    
    results['linear_1M'] = benchmark(
        "Linear Equation (1M iterations)",
        solve_linear_equation,
        1_000_000,
        2.0, -4.0
    )
    
    results['quadratic_1M'] = benchmark(
        "Quadratic Equation (1M iterations)",
        solve_quadratic_equation,
        1_000_000,
        1.0, -5.0, 6.0
    )
    
    results['quadratic_no_roots_1M'] = benchmark(
        "Quadratic No Roots (1M iterations)",
        solve_quadratic_equation,
        1_000_000,
        1.0, 1.0, 1.0
    )
    print()

    # Geometry Benchmarks
    print("📏 Geometry Benchmarks")
    print("-" * 70)
    
    # Distance using Point class
    def distance_calc():
        p1 = Point(0.0, 0.0)
        p2 = Point(3.0, 4.0)
        return distance(p1, p2)
    
    results['distance_10M'] = benchmark(
        "Distance Calculation (10M iterations)",
        distance_calc,
        10_000_000
    )
    
    results['circle_area_1M'] = benchmark(
        "Circle Area (1M iterations)",
        circle_area,
        1_000_000,
        5.0
    )
    
    results['triangle_area_1M'] = benchmark(
        "Triangle Area (1M iterations)",
        triangle_area,
        1_000_000,
        4.0, 3.0
    )
    
    results['pythagorean_1M'] = benchmark(
        "Pythagorean Theorem (1M iterations)",
        pythagorean_theorem,
        1_000_000,
        3.0, 4.0, 0.0
    )
    
    results['trapezoid_1M'] = benchmark(
        "Trapezoid Area (1M iterations)",
        trapezoid_area,
        1_000_000,
        3.0, 5.0, 4.0
    )
    print()

    # Statistics Benchmarks
    print("📊 Statistics Benchmarks (10,000 data points)")
    print("-" * 70)
    
    data_10k = list(range(1, 10001))
    
    results['mean_10k'] = benchmark_with_data(
        "Mean (10K data)",
        mean,
        data_10k,
        100
    )
    
    results['median_10k'] = benchmark_with_data(
        "Median (10K data)",
        median,
        data_10k,
        100
    )
    
    results['variance_10k'] = benchmark_with_data(
        "Variance (10K data)",
        lambda d: variance(d, sample=False),
        data_10k,
        100
    )
    
    results['std_dev_10k'] = benchmark_with_data(
        "Std Dev (10K data)",
        lambda d: std_dev(d, sample=False),
        data_10k,
        100
    )
    
    # Mode with repeated values
    data_mode = (list(range(1, 1001)) * 10)
    results['mode_10k'] = benchmark_with_data(
        "Mode (10K data)",
        mode,
        data_mode,
        100
    )
    
    results['quartiles_10k'] = benchmark_with_data(
        "Quartiles (10K data)",
        quartiles,
        data_10k,
        100
    )
    
    results['range_10k'] = benchmark_with_data(
        "Range (10K data)",
        range_stat,
        data_10k,
        100
    )
    print()

    # Summary
    print("=" * 70)
    print("Summary")
    print("=" * 70)
    print(f"{'Benchmark':<40} {'Time (s)':>15}")
    print("-" * 70)
    for name, time_val in results.items():
        print(f"{name:<40} {time_val:>15.3f}")
    print()
    
    # Save results to file
    with open('benchmark_results_python.txt', 'w') as f:
        f.write("Python Benchmark Results\n")
        f.write("=" * 70 + "\n")
        for name, time_val in results.items():
            f.write(f"{name}: {time_val:.6f}s\n")
    
    print("Results saved to benchmark_results_python.txt")


if __name__ == "__main__":
    main()
