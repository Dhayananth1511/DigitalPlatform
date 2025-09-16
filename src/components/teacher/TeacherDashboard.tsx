import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { BookOpen, Users, BarChart3, FileText, Plus, TrendingUp, Clock, Award } from 'lucide-react';
import Navigation from '../Navigation';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { lessons, progress } = useData();
  const { t } = useLanguage();

  const teacherStats = {
    totalStudents: 45,
    lessonsCreated: lessons.length,
    avgPerformance: 87,
    activeToday: 32,
  };

  const quickActions = [
    {
      to: '/teacher/lessons',
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Manage Lessons',
      description: 'Create and edit lessons',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      to: '/teacher/quizzes',
      icon: <FileText className="w-6 h-6" />,
      title: 'Create Quiz',
      description: 'Add new assessments',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      to: '/teacher/reports',
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'View Reports',
      description: 'Student progress analytics',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  const recentActivity = [
    { student: 'Preet Singh', action: 'Completed Math Lesson', time: '2 hours ago' },
    { student: 'Simran Kaur', action: 'Scored 95% in Science Quiz', time: '3 hours ago' },
    { student: 'Ravi Kumar', action: 'Started Digital Literacy Module', time: '5 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('teacher.welcome')} {user?.name}
          </h1>
          <p className="text-gray-600">
            Monitor student progress and manage your digital classroom
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('teacher.total_students')}</p>
                <p className="text-2xl font-bold text-gray-900">{teacherStats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('teacher.lessons_created')}</p>
                <p className="text-2xl font-bold text-gray-900">{teacherStats.lessonsCreated}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('teacher.avg_performance')}</p>
                <p className="text-2xl font-bold text-gray-900">{teacherStats.avgPerformance}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Today</p>
                <p className="text-2xl font-bold text-gray-900">{teacherStats.activeToday}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.to}
                  className={`${action.color} text-white rounded-xl p-4 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl block`}
                >
                  <div className="flex items-center space-x-3">
                    {action.icon}
                    <div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('teacher.recent_activity')}</h2>
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Award className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.student}</p>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                      </div>
                      <div className="text-sm text-gray-500">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-white rounded-xl shadow-lg mt-6 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance Overview</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Performance analytics will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;