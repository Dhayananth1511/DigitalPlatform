export interface Story {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  category: string;
  language: 'en' | 'hi' | 'pa';
  audioUrl?: string;
  isInteractive: boolean;
  choices?: StoryChoice[];
}

export interface StoryChoice {
  id: string;
  text: string;
  nextSegment: string;
}

export interface StorySegment {
  id: string;
  content: string;
  choices?: StoryChoice[];
  isEnding?: boolean;
}

export class AIStorytellerEngine {
  private currentStory: Story | null = null;
  private currentSegment: string = '';
  private storyHistory: string[] = [];
  private isPlaying: boolean = false;
  private speechSynthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
  }

  async generateStory(prompt: string, language: 'en' | 'hi' | 'pa' = 'en'): Promise<Story> {
    // Simulate AI story generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const stories = {
      en: {
        title: `The Adventure of ${prompt}`,
        content: `Once upon a time, in a beautiful village in Punjab, there lived a young ${prompt}. This is their incredible journey of discovery and courage...`,
        category: 'Adventure'
      },
      hi: {
        title: `${prompt} की कहानी`,
        content: `एक बार की बात है, पंजाब के एक सुंदर गांव में एक ${prompt} रहता था। यह उनकी खोज और साहस की अविश्वसनीय यात्रा है...`,
        category: 'साहसिक'
      },
      pa: {
        title: `${prompt} ਦੀ ਕਹਾਣੀ`,
        content: `ਇੱਕ ਵਾਰ ਦੀ ਗੱਲ ਹੈ, ਪੰਜਾਬ ਦੇ ਇੱਕ ਸੁੰਦਰ ਪਿੰਡ ਵਿੱਚ ਇੱਕ ${prompt} ਰਹਿੰਦਾ ਸੀ। ਇਹ ਉਨ੍ਹਾਂ ਦੀ ਖੋਜ ਅਤੇ ਹਿੰਮਤ ਦੀ ਅਦਭੁਤ ਯਾਤਰਾ ਹੈ...`,
        category: 'ਸਾਹਸਿਕ'
      }
    };

    const storyData = stories[language];

    return {
      id: Date.now().toString(),
      title: storyData.title,
      description: `An AI-generated story about ${prompt}`,
      content: storyData.content,
      duration: 5,
      category: storyData.category,
      language,
      isInteractive: true,
      choices: [
        { id: '1', text: 'Continue the adventure', nextSegment: 'adventure' },
        { id: '2', text: 'Meet new friends', nextSegment: 'friends' },
        { id: '3', text: 'Solve a mystery', nextSegment: 'mystery' }
      ]
    };
  }

  async playStory(story: Story, onProgress?: (progress: number) => void): Promise<void> {
    this.currentStory = story;
    this.isPlaying = true;

    return new Promise((resolve, reject) => {
      try {
        this.currentUtterance = new SpeechSynthesisUtterance(story.content);
        
        // Set voice based on language
        const voices = this.speechSynthesis.getVoices();
        const voice = voices.find(v => 
          v.lang.startsWith(story.language === 'en' ? 'en' : story.language === 'hi' ? 'hi' : 'pa')
        ) || voices[0];
        
        if (voice) {
          this.currentUtterance.voice = voice;
        }

        this.currentUtterance.rate = 0.9;
        this.currentUtterance.pitch = 1.1;
        this.currentUtterance.volume = 1.0;

        this.currentUtterance.onstart = () => {
          console.log('Story playback started');
        };

        this.currentUtterance.onend = () => {
          this.isPlaying = false;
          resolve();
        };

        this.currentUtterance.onerror = (error) => {
          this.isPlaying = false;
          reject(error);
        };

        this.currentUtterance.onboundary = (event) => {
          if (onProgress) {
            const progress = (event.charIndex / story.content.length) * 100;
            onProgress(progress);
          }
        };

        this.speechSynthesis.speak(this.currentUtterance);
      } catch (error) {
        this.isPlaying = false;
        reject(error);
      }
    });
  }

  pauseStory(): void {
    if (this.isPlaying) {
      this.speechSynthesis.pause();
    }
  }

  resumeStory(): void {
    if (this.speechSynthesis.paused) {
      this.speechSynthesis.resume();
    }
  }

  stopStory(): void {
    this.speechSynthesis.cancel();
    this.isPlaying = false;
    this.currentUtterance = null;
  }

  makeChoice(choiceId: string): StorySegment | null {
    if (!this.currentStory || !this.currentStory.choices) return null;

    const choice = this.currentStory.choices.find(c => c.id === choiceId);
    if (!choice) return null;

    this.storyHistory.push(this.currentSegment);
    this.currentSegment = choice.nextSegment;

    // Generate next segment based on choice
    const segments: Record<string, StorySegment> = {
      adventure: {
        id: 'adventure',
        content: 'The brave character decided to continue their adventure, discovering hidden treasures and ancient secrets...',
        choices: [
          { id: 'treasure', text: 'Explore the treasure', nextSegment: 'treasure' },
          { id: 'return', text: 'Return home safely', nextSegment: 'ending' }
        ]
      },
      friends: {
        id: 'friends',
        content: 'Along the way, they met wonderful friends who taught them valuable lessons about friendship and cooperation...',
        choices: [
          { id: 'help', text: 'Help the friends', nextSegment: 'help' },
          { id: 'learn', text: 'Learn from them', nextSegment: 'ending' }
        ]
      },
      mystery: {
        id: 'mystery',
        content: 'A mysterious puzzle appeared that required wisdom and cleverness to solve...',
        choices: [
          { id: 'solve', text: 'Solve the puzzle', nextSegment: 'ending' },
          { id: 'ask', text: 'Ask for help', nextSegment: 'ending' }
        ]
      },
      ending: {
        id: 'ending',
        content: 'And so, our hero returned home with new wisdom, ready to share their amazing story with everyone!',
        isEnding: true
      }
    };

    return segments[choice.nextSegment] || segments.ending;
  }

  getPlaybackState() {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.speechSynthesis.paused,
      currentStory: this.currentStory,
      currentSegment: this.currentSegment,
      history: this.storyHistory
    };
  }
}