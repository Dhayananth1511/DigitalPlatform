import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Users, BarChart3, Mic, FileText, LogOut, Home } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const studentNavItems = [
    { to: '/student', icon: <Home className="w-5 h-5" />, label: t('nav.home') },
    { to: '/student/lesson/1', icon: <BookOpen className="w-5 h-5" />, label: t('nav.lessons') },
    { to: '/student/quiz/1', icon: <FileText className="w-5 h-5" />, label: t('nav.quizzes') },
    { to: '/student/progress', icon: <BarChart3 className="w-5 h-5" />, label: t('nav.progress') },
    { to: '/student/storyteller', icon: <Mic className="w-5 h-5" />, label: t('nav.storyteller') },
  ];

  const teacherNavItems = [
    { to: '/teacher', icon: <Home className="w-5 h-5" />, label: t('nav.home') },
    { to: '/teacher/lessons', icon: <BookOpen className="w-5 h-5" />, label: t('nav.lessons') },
    { to: '/teacher/quizzes', icon: <FileText className="w-5 h-5" />, label: t('nav.quizzes') },
    { to: '/teacher/reports', icon: <BarChart3 className="w-5 h-5" />, label: t('nav.reports') },
  ];

  const navItems = user?.role === 'student' ? studentNavItems : teacherNavItems;

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">EduConnect</span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  location.pathname === item.to
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                user?.role === 'student' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
              }`}>
                <Users className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-white">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center py-2 px-3 transition-all duration-300 ${
                location.pathname === item.to
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;