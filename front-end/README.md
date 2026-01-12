# AI Career Path Advisor - Frontend

A React + TypeScript frontend application for the AI Career Path Advisor system designed for Pakistani students. This application provides personalized career recommendations based on an AI-powered quiz.

## Features

- User authentication (Login/Register)
- Dynamic career assessment quiz
- AI-generated career recommendations
- Degree program suggestions
- HEC-recognized university recommendations
- Clean, professional UI with Tailwind CSS

## Tech Stack

- React 18
- TypeScript
- Vite
- Axios
- React Router DOM
- Tailwind CSS
- Lucide React (icons)

## Project Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx       # Route protection component
├── context/
│   └── AuthContext.tsx          # Authentication state management
├── pages/
│   ├── LoginPage.tsx            # Login/Register page
│   ├── Dashboard.tsx            # Main dashboard
│   ├── QuizPage.tsx             # Career quiz page
│   └── RecommendationPage.tsx   # Recommendations display
├── services/
│   └── api.ts                   # API service layer
├── App.tsx                      # Main app with routing
└── main.tsx                     # App entry point
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Backend URL

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
```

Replace `http://localhost:8000` with your FastAPI backend URL.

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Backend API Endpoints

The frontend expects the following API endpoints from the FastAPI backend:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Quiz
- `GET /api/quiz/questions` - Fetch quiz questions
- `POST /api/quiz/submit` - Submit quiz answers

### Recommendations
- `GET /api/recommendations` - Get AI-generated career recommendations

## Usage Flow

1. **Login/Register**: Users start by creating an account or logging in
2. **Dashboard**: After authentication, users see the main dashboard with two options
3. **Take Quiz**: Users answer dynamically loaded questions about their interests and skills
4. **View Recommendations**: After completing the quiz, users receive:
   - Recommended career path
   - Confidence score
   - Relevant degree programs
   - List of HEC-recognized universities in Pakistan
   - Explanation for the recommendation

## Key Features

### Authentication
- JWT token-based authentication
- Tokens stored in localStorage
- Protected routes for authenticated users only

### Dynamic Quiz
- Questions fetched from backend (not hardcoded)
- Radio button interface for easy selection
- Form validation before submission

### Recommendations
- Visual confidence score display
- Organized display of degree programs
- List of relevant Pakistani universities
- Clear explanation of recommendation reasoning

## Notes

- This is a demo application, not intended for production use
- All data (questions, recommendations, universities) comes from the backend API
- The UI is designed to be clean, professional, and user-friendly
- Responsive design works on desktop and mobile devices

## Development

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

## Environment Variables

- `VITE_API_URL`: Backend API base URL (default: `http://localhost:8000`)
