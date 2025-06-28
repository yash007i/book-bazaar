# 📚 BookBazaar API

A complete RESTful web API for an online book store platform where users can browse, order, and review books. Admins can manage books, users, and orders. This project includes API key authentication, JWT login, file uploads with Cloudinary, and complete CRUD functionality.

---

## 🔧 Tech Stack

| Layer        | Technology           |
|--------------|----------------------|
| Backend      | Node.js, Express.js  |
| Database     | MongoDB (Mongoose)   |
| Auth         | JWT, API Key (crypto)|
| File Upload  | Multer, Cloudinary   |
| Utilities    | bcryptjs, cookie-parser, cors, dotenv |
| API Testing  | Postman              |

---

## 📁 Project Structure
---
bookbazaar/  
│  
├── public  
&nbsp;├── images  
├── src  
&nbsp;  ├── constants/ # User role, payment status, order status  
&nbsp;  ├── controllers/ # Business logic (books, orders, reviews, users)  
&nbsp;  ├── db/ # DB connection  
&nbsp;  ├── models/ # Mongoose schemas  
&nbsp;  ├── routes/ # Express route files  
&nbsp;  ├── middleware/ # Custom middleware (auth, admin, apiKey), File upload (Multer)  
&nbsp;  ├── utils/ # Helper functions (cloudinary config, asyncHandler, error & response handler)  
&nbsp; ├── validators/ # Data validation using zod (login, signup, book)  
&nbsp;  ├── index # Main server file (Express app setup and route setup with cors)    
├── .env # Environment variables  
├── .prettierrc # Mange project strucuture  
├── package-json # Project requirenment  
└── README.md # Project documentation  


---

## 🚀 Features  

- ✅ **User Authentication** (JWT tokens)  
- 🔑 **API Key Generation & Validation** (with crypto)  
- 🔒 **Admin Check Middleware**  
- 📚 **Book Routes** – Add, Update, Delete, Get All/Get One  
- 📦 **Order Routes** – Place, View, Manage Orders  
- 📝 **Review Routes** – Add, Edit, Delete Reviews  
- 👤 **User Routes** – Register, Login, Profile, Logout, forgot password, update role
- ☁️ **Cloudinary + Multer** – For book image uploads
- 🧪 Tested with Postman

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/bookbazaar.git
cd bookbazaar
npm install
npm run start
```
---
env

PORT=  
MONGODB_URI=mongodb+srv://your-db  
JWT_SECRET=your_jwt_secret  
CLOUDINARY_CLOUD_NAME=your_cloud_name  
CLOUDINARY_API_KEY=your_key  
CLOUDINARY_API_SECRET=your_secret  


