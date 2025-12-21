# Multi-stage build for minimal image
FROM rust:1.75-slim as builder

WORKDIR /app

# Copy manifests
COPY Cargo.toml Cargo.lock ./
COPY crates/ ./crates/

# Build dependencies (cached)
RUN cargo build --release

# Build application
RUN cargo build --release --bin math

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy binary from builder
COPY --from=builder /app/target/release/math /usr/local/bin/

# Create non-root user
RUN useradd -m -u 1000 mathuser
USER mathuser

ENTRYPOINT ["math"]
CMD ["--help"]

# Build: docker build -t math-helper .
# Run: docker run math-helper linear 2 3 7
