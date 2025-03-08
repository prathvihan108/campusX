# **CampusX Backend - Powering the Social Hub of CMRIT** 🚀

This is the backend for **CampusX**, a social platform for the **CMRIT community**. It handles **user authentication, posts, comments, notifications, AI-powered recommendations, and real-time chat**.

---

## **🚀 Tech Stack**

CampusX backend is built with:

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database & ORM
- **JWT Authentication** - Secure login system
- **Cloudinary** - Image storage
- **Multer** - File handling middleware
- **Redis** - Caching, rate limiting, and session management
- **WebSockets (Socket.io)** - Real-time chat and notifications

---

## **🛠️ API Endpoints**

### 🔑 **Authentication**

- `POST /auth/register` - Register a new user

  - **Body (JSON or Form-Data):**  
    | Key | Type | Description |
    |----------|---------|----------------------|
    | name | String | User's full name |
    | email | String | User's email address |
    | password | String | User's password |

- `POST /auth/login` - Login with email & password
  - **Body (JSON or Form-Data):**  
    | Key | Type | Description |
    |---------|-------|--------------------|
    | email | String | Registered email |
    | password | String | User's password |

### 📝 **Posts**

- `POST /posts` - Create a new post

  - **Body (multipart/form-data):**  
    | Key | Type | Description |
    |----------|--------|--------------------------|
    | title | String | Title of the post |
    | content | String | Post content |
    | tags | String | Comma-separated tags (optional) |
    | image | File | (Optional) Post image |

  **Example in Postman:**

  - Select **Body** → **form-data**
  - Add keys: `title`, `content`, `tags`, `image`
  - Set `image` type to **File** and upload an image

- `PUT /posts/:id` - Update a post
  - **Body (multipart/form-data):**  
    | Key | Type | Description |
    |---------|-------|-----------------------|
    | title | String | (Optional) New title |
    | content | String | (Optional) New content |
    | image | File | (Optional) New image |

This makes it clear for API users how to send **multipart/form-data** in Postman. 🚀

### 💬 **Comments**

- `POST /posts/:id/comments` - Add a comment to a post
- `GET /posts/:id/comments` - Get comments for a post

### 🔔 **Notifications**

- `GET /notifications` - Fetch notifications for a user

### 🔥 **Trending & AI Recommendations**

- `GET /posts/trending` - Fetch trending posts
- `GET /posts/recommendations` - AI-based personalized recommendations

### 📦 **File Uploads**

- `POST /upload` - Upload images (Cloudinary + Multer)

### 💬 **Real-Time Chat (WebSockets)**

- Connect to `ws://server/chat` for real-time messaging

---

## **⚙️ Installation & Setup**

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/your-repo/campusx-backend.git
cd campusx-backend
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Configure Environment Variables**

Create a `.env` file and add:

```ini
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CLOUDINARY_URL=your-cloudinary-url
REDIS_URL=your-redis-url
```

### **4️⃣ Start the Server**

```sh
npm start
```

---

## **⚡ Redis Integration (Caching & Rate Limiting)**

- **Post Caching:** Frequently accessed posts are stored in Redis for faster retrieval.
- **Rate Limiting:** Prevent spam by limiting user actions (e.g., max 5 posts per minute).
- **Trending Posts:** Store trending posts in Redis and refresh periodically.

### **Example: Rate Limiting Rule**

- Max **5 posts per minute** per user
- Max **10 comments per minute** per user

---

## **🛠️ Future Plans**

🚀 Mobile app API support  
🤖 AI-powered chatbot for quick queries  
⚡ Enhanced caching for AI-based recommendations  
💬 End-to-end encrypted chat system  
📊 Advanced analytics for post engagement

---

## **📌 Contributors**

- [Your Name](https://github.com/your-profile)
- [Other Contributors]

🚀 **Built for the CMRIT community!**
