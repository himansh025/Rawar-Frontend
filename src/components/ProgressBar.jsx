
export default function ProgressBar({ icon, label, value, total, showPercentage = false }) {
    const percentage = Math.round((value / total) * 100);
    
    return (
      <div>
        <div className="flex items-center mb-2">
          <span className="text-gray-500">{icon}</span>
          <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>
          <span className="ml-auto text-sm font-medium text-gray-900">
            {showPercentage ? `${percentage}%` : `${value}/${total}`}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 rounded-full h-2"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
