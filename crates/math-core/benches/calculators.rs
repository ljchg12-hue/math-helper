use criterion::{black_box, criterion_group, criterion_main, Criterion};
use math_core::*;

fn bench_linear_equation(c: &mut Criterion) {
    c.bench_function("linear_equation", |b| {
        b.iter(|| {
            linear_equation::solve_linear_equation(
                black_box(2.0),
                black_box(3.0),
                black_box(7.0)
            )
        })
    });
}

fn bench_quadratic_equation(c: &mut Criterion) {
    c.bench_function("quadratic_equation", |b| {
        b.iter(|| {
            quadratic_equation::solve_quadratic_equation(
                black_box(1.0),
                black_box(-3.0),
                black_box(2.0)
            )
        })
    });
}

fn bench_pythagorean(c: &mut Criterion) {
    c.bench_function("pythagorean_theorem", |b| {
        b.iter(|| {
            geometry::pythagorean_theorem(
                black_box(3.0),
                black_box(4.0)
            )
        })
    });
}

fn bench_factorial(c: &mut Criterion) {
    c.bench_function("factorial_20", |b| {
        b.iter(|| probability::factorial(black_box(20)))
    });
}

fn bench_permutation(c: &mut Criterion) {
    c.bench_function("permutation_10_5", |b| {
        b.iter(|| probability::permutation(black_box(10), black_box(5)))
    });
}

fn bench_combination(c: &mut Criterion) {
    c.bench_function("combination_10_5", |b| {
        b.iter(|| probability::combination(black_box(10), black_box(5)))
    });
}

fn bench_prime_factorize(c: &mut Criterion) {
    c.bench_function("prime_factorize_1000", |b| {
        b.iter(|| prime::prime_factorize(black_box(1000)))
    });
}

fn bench_simultaneous(c: &mut Criterion) {
    c.bench_function("simultaneous_equations", |b| {
        b.iter(|| {
            simultaneous_equations::solve_simultaneous(
                black_box(2.0),
                black_box(3.0),
                black_box(8.0),
                black_box(1.0),
                black_box(-1.0),
                black_box(-1.0)
            )
        })
    });
}

criterion_group!(
    benches,
    bench_linear_equation,
    bench_quadratic_equation,
    bench_pythagorean,
    bench_factorial,
    bench_permutation,
    bench_combination,
    bench_prime_factorize,
    bench_simultaneous
);
criterion_main!(benches);
