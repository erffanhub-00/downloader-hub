# 📁 Download Manager

A simple and clean download manager dashboard to organize and manage your files and folders with Google Drive links.

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---
## Me
[![Telegram](https://img.shields.io/badge/Telegram-erffan__hub-blue?style=for-the-badge&logo=telegram)](https://t.me/erffan_hub)
[![Twitter](https://img.shields.io/badge/Twitter-@Erffanhub__00-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/Erffanhub_00)
[![Gist](https://img.shields.io/badge/Gist-Profile-000000?style=for-the-badge&logo=github)](https://gist.github.com/erffanhub-00)
[![Github](https://img.shields.io/badge/Github-Profile-000000?style=for-the-badge&logo=github)](https://github.com/erffanhub-00)

---

## ✨ Features

- 📂 **Manage Folders** - Create, edit, and delete folders
- 📄 **Manage Files** - Add, edit, and delete files with direct download links
- 🔗 **Google Drive Support** - Use direct Google Drive download links
- 💾 **Local Storage** - All data saved automatically in your browser
- 📥 **Export/Import** - Backup and restore data using JSON files
- 🔍 **Search** - Search through folders and files
- 🎨 **Clean UI** - Modern, responsive, and user-friendly interface

---

## 🚀 Quick Start

### 1. Clone or Download
```bash
git clone https://github.com/your-username/download-manager.git
```

### 2. Open in Browser
Simply open `index.html` in your browser.

### 3. Start Managing
- Click **Folders** to manage your categories
- Click **Files** to manage your downloads
- Use **Export** to backup your data
- Use **Import** to restore from `data.json`

---

## 📦 File Structure

```
download-manager/
├── index.html          # Main HTML file
├── app.js              # JavaScript logic
├── style.css           # Styles
└── README.md           # Documentation
```

---

## 📊 Data Structure

```json
{
  "folders": [
    { "id": "1", "name": "Web Projects" }
  ],
  "files": [
    {
      "id": "1",
      "name": "template.zip",
      "size": "4.2 MB",
      "folderId": "1",
      "link": "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID"
    }
  ]
}
```

---

## 🔗 Google Drive Links

To get a direct download link from Google Drive:

1. Upload your file to Google Drive
2. Right-click → Get link → Share with anyone
3. Copy the file ID from the URL:
   ```
   https://drive.google.com/file/d/XXXXXXXXXXXXX/view
   ```
4. Use this format:
   ```
   https://drive.google.com/uc?export=download&id=XXXXXXXXXXXXX
   ```

---

## 🛠️ Usage

### Add a Folder
1. Click **Folders** in sidebar
2. Click **New Folder**
3. Enter folder name
4. Click **Create**

### Add a File
1. Click **Files** in sidebar
2. Click **New File**
3. Fill in the details
4. Click **Add**

### Export Data
1. Click **Export** in sidebar
2. File `data.json` will download

### Import Data
1. Click **Import** in sidebar
2. Select a `data.json` file
3. Choose **Replace** or **Merge**

---
