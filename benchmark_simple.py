#!/usr/bin/env python3
"""
Simple performance benchmarks for Python math calculators
Imports modules directly to avoid package issues
"""

import time
import sys
import importlib.util
from pathlib import Path

# Direct module imports
def import_module(module_path):
    spec = importlib.util.spec_from_file_location("module", module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

# Load modules
base_path = Path("/mnt/4tb/1.work/math_helper/src/calculators")
linear_eq = import_module(base_path / "linear_equation.py")
quadratic_eq = import_module(base_path / "quadratic_equation.py")
geometry = import_module(base_path / "geometry.py")
stats = import_module(base_path / "statistics.py")


def benchmark(name, func, iterations, *args):
    """Run benchmark"""
    print(f"Running {name}... ", end='', flush=True)
    start = time.perf_counter()
    for _ in range(iterations):
        try:
            func(*args)
        except:
            pass
    elapsed = time.perf_counter() - start
    print(f"{elapsed:.3f}s")
    return elapsed


def main():
    print("=" * 70)
    print("Python Math Calculator Performance Benchmarks")
    print("=" * 70)
    print()

    results = {}

    # Equations
    print("📐 Equation Benchmarks")
    print("-" * 70)
    
    results['linear_1M'] = benchmark(
        "Linear Equation (1M)",
        linear_eq.solve_linear_equation,
        1_000_000,
        2.0, -4.0
    )
    
    results['quadratic_1M'] = benchmark(
        "Quadratic Equation (1M)",
        quadratic_eq.solve_quadratic_equation,
        1_000_000,
        1.0, -5.0, 6.0
    )
    print()

    # Geometry
    print("📏 Geometry Benchmarks")
    print("-" * 70)
    
    def distance_calc():
        p1 = geometry.Point(0.0, 0.0)
        p2 = geometry.Point(3.0, 4.0)
        return geometry.distance(p1, p2)
    
    results['distance_10M'] = benchmark(
        "Distance (10M)",
        distance_calc,
        10_000_000
    )
    
    results['circle_1M'] = benchmark(
        "Circle Area (1M)",
        geometry.circle_area,
        1_000_000,
        5.0
    )
    print()

    # Statistics
    print("📊 Statistics Benchmarks")
    print("-" * 70)
    
    data_10k = list(range(1, 10001))
    
    start = time.perf_counter()
    for _ in range(100):
        stats.mean(data_10k)
    results['mean_10k'] = time.perf_counter() - start
    print(f"Mean (10K × 100): {results['mean_10k']:.3f}s")
    
    start = time.perf_counter()
    for _ in range(100):
        stats.median(data_10k)
    results['median_10k'] = time.perf_counter() - start
    print(f"Median (10K × 100): {results['median_10k']:.3f}s")
    
    start = time.perf_counter()
    for _ in range(100):
        stats.variance(data_10k, sample=False)
    results['variance_10k'] = time.perf_counter() - start
    print(f"Variance (10K × 100): {results['variance_10k']:.3f}s")
    
    print()

    # Summary
    print("=" * 70)
    print("Summary")
    print("=" * 70)
    for name, time_val in results.items():
        print(f"{name:<30} {time_val:>15.3f}s")
    
    # Save results
    with open('benchmark_results_python.txt', 'w') as f:
        for name, time_val in results.items():
            f.write(f"{name}: {time_val:.6f}\n")
    
    print("\nResults saved to benchmark_results_python.txt")


if __name__ == "__main__":
    main()
