import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { P2PProvider } from './contexts/P2PContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/student/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import LessonViewer from './components/student/LessonViewer';
import QuizPage from './components/student/QuizPage';
import ProgressPage from './components/student/ProgressPage';
import AIStoryteller from './components/student/AIStoryteller';
import TeacherLessons from './components/teacher/TeacherLessons';
import TeacherQuizzes from './components/teacher/TeacherQuizzes';
import TeacherReports from './components/teacher/TeacherReports';
import OfflineIndicator from './components/OfflineIndicator';
import P2PConnection from './components/P2PConnection';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <P2PProvider>
            <DataProvider>
              <div className="min-h-screen bg-gray-50">
                <OfflineIndicator isOnline={isOnline} />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/student" element={<StudentDashboard />} />
                  <Route path="/teacher" element={<TeacherDashboard />} />
                  <Route path="/student/lesson/:id" element={<LessonViewer />} />
                  <Route path="/student/quiz/:id" element={<QuizPage />} />
                  <Route path="/student/progress" element={<ProgressPage />} />
                  <Route path="/student/storyteller" element={<AIStoryteller />} />
                  <Route path="/teacher/lessons" element={<TeacherLessons />} />
                  <Route path="/teacher/quizzes" element={<TeacherQuizzes />} />
                  <Route path="/teacher/reports" element={<TeacherReports />} />
                </Routes>
                <P2PConnection />
              </div>
            </DataProvider>
          </P2PProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;