# Google Sheets Setup Guide - Customer Issue Tracker

## 🎯 Overview

This guide will help you set up the Customer Issue Tracker using Google Sheets - **NO Azure or Microsoft Graph needed!**

**Total Setup Time**: 15-20 minutes

---

## ✅ Prerequisites

- Google account (personal or work)
- 15-20 minutes
- That's it! No Azure, no IT help needed!

---

## 📋 Setup Steps

### STEP 1: Create Google Sheet (5 minutes)

#### 1.1 Create the Sheet

1. Go to **https://sheets.google.com**
2. Click **Blank** to create a new spreadsheet
3. Name it: `CustomerIssues` (click on "Untitled spreadsheet" at the top)

#### 1.2 Add Column Headers

In the first row, add these headers:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Timestamp | Theme | Raised By | Issue Details | Assigned To | Status | Attachments |

**Exact headers (copy-paste these):**
```
Timestamp	Theme	Raised By	Issue Details	Assigned To	Status	Attachments
```

#### 1.3 Format the Sheet (Optional but Recommended)

1. Select Row 1 (click on the row number "1")
2. Make it bold: Click **Bold** button or press Ctrl+B
3. Add background color: Click **Fill color** → Choose a light color
4. Freeze the header row: Click **View** → **Freeze** → **1 row**

#### 1.4 Share with Your Team

1. Click the **Share** button (top right)
2. Enter team members' email addresses
3. Set permission to **Editor**
4. Click **Send**

---

### STEP 2: Create Google Apps Script (10 minutes)

Google Apps Script is like a mini backend that will receive data from your form and add it to the sheet.

#### 2.1 Open Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. A new tab will open with the script editor
3. You'll see a default `function myFunction() { }`

#### 2.2 Replace with This Code

Delete everything and paste this code:

```javascript
// Google Apps Script for Customer Issue Tracker

function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Prepare the row data
    var rowData = [
      data.timestamp,
      data.theme,
      data.raisedBy,
      data.issueDetails,
      data.assignedTo,
      data.status,
      data.attachments
    ];
    
    // Append the row to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Issue logged successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional - for testing in the editor)
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        theme: "Technical Issue",
        raisedBy: "test@example.com",
        issueDetails: "Test issue for verification",
        assignedTo: "sanaaks",
        status: "Open",
        attachments: "None"
      })
    }
  };
  
  var result = doPost(testData);
  Logger.log(result.getContent());
}
```

#### 2.3 Save the Script

1. Click the **Save** icon (💾) or press Ctrl+S
2. Give it a name: `IssueTrackerScript`
3. Click **OK**

#### 2.4 Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Select **Web app**
4. Fill in the deployment settings:
   - **Description**: `Customer Issue Tracker API`
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** (important!)
5. Click **Deploy**
6. You may see an authorization screen:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to IssueTrackerScript (unsafe)**
   - Click **Allow**
7. **IMPORTANT**: Copy the **Web app URL** that appears
   - It looks like: `https://script.google.com/macros/s/AKfycbx.../exec`
   - Save this URL - you'll need it in Step 3!

---

### STEP 3: Configure the Dashboard (2 minutes)

#### 3.1 Update app-google.js

1. Open `app-google.js` in a text editor
2. Find this line (around line 6):
   ```javascript
   const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
   ```
3. Replace with your actual URL:
   ```javascript
   const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx.../exec";
   ```
4. Save the file

---

### STEP 4: Deploy to GitHub Pages (5 minutes)

#### 4.1 Create GitHub Repository

1. Go to **https://github.com**
2. Sign in (or create a free account)
3. Click **+** (top right) → **New repository**
4. Fill in:
   - **Repository name**: `customer-issue-tracker`
   - **Description**: `Customer Issue Tracker with Google Sheets`
   - **Public** (required for free GitHub Pages)
   - ✅ Check **Add a README file**
5. Click **Create repository**

#### 4.2 Upload Files

1. In your repository, click **Add file** → **Upload files**
2. Drag and drop these files:
   - `index-google.html`
   - `app-google.js`
   - `GOOGLE_SETUP_GUIDE.md` (this file)
   - `README.md`
3. Click **Commit changes**

#### 4.3 Enable GitHub Pages

1. Click **Settings** (in your repository)
2. In the left menu, click **Pages**
3. Under **Source**:
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **Save**
5. Wait 1-2 minutes
6. Your site will be at: `https://[your-username].github.io/customer-issue-tracker/`

#### 4.4 Access Your Dashboard

1. Go to your GitHub Pages URL
2. Add `/index-google.html` to the end:
   ```
   https://[your-username].github.io/customer-issue-tracker/index-google.html
   ```
3. Bookmark this URL!

---

### STEP 5: Test the Dashboard (3 minutes)

#### 5.1 Open the Dashboard

1. Go to your GitHub Pages URL
2. You should see the beautiful dashboard

#### 5.2 Submit a Test Issue

1. Enter your email address
2. Select a theme: "Technical Issue"
3. Enter issue details: "Test issue for verification"
4. Assigned to: "sanaaks" (or change it)
5. Click **Submit Issue**
6. You should see a success message

#### 5.3 Verify in Google Sheets

1. Go back to your Google Sheet
2. Refresh the page
3. You should see a new row with your test issue!
4. All fields should be populated correctly

✅ **If you see the data, you're done!** 🎉

---

## 🎨 Customization

### Change Issue Themes

Edit `index-google.html` around line 150:

```html
<select class="form-select" id="theme" required>
    <option value="">Select a theme...</option>
    <option value="Technical Issue">Technical Issue</option>
    <option value="Your New Theme">Your New Theme</option>
    <!-- Add more options here -->
</select>
```

### Change Default Assignee

Edit `index-google.html` around line 175:

```html
<input type="text" class="form-control" id="assignedTo" value="your-alias" required>
```

### Change Colors

Edit the CSS variables in `index-google.html`:

```css
:root {
    --primary-color: #4285f4;  /* Google Blue */
    --secondary-color: #34a853; /* Google Green */
    --success-color: #34a853;
    --danger-color: #ea4335;
}
```

---

## 🧪 Testing Locally (Optional)

Before deploying to GitHub Pages, you can test locally:

### Method 1: Using Python

```bash
cd C:\Users\sanaaks\customer-issue-tracker
python -m http.server 8080
```

Then open: `http://localhost:8080/index-google.html`

### Method 2: Using Node.js

```bash
npx http-server -p 8080
```

Then open: `http://localhost:8080/index-google.html`

### Method 3: Just Open the File

Double-click `index-google.html` to open in your browser.

**Note**: You need the Google Apps Script URL configured for actual submissions to work.

---

## 🐛 Troubleshooting

### Issue: "Google Apps Script URL not configured"

**Solution:**
- Make sure you updated `SCRIPT_URL` in `app-google.js`
- The URL should start with `https://script.google.com/macros/s/`
- Make sure you saved the file after editing

### Issue: "Failed to submit to Google Sheets"

**Solutions:**
1. Check that the Google Apps Script is deployed as a web app
2. Make sure "Who has access" is set to "Anyone"
3. Try redeploying the script:
   - Go to Apps Script editor
   - Click **Deploy** → **Manage deployments**
   - Click **Edit** (pencil icon)
   - Change version to **New version**
   - Click **Deploy**
   - Update the URL in `app-google.js`

### Issue: Authorization errors in Apps Script

**Solutions:**
1. When deploying, make sure to click "Advanced" → "Go to IssueTrackerScript (unsafe)"
2. Click "Allow" to grant permissions
3. If still having issues, try:
   - Go to https://myaccount.google.com/permissions
   - Remove the app
   - Redeploy and reauthorize

### Issue: Data not appearing in Google Sheets

**Solutions:**
1. Check that you're looking at the correct sheet
2. Refresh the Google Sheets page
3. Check the Apps Script logs:
   - Go to Apps Script editor
   - Click **Executions** (left sidebar)
   - Look for errors
4. Try running the `testDoPost()` function:
   - In Apps Script editor
   - Select `testDoPost` from the function dropdown
   - Click **Run**
   - Check if a row is added to the sheet

### Issue: CORS errors in browser console

**Solution:**
- This is normal with Google Apps Script
- The `no-cors` mode in the code handles this
- As long as data appears in the sheet, it's working correctly

---

## 🔒 Security Considerations

### Public Access

The Google Apps Script is set to "Anyone" access because:
- It only accepts POST requests (can't be accessed directly in browser)
- It only appends data (can't read or modify existing data)
- The sheet itself is only shared with your team

### If You Need More Security

1. **Option 1**: Use Google Forms instead
   - Create a Google Form linked to your sheet
   - Embed the form in your dashboard
   - Google handles all security

2. **Option 2**: Add authentication to Apps Script
   - Require an API key in the POST request
   - Check the key in the `doPost` function
   - Only accept requests with valid key

3. **Option 3**: Use Google OAuth
   - Implement Google Sign-In in the dashboard
   - Pass the user's token to Apps Script
   - Verify the token before accepting data

---

## 📊 Viewing and Analyzing Data

### In Google Sheets

1. **Sort data**: Click on column header → Sort A-Z
2. **Filter data**: Click **Data** → **Create a filter**
3. **Create charts**: Select data → **Insert** → **Chart**
4. **Pivot tables**: **Insert** → **Pivot table**

### Export to Excel

1. **File** → **Download** → **Microsoft Excel (.xlsx)**

### Connect to Other Tools

Google Sheets can connect to:
- **Google Data Studio** (free dashboards)
- **Tableau** (if you have a license)
- **Power BI** (via Google Sheets connector)
- **Amazon QuickSight** (for advanced analytics later)

---

## 🚀 Next Steps

Once your dashboard is working:

1. **Share the URL** with your team
2. **Add more issue themes** as needed
3. **Create reports** in Google Sheets
4. **Set up notifications** (optional):
   - Use Google Apps Script to send emails when issues are submitted
   - Connect to Slack/Teams for notifications

---

## 📞 Support

### Resources

- **Google Apps Script Docs**: https://developers.google.com/apps-script
- **Google Sheets API**: https://developers.google.com/sheets/api
- **GitHub Pages Docs**: https://docs.github.com/en/pages

### Common Questions

**Q: Is this free?**
A: Yes! Google Sheets, Apps Script, and GitHub Pages are all free.

**Q: How many issues can I track?**
A: Google Sheets supports up to 10 million cells. With 7 columns, that's ~1.4 million issues!

**Q: Can I use this with my company Google Workspace?**
A: Yes! Works with both personal Gmail and Google Workspace accounts.

**Q: What if I don't have GitHub?**
A: You can host the HTML file anywhere:
- Your company's web server
- Netlify (free)
- Vercel (free)
- Or just open the HTML file locally

**Q: Can I add file attachments?**
A: Yes, but it requires additional setup with Google Drive API. The current version focuses on simplicity.

---

## ✅ Setup Checklist

- [ ] Created Google Sheet with 7 columns
- [ ] Added column headers
- [ ] Shared sheet with team
- [ ] Created Google Apps Script
- [ ] Pasted the script code
- [ ] Deployed as web app
- [ ] Copied the web app URL
- [ ] Updated `app-google.js` with URL
- [ ] Created GitHub repository
- [ ] Uploaded files to GitHub
- [ ] Enabled GitHub Pages
- [ ] Tested the dashboard
- [ ] Verified data in Google Sheets
- [ ] Shared URL with team

---

## 🎉 Congratulations!

Your Customer Issue Tracker is now live with Google Sheets! 

**Benefits you now have:**
- ✅ No Azure setup needed
- ✅ No IT help required
- ✅ Free forever
- ✅ Real-time collaboration
- ✅ Easy to use
- ✅ Accessible from anywhere

**Share your dashboard URL with your team and start tracking issues!** 🚀
