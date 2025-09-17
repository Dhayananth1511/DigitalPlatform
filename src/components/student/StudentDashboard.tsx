import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useP2P } from '../../contexts/P2PContext';
import { BookOpen, Users, BarChart3, Mic, Trophy, Clock, Target, Star } from 'lucide-react';
import Navigation from '../Navigation';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { lessons, getStudentStats } = useData();
  const { t } = useLanguage();
  const { connectedPeers, messages } = useP2P();
  
  const stats = getStudentStats();
  const recentLessons = lessons.slice(0, 3);

  const quickActions = [
    {
      to: '/student/lesson/1',
      icon: <BookOpen className="w-8 h-8" />,
      title: t('nav.lessons'),
      description: 'Continue your learning journey',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      to: '/student/quiz/1',
      icon: <Target className="w-8 h-8" />,
      title: t('nav.quizzes'),
      description: 'Test your knowledge',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      to: '/student/progress',
      icon: <BarChart3 className="w-8 h-8" />,
      title: t('nav.progress'),
      description: 'Track your achievements',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      to: '/student/storyteller',
      icon: <Mic className="w-8 h-8" />,
      title: t('nav.storyteller'),
      description: 'Listen to AI stories',
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  // Get recent peer messages
  const recentMessages = messages.slice(-3);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('student.welcome')} {user?.name}
          </h1>
          <p className="text-gray-600">
            Ready to continue your learning journey today?
          </p>
          
          {/* P2P Status */}
          {connectedPeers.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                🌐 Connected with {connectedPeers.length} peer{connectedPeers.length !== 1 ? 's' : ''}: {' '}
                {connectedPeers.map(p => p.name).join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('student.lessons_completed')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedLessons}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('student.quiz_score')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('student.study_streak')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.studyStreak} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Study Time</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudyTime}m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.to}
                className={`${action.color} text-white rounded-xl p-6 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
              >
                <div className="flex flex-col items-center text-center">
                  {action.icon}
                  <h3 className="text-lg font-semibold mt-3 mb-1">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Lessons */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Lessons */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Continue Learning</h2>
            <div className="space-y-4">
              {recentLessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  to={`/student/lesson/${lesson.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                      <p className="text-sm text-gray-600">{lesson.subject} • {lesson.duration} minutes</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lesson.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        lesson.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Peer Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Peer Activity</h3>
              {recentMessages.length > 0 ? (
                <div className="space-y-3">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{message.senderName}</p>
                      <p className="text-sm text-gray-600">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No recent peer activity</p>
              )}
            </div>

            {/* Quick AI Story */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">AI Storyteller</h3>
              <p className="text-sm opacity-90 mb-4">
                Create personalized stories with AI and share them with your peers!
              </p>
              <Link
                to="/student/storyteller"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-all inline-block"
              >
                Start Creating
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;