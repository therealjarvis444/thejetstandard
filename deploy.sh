#!/bin/bash

# ============================================
# THE JET STANDARD - Deployment Script
# ============================================

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$PROJECT_DIR/dist"

echo "=========================================="
echo "The Jet Standard - Deployment"
echo "=========================================="

# Create build directory
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Copy all files
echo "Copying files..."
cp "$PROJECT_DIR/index.html" "$BUILD_DIR/"
cp "$PROJECT_DIR/privacy.html" "$BUILD_DIR/"
cp "$PROJECT_DIR/terms.html" "$BUILD_DIR/"
cp -r "$PROJECT_DIR/css" "$BUILD_DIR/"
cp -r "$PROJECT_DIR/js" "$BUILD_DIR/"
cp -r "$PROJECT_DIR/assets" "$BUILD_DIR/"

# Minify CSS (optional - requires clean-css-cli)
if command -v cleancss >/dev/null 2>&1; then
    echo "Minifying CSS..."
    cleancss -o "$BUILD_DIR/css/styles.min.css" "$BUILD_DIR/css/styles.css"
    sed -i '' 's|styles.css|styles.min.css|' "$BUILD_DIR/index.html"
    sed -i '' 's|styles.css|styles.min.css|' "$BUILD_DIR/privacy.html"
    sed -i '' 's|styles.css|styles.min.css|' "$BUILD_DIR/terms.html"
fi

# Minify JS (optional - requires terser)
if command -v terser >/dev/null 2>&1; then
    echo "Minifying JS..."
    terser "$BUILD_DIR/js/main.js" -o "$BUILD_DIR/js/main.min.js" -c -m
    sed -i '' 's|main.js|main.min.js|' "$BUILD_DIR/index.html"
    sed -i '' 's|main.js|main.min.js|' "$BUILD_DIR/privacy.html"
    sed -i '' 's|main.js|main.min.js|' "$BUILD_DIR/terms.html"
fi

# Validate
echo "Validating build..."
if [ ! -f "$BUILD_DIR/index.html" ]; then
    echo "ERROR: index.html missing"
    exit 1
fi

if [ ! -f "$BUILD_DIR/css/styles.css" ] && [ ! -f "$BUILD_DIR/css/styles.min.css" ]; then
    echo "ERROR: CSS missing"
    exit 1
fi

if [ ! -f "$BUILD_DIR/js/main.js" ] && [ ! -f "$BUILD_DIR/js/main.min.js" ]; then
    echo "ERROR: JS missing"
    exit 1
fi

echo "✓ Build validation passed"
echo ""
echo "Build directory: $BUILD_DIR"
echo ""
echo "Deploy options:"
echo "  1. Netlify: npx netlify deploy --prod --dir=$BUILD_DIR"
echo "  2. Vercel:  npx vercel --prod $BUILD_DIR"
echo "  3. GitHub Pages: Push to gh-pages branch"
echo "  4. AWS S3:    aws s3 sync $BUILD_DIR s3://your-bucket"
echo ""
echo "=========================================="
