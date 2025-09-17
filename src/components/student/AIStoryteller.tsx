import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft, Mic, Play, Pause, Volume2, BookOpen, Star, Wand2, MessageSquare, Users } from 'lucide-react';
import Navigation from '../Navigation';
import { AIStorytellerEngine, Story, StorySegment } from '../../utils/aiStoryteller';
import { useP2P } from '../../contexts/P2PContext';

const AIStoryteller: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { broadcastMessage, connectedPeers } = useP2P();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [storytellerEngine] = useState(() => new AIStorytellerEngine());
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [currentSegment, setCurrentSegment] = useState<StorySegment | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomStory, setShowCustomStory] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

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
    const story = currentStories.find(s => s.id === storyId);
    if (story) {
      const aiStory: Story = {
        id: story.id,
        title: story.title,
        description: story.description,
        content: `${story.description}. This is an interactive story where you can make choices to guide the adventure.`,
        duration: parseInt(story.duration),
        category: story.category,
        language,
        isInteractive: true,
        choices: [
          { id: '1', text: 'Start the adventure', nextSegment: 'beginning' },
          { id: '2', text: 'Learn about the characters', nextSegment: 'characters' },
        ]
      };
      setCurrentStory(aiStory);
      playStoryWithAI(aiStory);
    }
  };

  const playStoryWithAI = async (story: Story) => {
    setIsPlaying(true);
    try {
      await storytellerEngine.playStory(story, (progress) => {
        setPlaybackProgress(progress);
      });
    } catch (error) {
      console.error('Error playing story:', error);
    } finally {
      setIsPlaying(false);
      setPlaybackProgress(0);
    }
  };

  const generateCustomStory = async () => {
    if (!customPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const story = await storytellerEngine.generateStory(customPrompt, language);
      setCurrentStory(story);
      setCustomPrompt('');
      setShowCustomStory(false);
      
      // Share with connected peers
      if (connectedPeers.length > 0) {
        broadcastMessage(`I just created a new story: "${story.title}"`, 'story-request');
      }
      
      playStoryWithAI(story);
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStoryChoice = (choiceId: string) => {
    const nextSegment = storytellerEngine.makeChoice(choiceId);
    if (nextSegment) {
      setCurrentSegment(nextSegment);
      if (!nextSegment.isEnding) {
        const continueStory: Story = {
          ...currentStory!,
          content: nextSegment.content,
          choices: nextSegment.choices
        };
        playStoryWithAI(continueStory);
      }
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      storytellerEngine.pauseStory();
      setIsPlaying(false);
    } else {
      storytellerEngine.resumeStory();
      setIsPlaying(true);
    }
  };

  const stopPlayback = () => {
    storytellerEngine.stopStory();
    setIsPlaying(false);
    setPlaybackProgress(0);
    setCurrentStory(null);
    setCurrentSegment(null);
    setSelectedStory(null);
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
          
          {/* Connected Peers Info */}
          {connectedPeers.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Connected with {connectedPeers.length} peer{connectedPeers.length !== 1 ? 's' : ''} - 
                  stories will be shared automatically!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Custom Story Generator */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Create Your Own Story!</h2>
              <p className="opacity-90">Tell the AI what kind of story you want to hear</p>
            </div>
            <button
              onClick={() => setShowCustomStory(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2"
            >
              <Wand2 className="w-5 h-5" />
              <span>Create Story</span>
            </button>
          </div>
        </div>

        {/* Custom Story Modal */}
        {showCustomStory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Custom Story</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What should the story be about?
                  </label>
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., a brave farmer, a magical tree, friendship..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={generateCustomStory}
                    disabled={isGenerating || !customPrompt.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>Generate</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowCustomStory(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Playing */}
        {currentStory && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentStory.title}
                </h3>
                <p className="text-gray-600">Now playing in {language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Punjabi'}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={togglePlayback}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isPlaying
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={stopPlayback}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Stop
                </button>
              </div>
            </div>
            
            {(isPlaying || playbackProgress > 0) && (
              <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Volume2 className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">AI Voice Narration Active</span>
                </div>
                <div className="bg-orange-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${playbackProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Interactive Choices */}
            {currentStory.choices && !isPlaying && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-3">What happens next?</h4>
                <div className="space-y-2">
                  {currentStory.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleStoryChoice(choice.id)}
                      className="w-full text-left p-3 bg-white hover:bg-blue-100 border border-blue-200 rounded-lg transition-all"
                    >
                      <span className="text-blue-900">{choice.text}</span>
                    </button>
                  ))}
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
                    currentStory?.id === story.id
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
                          <BookOpen className="w-4 h-4" />
                          <span>{story.duration}</span>
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {story.category}
                        </span>
                      </div>
                    </div>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full transition-all">
                      <Wand2 className="w-5 h-5" />
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
                  <span className="text-sm text-gray-700">Interactive storytelling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-gray-700">Custom story generation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-700">Peer story sharing</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">New Features!</h3>
              <p className="text-sm opacity-90 mb-4">
                ✨ AI-generated custom stories<br/>
                🤝 Share stories with connected peers<br/>
                🎭 Interactive story choices
              </p>
              <button 
                onClick={() => setShowCustomStory(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Try Now!
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIStoryteller;