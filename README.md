# 🤖 CreataAI - AI SaaS Platform (PERN Stack)

A **full-stack AI SaaS Platform** built with the **PERN stack (PostgreSQL, Express.js, React.js, Node.js)** powered by **Google Gemini AI** and **Stability AI**.  
This platform allows **free users** to generate articles and blog titles, while **premium users** unlock advanced AI tools including image generation, background/object removal, and resume review. A **community feed** lets users share and like AI-generated images.

---

<img width="1342" height="622" alt="creata-ai-1" src="https://github.com/user-attachments/assets/cd29da61-d585-4f37-a934-c0912d14daed" />

<img width="1328" height="633" alt="creata ai-2" src="https://github.com/user-attachments/assets/3192ea8a-e114-42cc-8377-3f3041e3326f" />

---

## 🚀 Features

### 👤 Free User
- Generate AI-powered articles on any topic.
- Generate creative blog title suggestions.
- Browse and like images on the community feed.
- Secure sign-up/sign-in via **Clerk authentication**.

### 👑 Premium User (Subscription Plan)
- Everything in free plan plus:
- **AI Image Generation** — generate images from text prompts.
- **Background Removal** — remove image backgrounds instantly.
- **Object Removal** — remove specific objects from images.
- **Resume Review** — get detailed AI-powered resume feedback.
- Upgrade to premium via **Clerk subscription plan**.

### 🌐 Community Feed
- Publish AI-generated images to the community.
- All users can browse and like shared images.
- Images stored and served via **Cloudinary**.

---

## 🛠️ Tech Stack

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

- **Frontend:** React.js, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Neon)
- **Authentication & Subscription:** Clerk
- **AI APIs:** Google Gemini 2.5 Flash, Stability AI
- **Image Processing:** Cloudinary
- **Deployment:** Vercel (Frontend + Backend)

---

## 🎯 AI Tools Overview

| Tool | Access | Powered By |
|---|---|---|
| Article Writing | Free | Gemini |
| Blog Title Generator | Free | Gemini |
| Image Generation | Premium | Gemini |
| Background Removal | Premium | Gemini |
| Object Removal | Premium | Gemini |
| Resume Review | Premium | Gemini |

---

## 🔐 Authentication Flow

- Sign up / Sign in via **Clerk**
- Premium plan upgrade via **Clerk subscription**
- Role-based access — free vs premium features controlled server-side

---

## 👨‍💻 Author

Umair Waheed  
📧 [Email](mailto:umairmughal78601@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/umair-wahed1/)  
🌐 [Live Demo](https://creata-ai-nine.vercel.app/)
