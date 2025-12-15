# 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Paisley Highland Games - Group M Project

A full-stack web application for managing Highland Games events and competitor registrations, built with the MERN stack.

## 👥 Team Members - Group M

- **Bibika Ghimire** - B00838239
- **Mateusz Nowak** - B00350243
- **Summer Rhoda** - B00477047

## 📋 Project Overview

This application provides a comprehensive platform for managing traditional Scottish Highland Games, featuring event listings, competitor registration tracking, and detailed event information. Built as part of the Group project forInternet Technologies module.

## 🎯 Features

- **Event Management**: Browse all Highland Games events across categories (Heavy, Track, Field, Piping, Dancing)
- **Event Details**: View comprehensive information including descriptions, competitor counts, and registration status
- **Competitor Profiles**: Display registered athletes with their country affiliations and event registrations
- **Responsive Design**: Mobile-friendly interface with Scottish Highland Games themed styling
- **Real-time Data**: Live updates from MongoDB database
- **Progress Tracking**: Visual progress bars showing event registration capacity

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **RESTful API** - API architecture

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Responsive styling

## 📦 Installation & Setup

### Prerequisites
- Node.js (v20.18.0 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/paisley_highland_games
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
PORT=5000
NODE_ENV=development
```

4. Seed the database:
```bash
npm run seed
```

5. Start the backend server:
```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 🗂️ Project Structure
```
paisley-highland-games/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seedData.js        # Database seeding script
│   ├── controllers/
│   │   ├── eventController.js
│   │   └── competitorController.js
│   ├── models/
│   │   ├── Event.js
│   │   └── Competitor.js
│   ├── routes/
│   │   ├── eventRoutes.js
│   │   └── competitorRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Events.tsx
│   │   │   ├── EventDetails.tsx
│   │   │   └── Competitors.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Competitors
- `GET /api/competitors` - Get all competitors
- `GET /api/competitors/:id` - Get single competitor
- `POST /api/competitors` - Create competitor
- `PUT /api/competitors/:id` - Update competitor
- `DELETE /api/competitors/:id` - Delete competitor
- `POST /api/competitors/:id/register/:eventId` - Register for event

## 📸 Screenshots

### Home Page
![Home Page](frontend/src/pages/screenshots/Home%20Page.png)

### Events Page
![Events Page](frontend/src/pages/screenshots/Events%20Page.png)

### Competitors Page
![Competitors Page](frontend/src/pages/screenshots/Competitor%20Page.png)

## 🎓 Module Details

**Module**: COMP10020 - Internet Technologies  
**Institution**: University of the West of Scotland  
**Year**: 2024/2025  
**Group**: Group M

## 📝 License

This project completes the module project.

## 🙏 Acknowledgments

- University of the West of Scotland - Group M
- Traditional Scottish Highland Games culture and heritage

---

**© 2025 Paisley Highland Games - Group M Project**
