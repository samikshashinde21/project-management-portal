# Project Management Portal

## Setup Instructions

Follow the steps below to run the project locally.

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git
- MongoDB Atlas account or local MongoDB setup

## 1. Clone the Repository

```bash
git clone https://github.com/samikshashinde21/project-management-portal.git
cd project-management-portal
```

## 2. Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install backend dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm run server
```

The backend will run on:

```txt
http://localhost:5000
```

## 3. Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on:

```txt
http://localhost:5173
```

## 4. Run the Full Project

Keep both servers running:

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

Open the frontend URL in your browser:

```txt
http://localhost:5173
```

## Environment Variables

The backend requires the following `.env` variables:

| Variable | Description |
| --- | --- |
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used for JWT token generation |

Example:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management-portal
JWT_SECRET=mysecretkey
```
