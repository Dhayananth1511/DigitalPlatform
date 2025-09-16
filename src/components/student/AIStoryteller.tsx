import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft, Mic, Play, Pause, Volume2, BookOpen, Star } from 'lucide-react';
import Navigation from '../Navigation';

const AIStoryteller: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const stories = {
    en: [
      {
        id: '1',
        title: 'The Brave Little Farmer',
        description: 'A story about courage and helping others in a Punjabi village',
        duration: '5 minutes',
        category: 'Values',
      },
      {
        id: '2',
        title: 'The Magic of Mathematics',
        description: 'Discover how numbers help solve everyday problems',
        duration: '4 minutes',
        category: 'Education',
      },
      {
        id: '3',
        title: 'The Festival of Colors',
        description: 'Learn about Holi and its significance in Indian culture',
        duration: '6 minutes',
        category: 'Culture',
      },
    ],
    hi: [
      {
        id: '4',
        title: 'छोटे किसान की बहादुरी',
        description: 'एक पंजाबी गांव में साहस और दूसरों की मदद की कहानी',
        duration: '5 मिनट',
        category: 'मूल्य',
      },
      {
        id: '5',
        title: 'गणित का जादू',
        description: 'जानें कि संख्याएं रोजमर्रा की समस्याओं को हल करने में कैसे मदद करती हैं',
        duration: '4 मिनट',
        category: 'शिक्षा',
      },
    ],
    pa: [
      {
        id: '6',
        title: 'ਬਹਾਦਰ ਛੋਟਾ ਕਿਸਾਨ',
        description: 'ਇੱਕ ਪੰਜਾਬੀ ਪਿੰਡ ਵਿੱਚ ਹਿੰਮਤ ਅਤੇ ਦੂਜਿਆਂ ਦੀ ਮਦਦ ਦੀ ਕਹਾਣੀ',
        duration: '5 ਮਿੰਟ',
        category: 'ਮੁੱਲ',
      },
      {
        id: '7',
        title: 'ਗਣਿਤ ਦਾ ਜਾਦੂ',
        description: 'ਜਾਣੋ ਕਿ ਸੰਖਿਆਵਾਂ ਰੋਜ਼ਾਨਾ ਸਮੱਸਿਆਵਾਂ ਹੱਲ ਕਰਨ ਵਿੱਚ ਕਿਵੇਂ ਮਦਦ ਕਰਦੀਆਂ ਹਨ',
        duration: '4 ਮਿੰਟ',
        category: 'ਸਿੱਖਿਆ',
      },
    ],
  };

  const currentStories = stories[language] || stories.en;

  const handlePlayStory = (storyId: string) => {
    setSelectedStory(storyId);
    setIsPlaying(true);
    // In a real app, this would trigger text-to-speech API
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/student')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('nav.storyteller')}</h1>
          <p className="text-gray-600">Listen to educational stories in your preferred language</p>
        </div>

        {/* Current Playing */}
        {selectedStory && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentStories.find(s => s.id === selectedStory)?.title}
                </h3>
                <p className="text-gray-600">Now playing in {language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Punjabi'}</p>
              </div>
              <button
                onClick={togglePlayback}
                className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isPlaying
                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>
            
            {isPlaying && (
              <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Volume2 className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">AI Voice Narration Active</span>
                </div>
                <div className="bg-orange-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full w-1/3 transition-all duration-1000"></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Story Categories */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stories List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Stories</h2>
            <div className="space-y-4">
              {currentStories.map((story) => (
                <div
                  key={story.id}
                  className={`bg-white rounded-xl p-6 shadow-lg transition-all duration-300 cursor-pointer ${
                    selectedStory === story.id
                      ? 'ring-2 ring-orange-500 bg-orange-50'
                      : 'hover:shadow-xl hover:scale-105'
                  }`}
                  onClick={() => handlePlayStory(story.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.title}</h3>
                      <p className="text-gray-600 mb-4">{story.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center space-x-1 text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{story.duration}</span>
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {story.category}
                        </span>
                      </div>
                    </div>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full transition-all">
                      <Play className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features & Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mic className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">Natural voice synthesis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Educational content</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-gray-700">Cultural stories</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Coming Soon!</h3>
              <p className="text-sm opacity-90 mb-4">
                Interactive storytelling where you can choose the story direction and characters!
              </p>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIStoryteller;