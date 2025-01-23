import { Clock, Brain, Target } from 'lucide-react';

const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    const pad = (num) => num.toString().padStart(2, '0');
  
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
    }
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
  };
  
export default function TestCard({ test, onStart }) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{test.title}</h3>
        <p className="text-gray-600 mb-4">{test.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>{formatTime(test.duration)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Brain className="h-4 w-4 mr-2" />
            <span>{test.questions.length} Questions</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Target className="h-4 w-4 mr-2" />
            <span className="capitalize">{test.difficulty} Difficulty</span>
          </div>
        </div>
        
        <button
          onClick={onStart}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Start Test
        </button>
      </div>
    );
  }