#!/bin/bash
set -e

echo "🔧 Building with Profile-Guided Optimization..."

# Step 1: Build instrumented binary
RUSTFLAGS="-Cprofile-generate=/tmp/pgo-data" \
    cargo build --release --target-dir /tmp/pgo-build

# Step 2: Run benchmarks to collect profile data
echo "📊 Collecting profile data..."
/tmp/pgo-build/release/math linear 2 3 7
/tmp/pgo-build/release/math quadratic 1 -5 6
/tmp/pgo-build/release/math pythagoras 3 4
/tmp/pgo-build/release/math factorial 20
/tmp/pgo-build/release/math permutation 10 5
/tmp/pgo-build/release/math combination 10 5
/tmp/pgo-build/release/math simultaneous 2 3 8 1 -1 1
/tmp/pgo-build/release/math power 2 10
/tmp/pgo-build/release/math log 1000 10
/tmp/pgo-build/release/math sin 45
/tmp/pgo-build/release/math cos 45
/tmp/pgo-build/release/math tan 45

# Step 3: Merge profile data (if llvm-profdata is available)
if command -v llvm-profdata &> /dev/null; then
    llvm-profdata merge -o /tmp/pgo-data/merged.profdata /tmp/pgo-data/*.profraw

    # Step 4: Build optimized binary
    echo "🚀 Building optimized binary..."
    RUSTFLAGS="-Cprofile-use=/tmp/pgo-data/merged.profdata -Cllvm-args=-pgo-warn-missing-function" \
        cargo build --release
else
    echo "⚠️  llvm-profdata not found, building without PGO"
    cargo build --release
fi

echo "✅ Optimized binary: target/release/math"
ls -lh target/release/math
