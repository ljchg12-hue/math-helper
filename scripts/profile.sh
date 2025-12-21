#!/bin/bash

echo "📊 Running performance profiling..."

# Check if binary exists
if [ ! -f "target/release/math" ]; then
    echo "⚠️  Binary not found. Building release version..."
    cargo build --release
fi

# Flamegraph (requires cargo-flamegraph)
if command -v cargo-flamegraph &> /dev/null; then
    echo "🔥 Generating flamegraph..."
    cargo flamegraph --bench calculators -o flamegraph.svg
    echo "✅ Flamegraph saved to: flamegraph.svg"
else
    echo "⚠️  cargo-flamegraph not installed. Install with: cargo install flamegraph"
fi

# Perf (Linux only)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v perf &> /dev/null; then
        echo "📈 Running perf profiling..."
        perf record -g target/release/math linear 2 3 7
        perf report
    else
        echo "⚠️  perf not installed. Install with: sudo apt install linux-tools-generic"
    fi
fi

# Instruments (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v instruments &> /dev/null; then
        echo "🍎 Running Instruments profiling..."
        instruments -t "Time Profiler" target/release/math linear 2 3 7
    else
        echo "⚠️  Instruments not found. Install Xcode Command Line Tools."
    fi
fi

# Valgrind (requires valgrind)
if command -v valgrind &> /dev/null; then
    echo "🔍 Running Valgrind callgrind..."
    valgrind --tool=callgrind target/release/math linear 2 3 7

    if command -v kcachegrind &> /dev/null; then
        kcachegrind callgrind.out.*
    else
        echo "✅ Callgrind output saved. View with: kcachegrind callgrind.out.*"
    fi
else
    echo "⚠️  Valgrind not installed."
fi

echo ""
echo "✅ Profiling complete!"
