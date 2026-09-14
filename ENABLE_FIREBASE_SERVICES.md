# 🔥 Enable Firebase Services - Step by Step Guide

Follow these exact steps to enable Firestore Database and Firebase Storage for Glimmr.

---

## 📊 STEP 1: Enable Firestore Database

### 1.1 Open Firebase Console
- Go to: https://console.firebase.google.com/project/glimmr-3b56a/firestore
- Or navigate: Firebase Console → Your Project (Glimmr) → Build → Firestore Database

### 1.2 Create Database
1. Click the **"Create database"** button (big blue button in the center)
2. You'll see a dialog "Create a database"

### 1.3 Choose Security Rules
You'll see two options:
- ✅ **Select "Start in test mode"** (recommended for development)
  - This allows read/write access for 30 days
  - Perfect for development and testing
- ❌ Don't select "Start in production mode" (you can change this later)

Click **"Next"**

### 1.4 Select Location
Choose the location closest to your users:
- **Recommended for Bengaluru**: 
  - `asia-south1` (Mumbai, India) - **BEST CHOICE**
  - OR `asia-southeast1` (Singapore)
- ⚠️ **Important**: You CANNOT change this location later!

Click **"Enable"**

### 1.5 Wait for Setup
- This takes 1-2 minutes
- You'll see "Provisioning Cloud Firestore..."
- Once done, you'll see the Firestore dashboard

✅ **Firestore is now enabled!**

---

## 📦 STEP 2: Enable Firebase Storage

### 2.1 Open Storage Section
- Go to: https://console.firebase.google.com/project/glimmr-3b56a/storage
- Or navigate: Firebase Console → Your Project (Glimmr) → Build → Storage

### 2.2 Get Started
1. Click the **"Get started"** button
2. You'll see a dialog about Storage Security Rules

### 2.3 Choose Security Rules
You'll see two options:
- ✅ **Select "Start in test mode"** (recommended for development)
  - Allows read/write access for 30 days
  - Good for testing file uploads
- ❌ Don't select "Start in production mode" (you can change this later)

Click **"Next"**

### 2.4 Select Location
- **Use the SAME location as Firestore!**
  - If you chose `asia-south1` for Firestore, choose it here too
- This ensures best performance

Click **"Done"**

### 2.5 Wait for Setup
- Takes about 30 seconds
- You'll see "Setting up Cloud Storage..."
- Once done, you'll see the Storage dashboard with a "Files" tab

✅ **Storage is now enabled!**

---

## ✅ STEP 3: Verify Setup

### Check Firestore:
1. Go to: https://console.firebase.google.com/project/glimmr-3b56a/firestore
2. You should see:
   - "Start collection" button
   - Firestore Data tab
   - Rules, Indexes, Usage tabs

### Check Storage:
1. Go to: https://console.firebase.google.com/project/glimmr-3b56a/storage
2. You should see:
   - "Files" tab showing your bucket: `glimmr-3b56a.firebasestorage.app`
   - "Upload file" and "Create folder" buttons
   - Rules, Usage tabs

---

## 🧪 STEP 4: Test Your Connection

### Run Your App:
```powershell
cd d:\Projects\Glimmr
pnpm --filter @glimmr/app run dev
```

### Check Connection Status:
1. Open your browser: http://localhost:5173
2. Look at the **bottom-right corner**
3. You should see a panel showing:
   - 🟢 **"Firebase Connected ✓"**
   - ✓ Firestore (green checkmark)
   - ✓ Storage (green checkmark)

If you see red X marks or errors:
- Wait 1-2 minutes (services might still be initializing)
- Refresh the page
- Check browser console for errors

---

## 🔒 STEP 5: Update Security Rules (Later)

The "test mode" rules expire after 30 days. Before that, update them:

### Firestore Rules (Production):
1. Go to: Firestore Database → Rules tab
2. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Places - read by all, write by admin
    match /places/{placeId} {
      allow read: if true;
      allow write: if false; // or add admin check
    }
    
    // Outings - users own their data
    match /outings/{outingId} {
      allow read, write: if request.auth != null;
    }
  }
}
```
3. Click **"Publish"**

### Storage Rules (Production):
1. Go to: Storage → Rules tab
2. Replace with:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Place images - read by all
    match /places/{allPaths=**} {
      allow read: if true;
      allow write: if false; // or add admin check
    }
  }
}
```
3. Click **"Publish"**

---

## 🎯 Quick Links

- **Firestore Console**: https://console.firebase.google.com/project/glimmr-3b56a/firestore
- **Storage Console**: https://console.firebase.google.com/project/glimmr-3b56a/storage
- **Project Settings**: https://console.firebase.google.com/project/glimmr-3b56a/settings/general

---

## ❓ Troubleshooting

### Problem: "Create database" button is grayed out
- **Solution**: Refresh the page, you might already have Firestore enabled

### Problem: Can't select location
- **Solution**: Make sure you clicked "Next" on the security rules screen first

### Problem: Red X marks in the connection test
- **Solution**: 
  1. Wait 2 minutes for services to fully initialize
  2. Check if Firestore/Storage are actually enabled in console
  3. Refresh your app page
  4. Check browser console for specific errors

### Problem: "Permission denied" errors
- **Solution**: Make sure you selected "test mode" (not production mode)

---

## 🎉 You're Done!

Once both services show green checkmarks in your app, you can:
- Save places to Firestore
- Upload images to Storage
- Query data from your app
- Build your outing planner features

Happy coding! 🚀
