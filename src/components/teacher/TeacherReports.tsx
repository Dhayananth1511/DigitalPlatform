import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft, BarChart3, Users, TrendingUp, Download, Calendar, Filter } from 'lucide-react';
import Navigation from '../Navigation';

const TeacherReports: React.FC = () => {
  const navigate = useNavigate();
  const { lessons, progress } = useData();
  const { t } = useLanguage();

  const studentPerformance = [
    { name: 'Preet Singh', class: '8A', lessonsCompleted: 12, avgScore: 89, lastActive: '2 hours ago' },
    { name: 'Simran Kaur', class: '8A', lessonsCompleted: 15, avgScore: 94, lastActive: '1 hour ago' },
    { name: 'Ravi Kumar', class: '8B', lessonsCompleted: 8, avgScore: 76, lastActive: '5 hours ago' },
    { name: 'Priya Sharma', class: '8B', lessonsCompleted: 18, avgScore: 92, lastActive: '30 minutes ago' },
    { name: 'Arjun Singh', class: '8A', lessonsCompleted: 10, avgScore: 82, lastActive: '3 hours ago' },
  ];

  const subjectStats = [
    { subject: 'Mathematics', students: 25, avgScore: 85, completed: 78 },
    { subject: 'Science', students: 30, avgScore: 88, completed: 82 },
    { subject: 'English', students: 28, avgScore: 90, completed: 85 },
    { subject: 'Hindi', students: 32, avgScore: 87, completed: 80 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/teacher')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Reports & Analytics</h1>
          <p className="text-gray-600">Monitor student progress and performance across all subjects</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">92%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">234h</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Student Performance */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Student Performance</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Student</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Class</th>
                      <th className="text-center py-3 text-sm font-medium text-gray-600">Lessons</th>
                      <th className="text-center py-3 text-sm font-medium text-gray-600">Avg Score</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentPerformance.map((student, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-gray-600">{student.class}</td>
                        <td className="py-4 text-center text-gray-900">{student.lessonsCompleted}</td>
                        <td className="py-4 text-center">
                          <span className={`font-medium ${
                            student.avgScore >= 90 ? 'text-green-600' :
                            student.avgScore >= 80 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {student.avgScore}%
                          </span>
                        </td>
                        <td className="py-4 text-gray-600 text-sm">{student.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Subject Performance</h2>
              <div className="space-y-4">
                {subjectStats.map((subject, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{subject.subject}</h3>
                      <span className="text-sm text-gray-600">{subject.students} students</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Avg Score: {subject.avgScore}%</span>
                      <span>Completion: {subject.completed}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${subject.completed}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-all">
                  <span className="text-sm font-medium text-gray-900">Generate Weekly Report</span>
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-all">
                  <span className="text-sm font-medium text-gray-900">Export Student Data</span>
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-all">
                  <span className="text-sm font-medium text-gray-900">Send Progress Alerts</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherReports;