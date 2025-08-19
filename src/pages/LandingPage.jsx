import { FiZap, FiBook, FiCheckCircle, FiCpu } from 'react-icons/fi';
import Button from '../components/Button';
import { useApp } from '../contexts/AppContext';

export default function LandingPage() {
  const { setCurrentView } = useApp();

  const features = [
    {
      icon: <FiCpu />,
      title: 'Quick Summaries',
      description: 'Turn long notes into bite-sized summaries you can actually remember'
    },
    {
      icon: <FiBook />,
      title: 'Flashcards',
      description: 'Auto-generate flashcards from your notes - no more manual typing'
    },
    {
      icon: <FiZap />,
      title: 'Practice Quizzes',
      description: 'Test yourself with AI-generated questions before the real exam'
    },
    {
      icon: <FiCheckCircle />,
      title: 'Track What You Know',
      description: 'Mark cards as learned and focus on the stuff you still need to review'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-slide-in">
          <div className="mb-6 flex justify-center">
            <div className="bg-blue-600 p-6 rounded-3xl shadow-lg">
              <FiCpu className="text-6xl text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Study<span className="text-blue-600">AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto">
            Stop re-reading your notes. Start actually learning.
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Upload your notes, let AI do the heavy lifting, and spend your time studying - not organizing.
          </p>
          <Button
            size="lg"
            onClick={() => setCurrentView('dashboard')}
            className="shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Let's Go
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            How it works
          </h2>
          <div className="space-y-6">
            {[
              { step: 1, title: 'Drop in your notes', desc: 'Upload a PDF or just paste the text - whatever works' },
              { step: 2, title: 'Pick what you need', desc: 'Summary? Flashcards? Quiz? Take your pick' },
              { step: 3, title: 'Study smarter', desc: 'Review, practice, and export when you\'re ready' }
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500 dark:text-gray-500 text-sm">
          <p>Uses OpenAI's API • Everything stays in your browser</p>
        </div>
      </div>
    </div>
  );
}
