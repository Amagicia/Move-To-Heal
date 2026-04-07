# 🍃 Alice Exam Proctor — AI-Powered Online Proctoring System

A modern exam proctoring platform with real-time AI monitoring, violation detection, and a clean responsive UI. Built with React + Django.

🌐 **Live Demo:** [https://alice-exam-proctor01.vercel.app](https://alice-exam-proctor01.vercel.app)  
⚙️ **Backend API:** [https://alice-exam-proctor.onrender.com](https://alice-exam-proctor.onrender.com)

---

## ✨ Features

- **Role-based Auth** — Student, Teacher, and Admin portals
- **Google OAuth** — Sign in / Register with Google
- **AI Proctoring** — Real-time face detection, gaze tracking, head pose analysis
- **Multi-Face Detection** — Flags multiple people in webcam feed
- **Live Monitoring** — WebSocket-based real-time teacher dashboard
- **Alice AI Assistant** — Built-in Gemini-powered chatbot
- **Quiz Management** — Create, manage, and conduct online exams
- **Violation Logging** — Full audit trail stored in MongoDB
- **Responsive UI** — Works on all devices
- **Dynamic Avatars** — DiceBear-powered unique user avatars

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router, Axios |
| Backend | Django 4.2, Django REST Framework, Django Channels |
| Database | MongoDB (PyMongo) |
| Auth | JWT + Google OAuth |
| AI/ML | face-api.js, OpenCV.js, Gemini AI |
| Real-time | WebSockets via Django Channels + Redis |
| Deployment | Vercel (frontend), Render (backend) |

---

## � Local Setup

### Backend
```bash
cd django_backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env       # fill in your values
python init_database.py
python create_sample_data.py
daphne -b 0.0.0.0 -p 8000 exam_proctoring.asgi:application
```

### Frontend
```bash
npm install
npm run dev
```

### Environment Variables

**Frontend (`.env.local`)**
```
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Backend (`django_backend/.env`)**
```
SECRET_KEY=your_secret_key
DEBUG=True
MONGODB_URI=your_mongodb_uri
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 🎨 Avatar System

Alice uses [DiceBear](https://dicebear.com) to generate unique, consistent avatars for each user based on their username or email. No image uploads needed!

### Features
- **10+ Avatar Styles** — From professional to playful
- **Consistent Generation** — Same username = same avatar
- **Zero Storage** — Generated via API on-the-fly
- **Fallback Support** — Shows initials if API fails
- **Customizable** — Size, border, style options

### Usage Example
```jsx
import UserAvatar from './components/common/UserAvatar';
import { AVATAR_STYLES } from './utils/avatarGenerator';

<UserAvatar 
  user={user} 
  size={64} 
  style={AVATAR_STYLES.INITIALS}
  showBorder={true}
/>
```

### Available Styles
- `INITIALS` — Text-based (default)
- `LORELEI` — Illustrated characters
- `AVATAAARS` — Cartoon style
- `BOTTTS` — Robots
- `PIXEL_ART` — 8-bit retro
- `ADVENTURER` — Adventure characters
- And more...

Visit `/avatar-showcase` (when implemented in routes) to see all styles in action!

---

## 🎮 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Student | student1@example.com | password123 |
| Teacher | teacher1@example.com | password123 |

Or just use **Continue with Google** on the auth page.

---

## 👤 Author

**Aditya Singh Rajput**  
📧 opg21139@gmail.com

---

Made with ❤️ by the Alice Team
