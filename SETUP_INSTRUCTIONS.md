# 🚀 CashoraAI Setup Instructions

## Prerequisites

Before you start, make sure you have:
- Node.js (v14 or higher) installed
- npm (Node Package Manager)
- A Supabase account (free tier available at https://supabase.com)

## Step 1: Clone the Repository

```bash
git clone https://github.com/Alok-28/cashoraAI.git
cd cashoraAI
```

## Step 2: Install Dependencies

```bash
cd server
npm install
```

This will install all required packages including:
- Express.js
- Supabase client
- Passport for authentication
- And other dependencies

## Step 3: Set Up Supabase

### 3.1 Create a Supabase Project
1. Go to https://supabase.com
2. Sign up or log in
3. Create a new project
4. Wait for the project to be set up (takes ~2 minutes)

### 3.2 Get Your Supabase Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...` - keep this secret!)

### 3.3 Set Up Database Tables

In your Supabase dashboard:
1. Go to **SQL Editor**
2. Run the SQL script from `server/SUPABASE_FUNCTIONS.sql`
3. This will create all necessary tables and functions

## Step 4: Configure Environment Variables

```bash
# In the server directory
cp .env.example .env
```

Edit the `.env` file and add your Supabase credentials:

```env
# Session Secret Key (Change this in production!)
SESSION_SECRET=your-super-secret-key-change-in-production-min-32-chars

# Server Port (default: 4000)
PORT=4000

# Node Environment
NODE_ENV=development

# Supabase Configuration (Required)
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...your-service-role-key
SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
```

**Important Security Notes:**
- Generate a strong `SESSION_SECRET` (at least 32 characters)
- Never commit the `.env` file to git (it's already in `.gitignore`)
- Keep your `SUPABASE_SERVICE_KEY` private

## Step 5: Run the Application

```bash
# Make sure you're in the server directory
cd server
npm start
```

You should see:
```
✅ Supabase client initialised → https://xxxxxxxxxxxxx.supabase.co
Server running on http://127.0.0.1:4000
```

## Step 6: Access the Application

Open your browser and navigate to:
- **Homepage:** http://127.0.0.1:4000
- **Login:** http://127.0.0.1:4000/login/
- **Dashboard:** http://127.0.0.1:4000/dashboard/ (after login)

## 🔐 Demo Accounts

If you've run the Supabase SQL setup, you may have demo accounts. Otherwise, you'll need to create users through your application's registration system.

## 🛠 Troubleshooting

### Error: "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY"
- Make sure your `.env` file exists in the `server` directory
- Verify all Supabase credentials are correctly set
- Check that there are no extra spaces or quotes around the values

### Error: "Cannot find module"
- Run `npm install` in the server directory
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Port 4000 Already in Use
- Change the `PORT` in your `.env` file to another port (e.g., 3000, 5000)
- Or stop the process using port 4000

### Database Connection Issues
- Verify your Supabase project is active
- Check that you're using the correct project URL
- Ensure your Supabase project has the required tables (run the SQL setup)

## 📦 Project Structure

```
cashoraAI/
├── server/
│   ├── index.js              # Main server file
│   ├── package.json          # Dependencies
│   ├── .env                  # Your credentials (not in git)
│   ├── .env.example          # Template
│   ├── src/
│   │   ├── db.js            # Supabase client
│   │   └── services/        # Business logic
│   └── data/                # Uploaded files
├── index.html               # Landing page
├── login/                   # Login page
├── dashboard/               # Dashboard interface
├── contact/                 # Contact page
└── assets/                  # Static assets
```

## 🚀 Next Steps

Once everything is running:
1. Create user accounts in your Supabase database
2. Test the login functionality
3. Explore the dashboard features
4. Customize the application for your needs

## 📝 Additional Configuration

### Google OAuth (Optional)
If you want to enable Google login:
1. Set up a Google Cloud Project
2. Enable Google OAuth2 API
3. Add credentials to your `.env` file

### Production Deployment
For production deployment:
1. Set `NODE_ENV=production`
2. Use a strong, random `SESSION_SECRET`
3. Enable HTTPS
4. Set up proper CORS restrictions
5. Configure a production-ready database

## 📞 Support

For issues or questions:
- Check the documentation files in the repository
- Review the Supabase documentation: https://supabase.com/docs
- Open an issue on GitHub

---

**Last Updated:** November 2024  
**Status:** Active Development
