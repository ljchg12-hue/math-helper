//! Performance benchmarks for math-core calculators
//!
//! This benchmark suite compares the performance of various mathematical
//! operations implemented in Rust.

use criterion::{black_box, criterion_group, criterion_main, Criterion, BenchmarkId};
use math_core::*;

/// Benchmark for linear equation solver
fn bench_linear_equation(c: &mut Criterion) {
    c.bench_function("linear_equation", |b| {
        b.iter(|| {
            solve_linear_equation(
                black_box(2.0),
                black_box(-4.0)
            ).unwrap()
        });
    });
}

/// Benchmark for quadratic equation solver
fn bench_quadratic_equation(c: &mut Criterion) {
    c.bench_function("quadratic_equation", |b| {
        b.iter(|| {
            solve_quadratic_equation(
                black_box(1.0),
                black_box(-5.0),
                black_box(6.0)
            ).unwrap()
        });
    });
}

/// Benchmark for quadratic equation with no real roots
fn bench_quadratic_no_roots(c: &mut Criterion) {
    c.bench_function("quadratic_no_roots", |b| {
        b.iter(|| {
            solve_quadratic_equation(
                black_box(1.0),
                black_box(1.0),
                black_box(1.0)
            ).unwrap()
        });
    });
}

/// Benchmark for distance calculation
fn bench_distance(c: &mut Criterion) {
    c.bench_function("distance_calculation", |b| {
        b.iter(|| {
            let p1 = Point::new(black_box(0.0), black_box(0.0));
            let p2 = Point::new(black_box(3.0), black_box(4.0));
            p1.distance_to(&p2)
        });
    });
}

/// Benchmark for circle area
fn bench_circle_area(c: &mut Criterion) {
    c.bench_function("circle_area", |b| {
        b.iter(|| {
            circle_area(black_box(5.0)).unwrap()
        });
    });
}

/// Benchmark for triangle area
fn bench_triangle_area(c: &mut Criterion) {
    c.bench_function("triangle_area", |b| {
        b.iter(|| {
            triangle_area(black_box(4.0), black_box(3.0)).unwrap()
        });
    });
}

/// Benchmark for Pythagorean theorem
fn bench_pythagorean(c: &mut Criterion) {
    c.bench_function("pythagorean_theorem", |b| {
        b.iter(|| {
            pythagorean_theorem(black_box(3.0), black_box(4.0), black_box(0.0)).unwrap()
        });
    });
}

/// Benchmark for trapezoid area
fn bench_trapezoid_area(c: &mut Criterion) {
    c.bench_function("trapezoid_area", |b| {
        b.iter(|| {
            trapezoid_area(black_box(3.0), black_box(5.0), black_box(4.0)).unwrap()
        });
    });
}

/// Benchmark for statistics - mean
fn bench_statistics_mean(c: &mut Criterion) {
    let data: Vec<f64> = (1..=10000).map(|x| x as f64).collect();

    c.bench_function("statistics_mean_10k", |b| {
        b.iter(|| {
            mean(black_box(&data)).unwrap()
        });
    });
}

/// Benchmark for statistics - median
fn bench_statistics_median(c: &mut Criterion) {
    let data: Vec<f64> = (1..=10000).map(|x| x as f64).collect();

    c.bench_function("statistics_median_10k", |b| {
        b.iter(|| {
            median(black_box(&data)).unwrap()
        });
    });
}

/// Benchmark for statistics - variance
fn bench_statistics_variance(c: &mut Criterion) {
    let data: Vec<f64> = (1..=10000).map(|x| x as f64).collect();

    c.bench_function("statistics_variance_10k", |b| {
        b.iter(|| {
            variance(black_box(&data), false).unwrap()
        });
    });
}

/// Benchmark for statistics - standard deviation
fn bench_statistics_std_dev(c: &mut Criterion) {
    let data: Vec<f64> = (1..=10000).map(|x| x as f64).collect();

    c.bench_function("statistics_std_dev_10k", |b| {
        b.iter(|| {
            std_dev(black_box(&data), false).unwrap()
        });
    });
}

/// Benchmark for statistics - mode
fn bench_statistics_mode(c: &mut Criterion) {
    let data: Vec<f64> = (1..=1000).cycle().take(10000).map(|x| x as f64).collect();

    c.bench_function("statistics_mode_10k", |b| {
        b.iter(|| {
            mode(black_box(&data)).unwrap()
        });
    });
}

/// Benchmark for statistics - quartiles
fn bench_statistics_quartiles(c: &mut Criterion) {
    let data: Vec<f64> = (1..=10000).map(|x| x as f64).collect();

    c.bench_function("statistics_quartiles_10k", |b| {
        b.iter(|| {
            quartiles(black_box(&data)).unwrap()
        });
    });
}

/// Benchmark for statistics - range
fn bench_statistics_range(c: &mut Criterion) {
    let data: Vec<f64> = (1..=10000).map(|x| x as f64).collect();

    c.bench_function("statistics_range_10k", |b| {
        b.iter(|| {
            range(black_box(&data)).unwrap()
        });
    });
}

/// Benchmark varying data sizes for statistics
fn bench_statistics_scaling(c: &mut Criterion) {
    let mut group = c.benchmark_group("statistics_scaling");

    for size in [100, 1000, 10000].iter() {
        let data: Vec<f64> = (1..=*size).map(|x| x as f64).collect();

        group.bench_with_input(BenchmarkId::new("mean", size), &data, |b, d| {
            b.iter(|| mean(black_box(d)).unwrap());
        });

        group.bench_with_input(BenchmarkId::new("median", size), &data, |b, d| {
            b.iter(|| median(black_box(d)).unwrap());
        });

        group.bench_with_input(BenchmarkId::new("variance", size), &data, |b, d| {
            b.iter(|| variance(black_box(d), false).unwrap());
        });
    }

    group.finish();
}

criterion_group!(
    equation_benches,
    bench_linear_equation,
    bench_quadratic_equation,
    bench_quadratic_no_roots
);

criterion_group!(
    geometry_benches,
    bench_distance,
    bench_circle_area,
    bench_triangle_area,
    bench_pythagorean,
    bench_trapezoid_area
);

criterion_group!(
    statistics_benches,
    bench_statistics_mean,
    bench_statistics_median,
    bench_statistics_variance,
    bench_statistics_std_dev,
    bench_statistics_mode,
    bench_statistics_quartiles,
    bench_statistics_range,
    bench_statistics_scaling
);

criterion_main!(equation_benches, geometry_benches, statistics_benches);
