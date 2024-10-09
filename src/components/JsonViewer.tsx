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
          <span className="text-primary-400 font-semibold">{name}</span>
          <button
            onClick={toggleViewMode}
            className="px-2 py-1 text-xs bg-secondary-700 text-secondary-200 rounded"
          >
            Interactive View
          </button>
        </div>
        <pre className="bg-secondary-800 p-4 rounded-lg overflow-x-auto text-secondary-200">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }

  if (typeof data !== 'object' || data === null) {
    return (
      <div className="ml-4">
        <span className="text-primary-400">{name}: </span>
        <span className="text-secondary-200">
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
            <ChevronDown className="w-4 h-4 text-secondary-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-secondary-400" />
          )}
          {name && (
            <>
              <File className="w-4 h-4 ml-1 mr-2 text-secondary-400" />
              <span className="text-primary-400 mr-2">{name}</span>
            </>
          )}
          <span className="text-secondary-200">{isArray ? '[' : '{'}</span>
          {!isExpanded && <span className="text-secondary-400 ml-1">...</span>}
          {!isExpanded && <span className="text-secondary-200 ml-1">{isArray ? ']' : '}'}</span>}
        </div>
        {isRoot && (
          <button
            onClick={toggleViewMode}
            className="px-2 py-1 text-xs bg-secondary-700 text-secondary-200 rounded"
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
          <div className="text-secondary-200">{isArray ? ']' : '}'}</div>
        </>
      )}
    </div>
  );
};

export default JsonViewer;