# 🎛️ Admin Panel - StyloOutfit

## 🚀 Quick Access

**Admin Panel URL:** `admin.html`

Login karne ke baad directly admin panel access kar sakte ho.

---

## ✨ Features

### 1️⃣ **Dashboard**
- **Total Users Count** - Kitne users registered hain
- **Total Images** - Website pe kitni images hain
- **Total Outfits** - Kitne outfits available hain
- **Today's Logins** - Aaj kitne users login kiye
- **Recent Activity** - Latest user registrations aur activities
- **Quick Stats** - Google vs Manual login breakdown

### 2️⃣ **Users Management** 👥
- **View All Users** - Sabhi registered users ki list
- **Search Users** - Name ya email se search karo
- **User Details** - Har user ki complete information:
  - Name
  - Email
  - Profile Picture
  - Login Method (Google/Manual)
  - Registration Date
- **Delete Users** - Users ko remove kar sakte ho
- **Export to CSV** - Sabhi users ka data CSV file mein download karo

### 3️⃣ **Image Gallery Management** 🖼️
- **Upload Images** - Drag & drop ya browse karke images upload karo
- **Image Categories**:
  - Hero Banners
  - Outfit Images
  - Gallery Images
  - Promo Sliders
- **Filter by Category** - Category wise images dekho
- **Edit Images** - Image details update karo
- **Delete Images** - Unwanted images remove karo
- **Image URL Support** - Direct URL se bhi images add kar sakte ho

### 4️⃣ **Outfits Management** 👔
- **Add New Outfits** - Naye outfits add karo
- **Outfit Details**:
  - Name
  - Image
  - Category (Casual, Formal, Party, Sports, Ethnic)
  - Occasion
  - Description
- **Edit Outfits** - Existing outfits update karo
- **Delete Outfits** - Outfits remove karo
- **Visual Grid** - Sabhi outfits ek saath dekho

### 5️⃣ **Website Content Management** 📝
Control karo website ka har content:

#### **Hero Section**
- Badge Text (e.g., "AI-Powered Styling")
- Main Title
- Subtitle
- CTA Button Text

#### **Promo Sliders**
- Add/Remove promo slides
- Update slider images

#### **Homepage Stats**
- Happy Clients count
- Styled Outfits count
- User Rating

#### **Footer**
- Copyright text
- Footer content

### 6️⃣ **Settings** ⚙️
- **API Configuration** - Backend URL aur status
- **Database Info** - MongoDB connection details
- **Test Connection** - API connection check karo
- **Clear Cache** - Cached data clear karo
- **Backup Data** - Complete data backup download karo
- **Reset Demo Data** - Demo data reset karo

---

## 🎯 How to Use

### **Step 1: Access Admin Panel**
```
http://localhost:5500/admin.html
```
Ya apne Live Server URL pe `/admin.html` open karo.

### **Step 2: Login**
Pehle `auth.html` se login karo (Google ya Manual), phir admin panel access karo.

### **Step 3: Navigate**
Left sidebar se different sections access karo:
- 📊 Dashboard
- 👥 Users Management
- 🖼️ Image Gallery
- 👔 Outfits
- 📝 Website Content
- ⚙️ Settings

---

## 📸 Image Upload Guide

### **Method 1: Drag & Drop**
1. "Upload Images" button click karo
2. Images ko drag karke upload area mein drop karo
3. Category select karo
4. Alt text add karo
5. "Save Image" click karo

### **Method 2: Browse Files**
1. "Upload Images" button click karo
2. "Browse Files" click karo
3. Computer se images select karo
4. Category aur alt text add karo
5. Save karo

### **Method 3: Image URL**
1. "Upload Images" button click karo
2. Direct image URL paste karo
3. Category aur alt text add karo
4. Save karo

---

## 👔 Outfit Management Guide

### **Add New Outfit**
1. "Outfits" section mein jao
2. "+ Add New Outfit" button click karo
3. Fill karo:
   - Outfit Name (e.g., "Summer Casual Look")
   - Image URL
   - Category (Casual/Formal/Party/Sports/Ethnic)
   - Occasion (e.g., "Weekend Brunch")
   - Description (optional)
4. "Save Outfit" click karo

### **Edit Outfit**
1. Outfit card pe "Edit" button click karo
2. Details update karo
3. Save karo

### **Delete Outfit**
1. "Delete" button click karo
2. Confirm karo

---

## 📝 Website Content Update

### **Update Hero Section**
1. "Website Content" section mein jao
2. "Hero Section" tab select karo
3. Text fields update karo:
   - Badge Text
   - Main Title
   - Subtitle
   - CTA Button Text
4. "Save Changes" click karo

### **Update Stats**
1. "Stats" tab select karo
2. Numbers update karo
3. Save karo

**Note:** Changes localStorage mein save hote hain. Real website update karne ke liye HTML files manually edit karni hongi.

---

## 👥 User Management

### **View User Details**
- Table mein 👁️ icon click karo
- User ki complete information popup mein dikhegi

### **Delete User**
- 🗑️ icon click karo
- Confirmation dialog mein "Delete" click karo

### **Export Users**
- "Export CSV" button click karo
- CSV file automatically download hogi
- Excel mein open kar sakte ho

### **Search Users**
- Search box mein type karo
- Real-time filtering hogi

---

## 🔧 Settings & Maintenance

### **Test API Connection**
```javascript
Settings → Test Connection
```
Backend API working hai ya nahi check karta hai.

### **Backup Data**
```javascript
Settings → Backup Data
```
Complete data JSON format mein download hota hai:
- All users
- All images
- All outfits
- Website content
- Timestamp

### **Clear Cache**
```javascript
Settings → Clear Cache
```
LocalStorage se saved content clear hota hai.

### **Reset Demo Data**
```javascript
Settings → Reset Demo Data
```
⚠️ **Warning:** Yeh sabhi demo data delete kar dega!

---

## 🔐 Security Notes

### **Current Setup**
- Admin panel koi bhi logged-in user access kar sakta hai
- Real authentication nahi hai (demo purpose)

### **Production Recommendations**
1. **Admin Role Add Karo** - User model mein `role: 'admin'` field add karo
2. **Backend Middleware** - Admin-only routes banao
3. **Frontend Check** - Admin panel mein role check karo:
```javascript
const userData = JSON.parse(localStorage.getItem('styloUserData'));
if (userData.role !== 'admin') {
    window.location.href = 'index.html';
}
```

---

## 📊 Data Flow

```
Frontend (admin.html)
    ↓
API Calls (config.js)
    ↓
Backend (Render.com)
    ↓
MongoDB Atlas
```

---

## 🎨 Customization

### **Change Colors**
`css/admin.css` mein CSS variables edit karo:
```css
:root {
    --admin-primary: #6366f1;
    --admin-secondary: #8b5cf6;
    --admin-success: #10b981;
    --admin-danger: #ef4444;
}
```

### **Add New Sections**
1. `admin.html` mein naya section add karo
2. Sidebar mein link add karo
3. `admin.js` mein functionality add karo

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Users load nahi ho rahe | Backend server running hai check karo |
| Images upload nahi ho rahe | Image URL valid hai check karo |
| Changes save nahi ho rahe | Browser console check karo for errors |
| API connection failed | Backend URL correct hai verify karo |
| Logout nahi ho raha | LocalStorage clear karo manually |

---

## 📱 Mobile Responsive

Admin panel **fully responsive** hai:
- ✅ Mobile phones
- ✅ Tablets
- ✅ Desktops
- ✅ Large screens

Mobile pe sidebar hamburger menu se open hota hai.

---

## 🚀 Future Enhancements

Aap yeh features add kar sakte ho:

1. **Real Image Upload** - Backend pe file upload API
2. **Rich Text Editor** - Content editing ke liye WYSIWYG editor
3. **Analytics Dashboard** - Charts aur graphs
4. **Email Notifications** - Admin ko alerts
5. **Bulk Actions** - Multiple items ek saath edit/delete
6. **Activity Logs** - Sabhi admin actions ka log
7. **User Roles** - Admin, Moderator, Editor roles
8. **Search & Filters** - Advanced filtering options

---

## 📞 Support

Koi problem ho toh:
1. Browser console check karo
2. Network tab mein API calls dekho
3. Backend logs check karo

---

## ✅ Checklist

Admin panel use karne se pehle:

- [ ] Backend server running hai
- [ ] MongoDB connected hai
- [ ] User logged in hai
- [ ] Browser console mein errors nahi hain
- [ ] API connection working hai

---

**🎉 Admin Panel Ready Hai! Enjoy Managing Your Website! 🎉**
