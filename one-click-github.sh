#!/bin/bash

# Fruvi - One-Click GitHub Setup
echo "🍎 FRUVI - ONE-CLICK GITHUB SETUP"
echo "================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Checking project...${NC}"
if [ ! -f "index.html" ] || [ ! -f "README.md" ]; then
    echo -e "${YELLOW}❌ Error: Please run this from the Fruvi project directory${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project verified${NC}"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${BLUE}🔧 Initializing Git...${NC}"
    git init
    git add .
    git commit -m "🎉 Initial commit - Fruvi Professional Fruit Store

✅ Complete professional fruit store application
✅ Modern SPA with authentication and AI
✅ 15 premium products with real images
✅ Responsive glassmorphism design
✅ Ready for GitHub Pages deployment
✅ Comprehensive documentation included"
    echo -e "${GREEN}✅ Git initialized${NC}"
else
    echo -e "${GREEN}✅ Git already initialized${NC}"
fi

# Ask for GitHub username
echo ""
echo -e "${YELLOW}📝 I need your GitHub username to set up the remote${NC}"
read -p "Enter your GitHub username: " github_username

if [ -z "$github_username" ]; then
    echo -e "${YELLOW}❌ GitHub username is required${NC}"
    exit 1
fi

# Set up remote
echo -e "${BLUE}🔗 Setting up GitHub remote...${NC}"
git remote add origin "https://github.com/$github_username/fruvi.git" 2>/dev/null || git remote set-url origin "https://github.com/$github_username/fruvi.git"

echo -e "${GREEN}✅ Remote configured${NC}"

# Push to GitHub
echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
if git push -u origin main; then
    echo -e "${GREEN}✅ Code pushed to GitHub successfully!${NC}"
    echo ""
    echo -e "${GREEN}🎉 SUCCESS!${NC}"
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo "1. Go to: https://github.com/$github_username/fruvi"
    echo "2. Click Settings > Pages"
    echo "3. Set Source to 'Deploy from a branch'"
    echo "4. Select branch 'main' and folder '/ (root)'"
    echo "5. Click 'Save'"
    echo ""
    echo -e "${GREEN}🌐 Your site will be live at:${NC}"
    echo -e "${YELLOW}https://$github_username.github.io/fruvi${NC}"
    echo ""
    echo -e "${BLUE}📖 Remember to:${NC}"
    echo "- Configure Supabase credentials in supabaseService.js"
    echo "- Set up Groq API key for the AI assistant"
    echo "- Test all features on the live site"
else
    echo -e "${YELLOW}❌ Failed to push to GitHub${NC}"
    echo -e "${BLUE}💡 Possible solutions:${NC}"
    echo "1. Make sure you have GitHub account access"
    echo "2. Check your internet connection"
    echo "3. Verify the repository name 'fruvi' doesn't already exist"
    echo ""
    echo -e "${YELLOW}🔄 Try manually:${NC}"
    echo "git remote add origin https://github.com/$github_username/fruvi.git"
    echo "git push -u origin main"
fi
