import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft, Play, Pause, Volume2, BookOpen, Clock, CheckCircle } from 'lucide-react';
import Navigation from '../Navigation';

const LessonViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lessons, updateProgress } = useData();
  const { t } = useLanguage();
  
  const lesson = lessons.find(l => l.id === id);
  const [startTime] = useState(Date.now());
  const [completed, setCompleted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    if (!lesson) {
      navigate('/student');
    }
  }, [lesson, navigate]);

  const handleComplete = () => {
    if (lesson) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60); // minutes
      updateProgress({
        lessonId: lesson.id,
        completed: true,
        timeSpent,
        completedAt: new Date(),
      });
      setCompleted(true);
    }
  };

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying);
    // In a real app, this would control text-to-speech
  };

  if (!lesson) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/student')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{lesson.duration} minutes</span>
            </div>
            <button
              onClick={toggleAudio}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                audioPlaying
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span className="text-sm">
                {audioPlaying ? 'Stop Audio' : 'Listen'}
              </span>
            </button>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Video/Image Placeholder */}
          <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
            <div className="text-center text-white">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <p className="text-lg">Video content would be displayed here</p>
              <p className="text-sm opacity-80">Interactive multimedia lesson</p>
            </div>
          </div>

          {/* Lesson Details */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{lesson.subject}</span>
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lesson.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    lesson.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {lesson.difficulty}
                  </span>
                </div>
              </div>
              
              {completed && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-medium">Completed!</span>
                </div>
              )}
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed">{lesson.description}</p>
              <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Lesson Content</h3>
                <p className="text-gray-700">{lesson.content}</p>
                
                {/* Interactive Elements */}
                <div className="mt-6 space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Key Point</h4>
                    <p className="text-blue-800">Remember to practice the concepts regularly for better understanding.</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">🎯 Learning Objective</h4>
                    <p className="text-green-800">By the end of this lesson, you will be able to apply these concepts confidently.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {!completed && (
                <button
                  onClick={handleComplete}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Mark as Complete
                </button>
              )}
              
              <button
                onClick={() => navigate(`/student/quiz/${lesson.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Take Quiz
              </button>
              
              <button
                onClick={() => navigate('/student/storyteller')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Listen to Story
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonViewer;