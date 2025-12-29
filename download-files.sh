#!/bin/bash

# 5CMS Project Download Script
# This script helps you download your files

echo "🚀 5CMS Project Download Helper"
echo "================================"
echo ""

# Check if running in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📁 Available download options:"
echo ""

echo "1. 📄 Your Original UI Document:"
echo "   File: upload/5CMS-uis.docx"
echo "   Size: $(ls -lh upload/5CMS-uis.docx | awk '{print $5}')"
echo ""

echo "2. 🏗️  Complete 5CMS Project:"
echo "   - All source code and components"
echo "   - Database and configuration files"
echo "   - Documentation and README"
echo "   - Skills and AI integrations"
echo ""

echo "3. 📋 Project Statistics:"
echo "   - Total files: $(find . -type f | wc -l)"
echo "   - Source files: $(find src -name '*.ts' -o -name '*.tsx' | wc -l)"
echo "   - API routes: $(find src/app/api -type d | wc -l)"
echo "   - Components: $(find src/components -name '*.tsx' | wc -l)"
echo ""

echo "📦 Download Methods:"
echo ""
echo "Option A: Download specific files"
echo "  cp upload/5CMS-uis.docx ~/Downloads/"
echo ""

echo "Option B: Create project archive"
echo "  tar -czf 5cms-project.tar.gz --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='.next' ."
echo ""

echo "Option C: Copy to Downloads folder"
echo "  cp -r . ~/Downloads/5cms-project/"
echo ""

echo "✅ Project ready for download!"
echo "🌐 Running at: http://localhost:3000"
echo "🔐 Preview mode: http://localhost:3000/preview"