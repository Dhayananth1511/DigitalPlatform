import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'pa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.lessons': 'Lessons',
    'nav.quizzes': 'Quizzes',
    'nav.progress': 'Progress',
    'nav.storyteller': 'AI Storyteller',
    'nav.reports': 'Reports',
    'nav.logout': 'Logout',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.success': 'Success!',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.continue': 'Continue',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.finish': 'Finish',
    
    // Landing Page
    'landing.title': 'Digital Learning for Rural Punjab',
    'landing.subtitle': 'Empowering students in Nabha with offline-first digital education',
    'landing.student': 'Student Login',
    'landing.teacher': 'Teacher Login',
    'landing.features.offline': 'Works Offline',
    'landing.features.multilingual': 'Multi-language Support',
    'landing.features.interactive': 'Interactive Learning',
    'landing.features.ai': 'AI Storytelling',
    
    // Student Dashboard
    'student.welcome': 'Welcome, Student!',
    'student.continue_learning': 'Continue Learning',
    'student.lessons_completed': 'Lessons Completed',
    'student.quiz_score': 'Average Quiz Score',
    'student.study_streak': 'Study Streak',
    
    // Teacher Dashboard
    'teacher.welcome': 'Welcome, Teacher!',
    'teacher.total_students': 'Total Students',
    'teacher.lessons_created': 'Lessons Created',
    'teacher.avg_performance': 'Average Performance',
    'teacher.recent_activity': 'Recent Activity',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.lessons': 'पाठ',
    'nav.quizzes': 'प्रश्नोत्तरी',
    'nav.progress': 'प्रगति',
    'nav.storyteller': 'एआई कथाकार',
    'nav.reports': 'रिपोर्ट',
    'nav.logout': 'लॉगआउट',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि हुई',
    'common.success': 'सफलता!',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
    'common.continue': 'जारी रखें',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.finish': 'समाप्त',
    
    // Landing Page
    'landing.title': 'ग्रामीण पंजाब के लिए डिजिटल शिक्षा',
    'landing.subtitle': 'नाभा के छात्रों को ऑफ़लाइन-फर्स्ट डिजिटल शिक्षा के साथ सशक्त बनाना',
    'landing.student': 'छात्र लॉगिन',
    'landing.teacher': 'शिक्षक लॉगिन',
    'landing.features.offline': 'ऑफ़लाइन काम करता है',
    'landing.features.multilingual': 'बहुभाषी सपोर्ट',
    'landing.features.interactive': 'इंटरैक्टिव सीखना',
    'landing.features.ai': 'एआई कहानी सुनाना',
    
    // Student Dashboard
    'student.welcome': 'स्वागत है, छात्र!',
    'student.continue_learning': 'सीखना जारी रखें',
    'student.lessons_completed': 'पूरे किए गए पाठ',
    'student.quiz_score': 'औसत प्रश्नोत्तरी स्कोर',
    'student.study_streak': 'अध्ययन की लगातार दिन',
    
    // Teacher Dashboard
    'teacher.welcome': 'स्वागत है, शिक्षक!',
    'teacher.total_students': 'कुल छात्र',
    'teacher.lessons_created': 'बनाए गए पाठ',
    'teacher.avg_performance': 'औसत प्रदर्शन',
    'teacher.recent_activity': 'हाल की गतिविधि',
  },
  pa: {
    // Navigation
    'nav.home': 'ਘਰ',
    'nav.lessons': 'ਪਾਠ',
    'nav.quizzes': 'ਪ੍ਰਸ਼ਨ-ਉੱਤਰ',
    'nav.progress': 'ਤਰੱਕੀ',
    'nav.storyteller': 'ਏਆਈ ਕਹਾਣੀਕਾਰ',
    'nav.reports': 'ਰਿਪੋਰਟਾਂ',
    'nav.logout': 'ਲਾਗਆਊਟ',
    
    // Common
    'common.loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    'common.error': 'ਗਲਤੀ ਹੋਈ',
    'common.success': 'ਸਫਲਤਾ!',
    'common.submit': 'ਜਮ੍ਹਾ ਕਰੋ',
    'common.cancel': 'ਰੱਦ ਕਰੋ',
    'common.continue': 'ਜਾਰੀ ਰੱਖੋ',
    'common.next': 'ਅਗਲਾ',
    'common.previous': 'ਪਿਛਲਾ',
    'common.finish': 'ਸਮਾਪਤ',
    
    // Landing Page
    'landing.title': 'ਪੇਂਡੂ ਪੰਜਾਬ ਲਈ ਡਿਜੀਟਲ ਸਿੱਖਿਆ',
    'landing.subtitle': 'ਨਾਭਾ ਦੇ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਔਫਲਾਈਨ-ਫਰਸਟ ਡਿਜੀਟਲ ਸਿੱਖਿਆ ਨਾਲ ਸਸ਼ਕਤ ਬਣਾਉਣਾ',
    'landing.student': 'ਵਿਦਿਆਰਥੀ ਲਾਗਇਨ',
    'landing.teacher': 'ਅਧਿਆਪਕ ਲਾਗਇਨ',
    'landing.features.offline': 'ਔਫਲਾਈਨ ਕੰਮ ਕਰਦਾ ਹੈ',
    'landing.features.multilingual': 'ਬਹੁ-ਭਾਸ਼ਾ ਸਹਾਇਤਾ',
    'landing.features.interactive': 'ਇੰਟਰਐਕਟਿਵ ਸਿੱਖਣਾ',
    'landing.features.ai': 'ਏਆਈ ਕਹਾਣੀ ਸੁਣਾਉਣਾ',
    
    // Student Dashboard
    'student.welcome': 'ਜੀ ਆਇਆਂ ਨੂੰ, ਵਿਦਿਆਰਥੀ!',
    'student.continue_learning': 'ਸਿੱਖਣਾ ਜਾਰੀ ਰੱਖੋ',
    'student.lessons_completed': 'ਪੂਰੇ ਕੀਤੇ ਪਾਠ',
    'student.quiz_score': 'ਔਸਤ ਪ੍ਰਸ਼ਨ-ਉੱਤਰ ਸਕੋਰ',
    'student.study_streak': 'ਪੜ੍ਹਾਈ ਦੇ ਲਗਾਤਾਰ ਦਿਨ',
    
    // Teacher Dashboard
    'teacher.welcome': 'ਜੀ ਆਇਆਂ ਨੂੰ, ਅਧਿਆਪਕ!',
    'teacher.total_students': 'ਕੁੱਲ ਵਿਦਿਆਰਥੀ',
    'teacher.lessons_created': 'ਬਣਾਏ ਗਏ ਪਾਠ',
    'teacher.avg_performance': 'ਔਸਤ ਪ੍ਰਦਰਸ਼ਨ',
    'teacher.recent_activity': 'ਹਾਲੀਆ ਗਤੀਵਿਧੀ',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};