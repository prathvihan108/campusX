# **CampusX - The Social Hub of CMRIT** 🚀 _(Building in Progress)_

**CampusX** is a dynamic and interactive platform designed exclusively for the **CMRIT community**. Whether you're a **student, faculty member, or part of a campus organization**, CampusX brings everyone together to **share updates, discuss topics, and stay informed** about everything happening on campus.

## **Key Features**

### 📢 Campus Feed

Stay updated with the latest news, announcements, and trending discussions across the campus.

### 🎯 Category-Based Posts

Engage in discussions across multiple categories, such as:

- **General** – Generalised posts.
- **VTU Exams** – Stay informed about exam schedules, tips, and results.
- **Placements** – Share and find job opportunities, placement experiences, and company insights.
- **College Clubs** – Connect with club members, plan events, and grow your network.
- **Lost & Found** – Report lost or found items within the campus.
- **Competitions & Events** – Promote and participate in campus competitions, fests, and workshops.

### 💬 Interactive Engagement

Like, comment, share, and bookmark posts to interact with the CMRIT community.

### 🔐 Secure & Private

Built with privacy and security in mind, ensuring a safe space for open discussions.

## **Tech Stack**

CampusX is powered by a modern web technology stack:

- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose ORM
- **Authentication:** JWT-based secure login
- **Storage:** Cloudinary for image and media uploads
- **File Handling:** Multer for handling file uploads
- **AI Features:** Machine learning for personalized post recommendations _(Not yet implemented)_

# 🚀 **Optimizing CampusX Performance with Redis**(On Going)

CampusX leverages **Redis** to improve app performance by caching frequently accessed data and using queues for background tasks. WebSockets are used to notify the frontend in real time.

## **⚡ Caching with Redis for Faster API Responses**

Caching helps reduce the load on the database by storing frequently accessed data in memory. In CampusX, Redis caching is used for:

- **User Profiles:** When a user profile is requested, it is first checked in Redis. If found, it is returned instantly; otherwise, it is fetched from the database and stored in Redis for future requests.
- **Recent Posts & Comments:** Instead of querying the database every time, recent posts and comments are cached in Redis for quick retrieval, reducing query times.

This approach significantly improves API response times and enhances user experience.

---

## 🚫 **Rate Limiting with Redis** to prevent spam in posts

## **📡 Real-Time Updates Using WebSockets**

WebSockets are used to send real-time updates to the frontend for various actions. In CampusX, WebSockets notify users about:

Important events like comments, likes, or mentions are delivered in real time using WebSockets.

This ensures users stay updated without needing to refresh the page.

---

📌 Visit the [README.md](backend/README.md) in `/backend` for the backend architecture.

## **Future Plans**

### 🔥 Trending & Personalized Recommendations

See what’s popular on campus and get ML-Based post recommendations tailored to your interests.
.
