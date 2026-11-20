#!/bin/bash

echo "🚀 CashoraAI - GitHub Push Script"
echo "=================================="
echo ""

# Check if there are changes to push
if git status | grep -q "Your branch is ahead"; then
    echo "✅ Local commits found, ready to push"
    echo ""
    
    # Show what will be pushed
    echo "📦 Changes to be pushed:"
    git log origin/main..HEAD --oneline
    echo ""
    
    # Ask for confirmation
    read -p "Do you want to push to GitHub? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Pushing to GitHub..."
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Successfully pushed to GitHub!"
            echo "🔗 View at: https://github.com/Alok-28/cashoraAI"
        else
            echo ""
            echo "❌ Push failed. You may need to authenticate."
            echo ""
            echo "Options:"
            echo "1. Use GitHub CLI: gh auth login"
            echo "2. Use Personal Access Token"
            echo "3. Configure SSH keys"
        fi
    else
        echo "❌ Push cancelled"
    fi
else
    echo "✅ Already up to date with remote"
    echo "🔗 View at: https://github.com/Alok-28/cashoraAI"
fi

echo ""
echo "📚 Next steps:"
echo "1. Set up Supabase account (see SETUP_INSTRUCTIONS.md)"
echo "2. Configure server/.env with credentials"
echo "3. Run: cd server && npm start"
