import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Info, Keyboard, Volume2, Eye, Brain } from 'lucide-react';
import { Badge } from '../ui/badge';

export function AccessibilityGuide() {
  return (
    <div className="space-y-4">
      <Alert className="border-blue-500 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          This dashboard is designed to be accessible for all learners, including students with learning disabilities, visual impairments, and other special needs.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* For Students with Learning Disabilities */}
        <Card className="border-green-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-green-600" />
              <CardTitle className="text-green-900">Learning Support</CardTitle>
            </div>
            <CardDescription>For Down syndrome and learning disabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                <div>
                  <div className="text-green-900">Simple Explanations</div>
                  <div className="text-green-700">Text simplified to easy language</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                <div>
                  <div className="text-green-900">Slow Reading Speed</div>
                  <div className="text-green-700">Adjustable speech rate for better comprehension</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                <div>
                  <div className="text-green-900">Step-by-Step</div>
                  <div className="text-green-700">Complex topics broken into small steps</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* For Visually Impaired Students */}
        <Card className="border-purple-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-purple-900">Visual Accessibility</CardTitle>
            </div>
            <CardDescription>For blind and low-vision students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                <div>
                  <div className="text-purple-900">Screen Reader Support</div>
                  <div className="text-purple-700">Full keyboard navigation</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                <div>
                  <div className="text-purple-900">Audio Summaries</div>
                  <div className="text-purple-700">All content available as speech</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                <div>
                  <div className="text-purple-900">ARIA Labels</div>
                  <div className="text-purple-700">Compatible with assistive technology</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card className="border-blue-200 md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-blue-900">Keyboard Shortcuts</CardTitle>
            </div>
            <CardDescription>Navigate without a mouse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-900 min-w-[80px]">Alt + S</Badge>
                  <span className="text-slate-700">Read session summary</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-900 min-w-[80px]">Alt + F</Badge>
                  <span className="text-slate-700">Hear current focus score</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-900 min-w-[80px]">Alt + H</Badge>
                  <span className="text-slate-700">Get helpful tips</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-900 min-w-[80px]">Alt + N</Badge>
                  <span className="text-slate-700">Navigate to next section</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-900 min-w-[80px]">Tab</Badge>
                  <span className="text-slate-700">Move between elements</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-900 min-w-[80px]">Enter</Badge>
                  <span className="text-slate-700">Activate focused element</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card className="border-amber-200 md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-amber-600" />
              <CardTitle className="text-amber-900">AI-Powered Features</CardTitle>
            </div>
            <CardDescription>Intelligent assistance for better learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                <div className="text-amber-900 mb-1">📝 Subject Summarization</div>
                <div className="text-amber-700">Paste notes, get concise audio summaries using LLM</div>
              </div>
              <div className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                <div className="text-amber-900 mb-1">🧠 Adaptive Simplification</div>
                <div className="text-amber-700">Complex text converted to simple, grade-level language</div>
              </div>
              <div className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                <div className="text-amber-900 mb-1">💡 Smart Suggestions</div>
                <div className="text-amber-700">Personalized tips based on your EEG patterns</div>
              </div>
              <div className="p-3 border border-amber-200 rounded-lg bg-amber-50">
                <div className="text-amber-900 mb-1">🎧 Text-to-Speech</div>
                <div className="text-amber-700">All content readable with natural voice synthesis</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
