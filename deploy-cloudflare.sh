#!/bin/bash
# ============================================
# THE JET STANDARD - Cloudflare Pages Deploy
# ============================================

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$PROJECT_DIR/dist"

echo "=========================================="
echo "The Jet Standard - Cloudflare Pages Deploy"
echo "=========================================="

# Verify dist/ exists and has required files
if [ ! -d "$BUILD_DIR" ]; then
    echo "ERROR: dist/ directory missing. Run ./deploy.sh first."
    exit 1
fi

if [ ! -f "$BUILD_DIR/index.html" ]; then
    echo "ERROR: dist/index.html missing"
    exit 1
fi

# Check for wrangler
if ! command -v wrangler &> /dev/null; then
    echo "ERROR: wrangler CLI not found. Install: npm install -g wrangler"
    exit 1
fi

# Check authentication
if ! wrangler whoami &> /dev/null; then
    echo "ERROR: Not authenticated with Cloudflare."
    echo "Run: wrangler login"
    exit 1
fi

echo "✓ Build artifacts verified"
echo "✓ Wrangler authenticated"

# Deploy directly from dist/
echo ""
echo "Deploying to Cloudflare Pages..."
wrangler pages deploy "$BUILD_DIR" --project-name=thejetstandard --branch=main

echo ""
echo "=========================================="
echo "✓ Deployment complete"
echo ""
echo "Next steps:"
echo "  1. Check Cloudflare dashboard for deployment URL"
echo "  2. Add custom domain: thejetstandard.com"
echo "  3. Configure DNS records (see CLOUDFLARE_SETUP.md)"
echo "=========================================="
