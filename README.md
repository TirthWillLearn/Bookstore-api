# 📚 BookStore REST API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express)
![MySQL](https://img.shields.io/badge/MySQL-8-blue?logo=mysql)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Multer](https://img.shields.io/badge/Uploads-Multer-informational)
![License](https://img.shields.io/badge/License-MIT-success)


A **backend RESTful API** for managing books, users, and ratings.  
Built with **Node.js, Express.js, MySQL**, and secured using **JWT authentication, bcrypt, and role-based access control**.  
Includes features like **CRUD operations, file uploads, ratings system, search, filtering, and pagination**.  

## 📸 Screenshots / Demo

### Register User — POST `/api/auth/register`

**Validations (express-validator)**
- `name` → required (cannot be empty)  
- `email` → required, must be a valid email format  
- `password` → required, minimum 6 characters  
- `role` → optional (defaults to "user" if not provided)  

**Request Body**
```json
{
  "name": "Tirth Patel",
  "email": "example0@example.com",
  "password": "123456",
  "role": "admin"
}
```
Response (201 Created)

```json
{
  "message": "User registered successfully"
}
```

---

## 🚀 Features
- **Authentication & Authorization**  
  - Secure login/signup using **JWT** and **bcrypt password hashing**  
  - **Role-based access control** for users and admins  

- **Books Management**  
  - **CRUD operations** for books (create, update, delete, fetch)  
  - Advanced **search, filtering, and pagination**  

- **Ratings System**  
  - Users can add **ratings & reviews** for books  

- **File Uploads**  
  - Upload book cover images with **Multer**  

- **Architecture**  
  - Built with **MVC pattern**  
  - **Middleware validation** and **centralized error handling**  

---

## 🛠 Tech Stack
- **Backend**: Node.js, Express.js  
- **Database**: MySQL  
- **Authentication & Security**: JWT, bcrypt, Helmet, CORS  
- **File Uploads**: Multer  
- **Architecture**: MVC  

---

## 📂 Project Structure
```
Bookstore-api-main/
│── server.js # Entry point
│── config/
│ └── db.js # Database connection
│── controllers/ # Controllers (Auth, Books, Ratings)
│── middleware/ # Auth & Upload middleware
│── routes/ # API Routes
│── experimental_features/ # AI & Payment (in progress)
```

---

## ⚡ Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/bookstore-api.git
cd bookstore-api
```
### 2️⃣ Install dependencies
```bash

npm install

```
### 3️⃣ Set up environment variables  

Create a `.env` file in the root directory:  

```ini
PORT=5000
DB_HOST=localhost
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=bookstore
JWT_SECRET=your-secret-key
```

### 4️⃣ Run the server
```bash
npm start
```

## 🔑 API Endpoints

### 🔐 Auth Routes
- `POST /api/auth/register` → Register a new user  
- `POST /api/auth/login` → Login existing user  

### 📖 Book Routes
- `GET /api/book/get` → Get books (requires authentication, with validation on title & author)  
- `GET /api/book` → Get paginated & filtered book list (public)  
- `GET /api/book/:id` → Get a book by its ID  
- `POST /api/book/add` → Add a new book (Admin only)  
- `POST /api/book/upload` → Upload book cover image (authenticated users only)  

### ⭐ Rating Routes
- `POST /api/rating/:bookId` → Rate a book (only logged-in users)  
- `GET /api/rating/book/:bookId` → Get all ratings for a specific book  

---

## 📌 Experimental Features
- **AI Controller** → early integration with AI for book-related features  
- **Payment Controller** → payment API integration (work in progress)  

---

## 📦 Deployment
- Can be deployed on **Render, Railway, or Vercel**  
- MySQL database can be hosted on **Railway / PlanetScale / AWS RDS**  

---

## 👨‍💻 Author
**Tirth Patel**

[![GitHub](https://img.shields.io/badge/GitHub-000?logo=github&logoColor=white)](https://github.com/TirthWillLearn)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/tirth-k-patel/)

