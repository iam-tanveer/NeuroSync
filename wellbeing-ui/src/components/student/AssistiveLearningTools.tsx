import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Volume2, VolumeX, BookOpen, Brain, Ear, Lightbulb, FileText, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { demoNotes, complexTexts } from './DemoContent';

export function AssistiveLearningTools() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [subjectText, setSubjectText] = useState('');
  const [summary, setSummary] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [speechRate, setSpeechRate] = useState(1.0);

  // Text-to-Speech function
  const speakText = (text: string, rate: number = 1.0) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast.error('Speech Error', {
          description: 'Unable to play audio. Please check your browser settings.'
        });
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Not Supported', {
        description: 'Text-to-speech is not supported in your browser.'
      });
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Mock LLM summarization
  const generateSummary = (text: string) => {
    // Simulate LLM processing
    const wordCount = text.split(' ').length;
    const mockSummary = `This topic covers ${wordCount} key concepts. Main points include: understanding the fundamental principles, applying practical techniques, and mastering core skills. Key takeaway: Practice regularly to build strong foundations. This material is essential for comprehension and will be tested in upcoming assessments.`;
    
    setSummary(mockSummary);
    toast.success('Summary Generated', {
      description: 'Click "Listen to Summary" to hear it'
    });
  };

  // Mock LLM simplification for learning disabilities
  const simplifyText = (text: string) => {
    // Simulate simplified explanation
    const mockSimplified = `Let me explain this in simple steps:

Step 1: First, we learn the basic idea. Think of it like building with blocks.

Step 2: Next, we practice slowly. Take your time. There's no rush.

Step 3: Finally, we check what we learned. You're doing great!

Remember: Learning is like a journey. Every small step counts. You can do this!`;
    
    setSimplifiedText(mockSimplified);
    toast.success('Text Simplified', {
      description: 'Easy-to-understand version ready'
    });
  };

  // Smart study suggestions based on cognitive data
  const getSmartSuggestions = () => {
    const suggestions = [
      {
        type: 'Visual Learning',
        reason: 'Your focus improves 25% with visual aids',
        action: 'Try using diagrams and mind maps',
        icon: '📊'
      },
      {
        type: 'Auditory Learning',
        reason: 'You retain better with audio content',
        action: 'Listen to lecture recordings',
        icon: '🎧'
      },
      {
        type: 'Break Schedule',
        reason: 'Focus drops after 45 minutes',
        action: 'Take 5-min breaks every 45 min',
        icon: '⏰'
      },
      {
        type: 'Best Study Time',
        reason: 'Peak performance at 10-12 PM',
        action: 'Schedule difficult topics in morning',
        icon: '☀️'
      }
    ];

    return suggestions;
  };

  return (
    <div className="space-y-4">
      {/* Assistive Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Subject Summary with AI Voice */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="border-blue-200 hover:border-blue-400 cursor-pointer transition-all hover:shadow-lg group">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                    <Volume2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-blue-900 mb-1">Subject Summary</div>
                    <div className="text-blue-700">AI voice summaries of topics</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-blue-600" />
                Subject Summary with AI Voice
              </DialogTitle>
              <DialogDescription>
                Paste your notes or textbook content, and get an audio summary
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2 mb-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSubjectText(demoNotes.biology)}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Try Biology Example
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSubjectText(demoNotes.chemistry)}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Try Chemistry Example
                </Button>
              </div>
              <Textarea
                placeholder="Paste your course notes, textbook excerpt, or topic content here..."
                value={subjectText}
                onChange={(e) => setSubjectText(e.target.value)}
                className="min-h-[150px]"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => generateSummary(subjectText)}
                  disabled={!subjectText.trim()}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Summary
                </Button>
                {summary && (
                  <Button 
                    onClick={() => isSpeaking ? stopSpeaking() : speakText(summary)}
                    variant="outline"
                  >
                    {isSpeaking ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Listen to Summary
                      </>
                    )}
                  </Button>
                )}
              </div>
              {summary && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-blue-900 mb-2">Summary:</div>
                  <div className="text-blue-800">{summary}</div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Adaptive Explanation Mode */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="border-green-200 hover:border-green-400 cursor-pointer transition-all hover:shadow-lg group">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-green-900 mb-1">Simple Explanations</div>
                    <div className="text-green-700">Easy step-by-step learning</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                Adaptive Explanation Mode
              </DialogTitle>
              <DialogDescription>
                Simplifies complex topics into easy-to-understand steps
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2 mb-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSubjectText(complexTexts.quantum)}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Try Quantum Physics
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSubjectText(complexTexts.philosophy)}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Try Philosophy
                </Button>
              </div>
              <Textarea
                placeholder="Paste any difficult text or concept here..."
                value={subjectText}
                onChange={(e) => setSubjectText(e.target.value)}
                className="min-h-[120px]"
              />
              
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => simplifyText(subjectText)}
                  disabled={!subjectText.trim()}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Simplify Text
                </Button>
                
                {simplifiedText && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">Reading Speed:</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSpeechRate(0.7)}
                        className={speechRate === 0.7 ? 'bg-green-100' : ''}
                      >
                        Slow
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSpeechRate(1.0)}
                        className={speechRate === 1.0 ? 'bg-green-100' : ''}
                      >
                        Normal
                      </Button>
                    </div>
                    <Button 
                      onClick={() => isSpeaking ? stopSpeaking() : speakText(simplifiedText, speechRate)}
                      variant="outline"
                    >
                      {isSpeaking ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Ear className="w-4 h-4 mr-2" />
                          Read Aloud
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>

              {simplifiedText && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-green-900 mb-2">Simple Explanation:</div>
                  <div className="text-green-800 whitespace-pre-line">{simplifiedText}</div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Screen Reader Companion */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="border-purple-200 hover:border-purple-400 cursor-pointer transition-all hover:shadow-lg group">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                    <Ear className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-purple-900 mb-1">Screen Reader Helper</div>
                    <div className="text-purple-700">Audio navigation support</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ear className="w-5 h-5 text-purple-600" />
                Screen Reader Companion
              </DialogTitle>
              <DialogDescription>
                Navigate your dashboard with audio guidance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-purple-900 mb-3">Keyboard Shortcuts:</div>
                <div className="space-y-2 text-purple-800">
                  <div className="flex items-center gap-2">
                    <Badge>Alt + S</Badge>
                    <span>Read session summary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Alt + F</Badge>
                    <span>Hear current focus score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Alt + H</Badge>
                    <span>Get helpful tips</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Alt + N</Badge>
                    <span>Navigate to next section</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={() => speakText('Your current focus score is 72 percent. Stress level is 35 percent. You are doing well. Keep up the good work!')}
                  variant="outline"
                  className="justify-start"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Hear Current Stats
                </Button>
                <Button 
                  onClick={() => speakText('You have been studying for 15 minutes. Average focus is 78 percent. Average stress is 32 percent. Take a break if needed.')}
                  variant="outline"
                  className="justify-start"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Session Summary
                </Button>
                <Button 
                  onClick={() => speakText('Tip: Your best study time is between 10 AM and 12 PM. Consider scheduling difficult topics during this time for better results.')}
                  variant="outline"
                  className="justify-start"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Personalized Tip
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Smart Study Helper */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="border-amber-200 hover:border-amber-400 cursor-pointer transition-all hover:shadow-lg group">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-amber-100 rounded-lg group-hover:scale-110 transition-transform">
                    <Lightbulb className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-amber-900 mb-1">Smart Study Helper</div>
                    <div className="text-amber-700">Personalized learning tips</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                Smart Study Helper
              </DialogTitle>
              <DialogDescription>
                AI-powered suggestions based on your cognitive patterns
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="text-amber-900 mb-2">Based on your EEG data and performance:</div>
              </div>

              <div className="space-y-3">
                {getSmartSuggestions().map((suggestion, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{suggestion.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-slate-900">{suggestion.type}</span>
                          <Badge variant="outline" className="text-xs">Recommended</Badge>
                        </div>
                        <div className="text-slate-600 mb-2">{suggestion.reason}</div>
                        <div className="text-slate-800">
                          <strong>Action:</strong> {suggestion.action}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => speakText(`${suggestion.type}. ${suggestion.reason}. ${suggestion.action}`)}
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => {
                  const allSuggestions = getSmartSuggestions()
                    .map(s => `${s.type}: ${s.reason}. ${s.action}`)
                    .join('. ');
                  speakText(`Here are your personalized study suggestions. ${allSuggestions}`);
                }}
                className="w-full"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Read All Suggestions
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
