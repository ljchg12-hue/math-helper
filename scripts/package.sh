#!/bin/bash
set -e

VERSION=$(grep '^version' Cargo.toml | head -1 | awk '{print $3}' | tr -d '"')
PACKAGE_NAME="math-helper-$VERSION"

echo "📦 Creating release package: $PACKAGE_NAME"

# Build release
cargo build --release

# Create package directory
mkdir -p "dist/$PACKAGE_NAME"

# Copy files
cp target/release/math "dist/$PACKAGE_NAME/"
cp README.md "dist/$PACKAGE_NAME/"
cp LICENSE "dist/$PACKAGE_NAME/"
cp CHANGELOG.md "dist/$PACKAGE_NAME/" 2>/dev/null || echo "CHANGELOG.md not found, skipping..."
cp MIGRATION.md "dist/$PACKAGE_NAME/"
cp BENCHMARK.md "dist/$PACKAGE_NAME/"

# Create tarball
cd dist
tar czf "$PACKAGE_NAME.tar.gz" "$PACKAGE_NAME"
zip -r "$PACKAGE_NAME.zip" "$PACKAGE_NAME"

echo ""
echo "✅ Packages created:"
ls -lh "$PACKAGE_NAME.tar.gz"
ls -lh "$PACKAGE_NAME.zip"
echo ""
echo "📂 Package location: dist/"
