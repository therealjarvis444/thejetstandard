#!/bin/bash
# THE JET STANDARD - Local Preview Script
# Launches a local server for preview before deployment

echo "🛩️  The Jet Standard - Local Preview"
echo "===================================="
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Error: Python is not installed."
    echo "Please install Python 3 to run the local preview server."
    exit 1
fi

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "📂 Working directory: $SCRIPT_DIR"
echo ""
echo "🌐 Starting local server..."
echo "   → Open http://localhost:8080 in your browser"
echo "   → Press Ctrl+C to stop the server"
echo ""

# Start the server
cd "$SCRIPT_DIR"
$PYTHON_CMD -m http.server 8080
