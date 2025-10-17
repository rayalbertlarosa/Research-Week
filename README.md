# 🌐 DLSMHSI Research Week 2025 - Full-Stack Deployment Package

**Complete full-stack website with backend features**

---

## 📦 What's Included

This folder contains the **complete full-stack application** ready for deployment to platforms like:
- **Render.com** (Recommended - Full Node.js support)
- **Railway.app** (Easy deployment)
- **Heroku** (Classic platform)
- **Vercel** (With serverless functions)
- **Any Node.js hosting service**

### **Frontend Files:**
- `index.html` - Main website page (updated with IMG_6859.png logo)
- `styles.css` - Complete styling (enhanced logo: 65px nav, 180px loading)
- `script.js` - All interactive functionality
- `admin-dashboard.html` - Admin control panel
- `favicon.svg` - Browser icon
- `images/` - All image assets including updated logo

### **Backend Files:**
- `server-fullstack.js` - Express.js server with all API endpoints
- `database.js` - SQLite database management
- `email.js` - Email automation service (NodeMailer)
- `package.json` - All dependencies and scripts
- `.gitignore` - Security configuration
- `.env.example` - Environment variables template

---

## 🚀 Quick Deploy - Full Stack

### **Option 1: Render.com** ⭐ (Recommended)

1. Go to https://render.com
2. Sign up (free)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository OR upload this folder
5. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server-fullstack.js`
   - **Plan:** Free
6. Add **Environment Variables**:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   NODE_ENV=production
   PORT=3000
   ```
7. Click **"Create Web Service"**

**Your URL:** `https://dlsmhsi-research-week-2025.onrender.com`

**Time:** 10 minutes

---

### **Option 2: Railway.app** (Easiest)

1. Go to https://railway.app
2. Sign up with GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. Railway auto-detects Node.js!
5. Add environment variables (EMAIL_USER, EMAIL_PASS)
6. Deploy

**Your URL:** `https://dlsmhsi-research-week-2025.railway.app`

**Time:** 5 minutes

---

## ⚠️ Important Notes

### **Full-Stack Features Included** ✅

This is a **complete full-stack deployment** package. All features are available:
- ✅ Registration system (Express.js backend)
- ✅ Email automation (NodeMailer with Gmail)
- ✅ Admin dashboard (Complete control panel)
- ✅ Database storage (SQLite3)
- ✅ API endpoints (RESTful API)

### **What You Need to Configure**

- 📧 Gmail App Password (for email sending)
- 🔐 Environment variables (EMAIL_USER, EMAIL_PASS)
- 🗄️ Database will auto-create on first run
- 🌐 Deploy to Node.js hosting (Render, Railway, etc.)

---

## 📧 Email Configuration (Required)

### **Get Gmail App Password:**

1. Go to https://myaccount.google.com/apppasswords
2. Sign in to your Google account
3. Enable **2-Factor Authentication** (if not already enabled)
4. Click **"App passwords"**
5. Select:
   - App: **Mail**
   - Device: **Other** (Custom name)
   - Name it: "DLSMHSI Research Week"
6. Click **"Generate"**
7. Copy the **16-character password** (format: `xxxx xxxx xxxx xxxx`)

### **Add to Hosting Platform:**

**On Render.com:**
1. Go to your web service
2. Click **"Environment"** tab
3. Add variables:
   ```
   EMAIL_USER = your-email@gmail.com
   EMAIL_PASS = xxxx xxxx xxxx xxxx
   ```

**On Railway.app:**
1. Click your project
2. Go to **"Variables"** tab
3. Add EMAIL_USER and EMAIL_PASS

---

## 🗄️ Database

### **SQLite Database:**
- Automatically created on first run
- File: `registrations.db` (excluded from git)
- Tables:
  - `registrations` - All registration data
  - `email_logs` - Email sending history

### **Database Features:**
- Day-specific attendance tracking (5 days)
- Status management (Active, Cancelled, Waitlist, Confirmed, Completed)
- Payment tracking (Pending, Paid, Refunded, Waived)
- Email delivery tracking
- Timestamp for all records

---

## 👨‍💼 Admin Dashboard

### **Access:**
```
https://your-site-url.com/admin
```

### **Features:**
- **Statistics Panel:**
  - Total registrations
  - Today's registrations
  - Emails sent count
  - Day-by-day counts (Day 1-5)
  - Affiliation breakdown

- **Registration Table:**
  - Searchable and filterable
  - Shows all registration details
  - Day selections visible (D1, D2, D3, D4, D5)
  - Status and payment columns
  - Action buttons for each entry

- **Actions:**
  - Update registration status
  - Update payment status
  - Export to CSV
  - Real-time data refresh

---

## 🎨 Logo Information

### **Current Logo:**
- File: `images/IMG_6859.png` (1.09 MB)
- Navigation: 65px height (enhanced size)
- Format: PNG
- Locations: Navigation bar, favicon, social media tags

---

## 📊 Files Summary

### **Frontend Files:**
| File | Size | Purpose |
|------|------|---------|
| `index.html` | ~29 KB | Main website |
| `admin-dashboard.html` | ~24 KB | Admin control panel |
| `styles.css` | ~42 KB | Complete styling |
| `script.js` | ~44 KB | Interactivity |
| `favicon.svg` | ~0.5 KB | Browser icon |
| `images/IMG_6859.png` | 1.09 MB | Updated logo |
| `images/*.svg` | ~0.9 KB each | Speaker icons |

### **Backend Files:**
| File | Size | Purpose |
|------|------|---------|
| `server-fullstack.js` | ~14 KB | Express server with API endpoints |
| `database.js` | ~12 KB | SQLite database management |
| `email.js` | ~15 KB | Email automation service |
| `package.json` | ~1.2 KB | Node.js dependencies |
| `.gitignore` | ~0.5 KB | Security configuration |
| `.env.example` | ~0.9 KB | Environment variables template |

**Total Size:** ~1.3 MB (excluding node_modules)

---

## 🌐 Deployment Platforms

### **Recommended for Full-Stack:**

#### **Render.com** ⭐ (Best Choice)
- Full Node.js support
- Free tier available
- Automatic HTTPS
- Easy environment variables
- Database persistence
- **Best for:** Production deployment

#### **Railway.app** (Easiest)
- Auto-detects Node.js
- $5 free credit/month
- Simple deployment
- **Best for:** Quick deployment

#### **Heroku**
- Classic platform
- Add-ons available
- **Best for:** Enterprise features

#### **Vercel** (With Serverless)
- Fast deployment
- Requires serverless conversion
- **Best for:** Hybrid apps

---

## 📝 Deployment Checklist

Before deploying, ensure:
- [x] All files in this folder
- [x] Backend files included (server, database, email)
- [x] Package.json with dependencies
- [x] .gitignore configured
- [x] .env.example template provided
- [ ] Email credentials ready (Gmail App Password)
- [ ] GitHub repository created (if using)

After deploying:
- [ ] Website loads correctly
- [ ] Logo displays (65px in navigation)
- [ ] Registration form submits
- [ ] Email confirmations send
- [ ] Admin dashboard accessible (`/admin`)
- [ ] Database stores data
- [ ] Mobile responsive works
- [ ] All API endpoints functional
- [ ] No console errors

---

## 🔄 Updating After Deployment

### **Netlify:**
1. Drag new files to same site
2. Automatic update

### **GitHub Pages:**
1. Commit new files to repository
2. Push to GitHub
3. Auto-deploys in 1-2 minutes

### **Vercel:**
1. Push to connected Git repo
2. Auto-deploys

---

## 💡 Tips

1. **Test locally first:** Run `npm install` then `node server-fullstack.js`
2. **Use environment variables:** Never commit real passwords
3. **Check logs:** Monitor server logs for errors
4. **Test registration:** Submit a test registration
5. **Verify emails:** Ensure confirmations are sending
6. **Hard refresh:** After deployment, press Ctrl + Shift + R
7. **Monitor database:** Check that registrations are saving
8. **Backup data:** Export CSV regularly from admin dashboard

---

## 📞 Support

**Project:** DLSMHSI Research Week 2025  
**Email:** researchweek@dlsmhsi.edu.ph  
**Phone:** (046) 416-4341

**Documentation:** See main project folder for complete guides

---

## 🎯 Quick Start

**Deploy in 5 steps:**

1. **Choose platform** (Render.com or Railway.app recommended for full-stack)
2. **Upload this folder** or connect GitHub repository
3. **Set environment variables** (EMAIL_USER and EMAIL_PASS)
4. **Deploy** - Platform will auto-detect Node.js
5. **Get your live URL!**

**Full-stack deployment ready!** 🎉

---

**Prepared by:** Ray Albert E. La Rosa  
**Date:** 2025-10-16  
**Version:** Full-Stack Deployment Package  
**Logo:** IMG_6859.png (Updated)  
**Backend:** Complete with Registration System

---

[![Deploy to Render](https://img.shields.io/badge/Deploy%20to-Render-46E3B7?style=for-the-badge&logo=render)]()
[![Deploy to Railway](https://img.shields.io/badge/Deploy%20to-Railway-0B0D0E?style=for-the-badge&logo=railway)]()
[![Full Stack](https://img.shields.io/badge/Full-Stack-success?style=for-the-badge)]()
