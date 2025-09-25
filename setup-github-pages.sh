#!/bin/bash

# Fruvi - GitHub Pages Setup Script
echo "🍎 Fruvi - GitHub Pages Setup"
echo "============================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Run this script from the Fruvi project directory"
    exit 1
fi

echo "✅ Project verified"

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git repository..."
    git init
    git add .
    git commit -m "🎉 Initial commit - Fruvi Professional Fruit Store

✅ Complete SPA with authentication
✅ Professional store with 15 premium products
✅ AI-powered registration assistant
✅ Modern glassmorphism design
✅ Ready for GitHub Pages deployment
✅ Comprehensive documentation included"

    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
    echo "ℹ️  Committing latest changes..."
    git add .
    git commit -m "Update Fruvi for GitHub Pages deployment"
fi

# Create GitHub Actions workflow for automatic deployment
echo ""
echo "🚀 Creating GitHub Actions workflow..."

mkdir -p .github/workflows

cat > .github/workflows/github-pages.yml << 'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: .
        cname: your-custom-domain.com  # Optional: remove if not using custom domain
EOF

echo "✅ Created GitHub Actions workflow"

# Create CNAME file for custom domain (optional)
echo ""
echo "🔗 Optional: Custom domain setup"
read -p "Do you want to add a custom domain? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your custom domain (e.g., fruits.yoursite.com): " domain
    echo "$domain" > CNAME
    echo "✅ Created CNAME file for $domain"
    echo "ℹ️  Remember to configure DNS records in your domain provider"
fi

# Create deployment status file
cat > .deployment-status << 'EOF'
# Fruvi Deployment Status
Deployment Platform: GitHub Pages
Status: Ready for deployment
Last Updated: $(date)
Next Steps:
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Configure Supabase credentials
4. Test the live application

GitHub Pages URL: https://your-username.github.io/fruvi
EOF

echo "✅ Created deployment status file"

# Final instructions
echo ""
echo "🎉 GitHub Pages setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Create repository on GitHub.com (name: 'fruvi')"
echo "2. Run: git remote add origin https://github.com/YOUR-USERNAME/fruvi.git"
echo "3. Run: git push -u origin main"
echo "4. Go to Settings > Pages in your GitHub repo"
echo "5. Enable Pages with 'main' branch and '/root' folder"
echo "6. Your site will be live at: https://YOUR-USERNAME.github.io/fruvi"
echo ""
echo "📖 Read README.md for detailed setup instructions"
echo "📚 Check DEPLOYMENT.md for troubleshooting"
