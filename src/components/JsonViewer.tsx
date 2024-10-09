import React, { useState } from 'react';
import { ChevronDown, ChevronRight, File } from 'lucide-react';

interface JsonViewerProps {
  data: any;
  name?: string;
  isRoot?: boolean;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, name, isRoot = true }) => {
  const [isExpanded, setIsExpanded] = useState(isRoot);
  const [viewMode, setViewMode] = useState<'interactive' | 'text'>('interactive');

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleViewMode = () => setViewMode(viewMode === 'interactive' ? 'text' : 'interactive');

  if (viewMode === 'text') {
    return (
      <div className="font-mono text-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-blue-600 dark:text-blue-400 font-semibold">{name}</span>
          <button
            onClick={toggleViewMode}
            className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
          >
            Interactive View
          </button>
        </div>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }

  if (typeof data !== 'object' || data === null) {
    return (
      <div className="ml-4">
        <span className="text-blue-600 dark:text-blue-400">{name}: </span>
        <span className="text-green-600 dark:text-green-400">
          {typeof data === 'string' ? `"${data}"` : String(data)}
        </span>
      </div>
    );
  }

  const isArray = Array.isArray(data);

  return (
    <div className={isRoot ? '' : 'ml-4'}>
      <div className="flex justify-between items-center">
        <div onClick={toggleExpand} className="cursor-pointer flex items-center">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          )}
          {name && (
            <>
              <File className="w-4 h-4 ml-1 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-blue-600 dark:text-blue-400 mr-2">{name}</span>
            </>
          )}
          <span className="text-gray-800 dark:text-gray-200">{isArray ? '[' : '{'}</span>
          {!isExpanded && <span className="text-gray-500 dark:text-gray-400 ml-1">...</span>}
          {!isExpanded && <span className="text-gray-800 dark:text-gray-200 ml-1">{isArray ? ']' : '}'}</span>}
        </div>
        {isRoot && (
          <button
            onClick={toggleViewMode}
            className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
          >
            Text View
          </button>
        )}
      </div>
      {isExpanded && (
        <>
          <div className="ml-4">
            {Object.entries(data).map(([key, value]) => (
              <JsonViewer key={key} data={value} name={key} isRoot={false} />
            ))}
          </div>
          <div className="text-gray-800 dark:text-gray-200">{isArray ? ']' : '}'}</div>
        </>
      )}
    </div>
  );
};

export default JsonViewer;