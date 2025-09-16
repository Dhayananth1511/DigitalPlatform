import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Lesson {
  id: string;
  title: string;
  subject: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'en' | 'hi' | 'pa';
}

interface Quiz {
  id: string;
  title: string;
  lessonId: string;
  questions: Question[];
  timeLimit: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Progress {
  lessonId: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
  completedAt?: Date;
}

interface DataContextType {
  lessons: Lesson[];
  quizzes: Quiz[];
  progress: Progress[];
  addLesson: (lesson: Omit<Lesson, 'id'>) => void;
  addQuiz: (quiz: Omit<Quiz, 'id'>) => void;
  updateProgress: (progress: Progress) => void;
  getStudentStats: () => {
    completedLessons: number;
    averageScore: number;
    studyStreak: number;
    totalStudyTime: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Basic Mathematics - Addition',
    subject: 'Mathematics',
    description: 'Learn the fundamentals of addition with interactive examples',
    content: 'Addition is one of the four basic operations of arithmetic...',
    duration: 30,
    difficulty: 'easy',
    language: 'en',
  },
  {
    id: '2',
    title: 'पौधों की दुनिया',
    subject: 'Science',
    description: 'पौधों के बारे में जानें और उनकी विविधता समझें',
    content: 'पौधे हमारे पर्यावरण का महत्वपूर्ण हिस्सा हैं...',
    duration: 25,
    difficulty: 'medium',
    language: 'hi',
  },
  {
    id: '3',
    title: 'ਪੰਜਾਬੀ ਸਾਹਿਤ',
    subject: 'Punjabi',
    description: 'ਪੰਜਾਬੀ ਸਾਹਿਤ ਦੇ ਮਹਾਨ ਕਲਾਕਾਰਾਂ ਬਾਰੇ ਜਾਣੋ',
    content: 'ਪੰਜਾਬੀ ਸਾਹਿਤ ਬਹੁਤ ਅਮੀਰ ਅਤੇ ਵਿਭਿੰਨ ਹੈ...',
    duration: 35,
    difficulty: 'medium',
    language: 'pa',
  },
];

const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Addition Quiz',
    lessonId: '1',
    timeLimit: 10,
    questions: [
      {
        id: '1',
        question: 'What is 5 + 3?',
        options: ['6', '7', '8', '9'],
        correctAnswer: 2,
        explanation: '5 + 3 = 8',
      },
      {
        id: '2',
        question: 'What is 12 + 7?',
        options: ['18', '19', '20', '21'],
        correctAnswer: 1,
        explanation: '12 + 7 = 19',
      },
    ],
  },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
  const [progress, setProgress] = useState<Progress[]>(() => {
    const saved = localStorage.getItem('progress');
    return saved ? JSON.parse(saved) : [];
  });

  const addLesson = (lesson: Omit<Lesson, 'id'>) => {
    const newLesson = { ...lesson, id: Date.now().toString() };
    setLessons(prev => [...prev, newLesson]);
  };

  const addQuiz = (quiz: Omit<Quiz, 'id'>) => {
    const newQuiz = { ...quiz, id: Date.now().toString() };
    setQuizzes(prev => [...prev, newQuiz]);
  };

  const updateProgress = (newProgress: Progress) => {
    setProgress(prev => {
      const updated = prev.filter(p => p.lessonId !== newProgress.lessonId);
      const result = [...updated, newProgress];
      localStorage.setItem('progress', JSON.stringify(result));
      return result;
    });
  };

  const getStudentStats = () => {
    const completedLessons = progress.filter(p => p.completed).length;
    const averageScore = progress.length > 0 
      ? progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length 
      : 0;
    const totalStudyTime = progress.reduce((sum, p) => sum + p.timeSpent, 0);
    
    // Mock study streak calculation
    const studyStreak = 5;

    return {
      completedLessons,
      averageScore: Math.round(averageScore),
      studyStreak,
      totalStudyTime: Math.round(totalStudyTime),
    };
  };

  return (
    <DataContext.Provider value={{
      lessons,
      quizzes,
      progress,
      addLesson,
      addQuiz,
      updateProgress,
      getStudentStats,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};