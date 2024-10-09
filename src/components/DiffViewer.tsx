import React from 'react';
import { diffLines, Change } from 'diff';

interface DiffViewerProps {
  oldContent: string;
  newContent: string;
  oldHeader: string;
  newHeader: string;
  diffMode: 'unified' | 'split';
  isJsonView?: boolean;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ oldContent, newContent, oldHeader, newHeader, diffMode, isJsonView = false }) => {
  const diff = diffLines(oldContent, newContent);

  const renderUnifiedDiff = () => (
    <div className={`font-mono text-sm overflow-x-auto ${isJsonView ? '' : 'bg-white dark:bg-gray-800 p-4 rounded-lg'}`}>
      <div className="flex justify-between mb-2">
        <span className="text-red-500 dark:text-red-400 font-semibold">{oldHeader} (Removed)</span>
        <span className="text-green-500 dark:text-green-400 font-semibold">{newHeader} (Added)</span>
      </div>
      <pre className={`leading-tight ${isJsonView ? 'p-0' : 'p-2'}`}>
        {diff.map((part: Change, index: number) => {
          const color = part.added ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : part.removed ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : '';
          return (
            <div key={index} className={`${color}`}>
              {part.value.split('\n').map((line, lineIndex) => (
                <div key={lineIndex} className="whitespace-pre">
                  {part.added && '+'}
                  {part.removed && '-'}
                  {!part.added && !part.removed && ' '}
                  {line}
                </div>
              ))}
            </div>
          );
        })}
      </pre>
    </div>
  );

  const renderSplitDiff = () => (
    <div className={`flex font-mono text-sm overflow-x-auto ${isJsonView ? '' : 'bg-white dark:bg-gray-800 p-4 rounded-lg'}`}>
      <div className="w-1/2 pr-2">
        <h3 className="font-semibold text-red-500 dark:text-red-400 mb-2">{oldHeader}</h3>
        <pre className={`leading-tight ${isJsonView ? 'p-0' : 'p-2'}`}>
          {diff.map((part: Change, index: number) => (
            <div key={index} className={part.removed ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : ''}>
              {part.removed && part.value.split('\n').map((line, lineIndex) => (
                <div key={lineIndex} className="whitespace-pre">-{line}</div>
              ))}
              {!part.removed && !part.added && part.value.split('\n').map((line, lineIndex) => (
                <div key={lineIndex} className="text-gray-800 dark:text-gray-200 whitespace-pre"> {line}</div>
              ))}
            </div>
          ))}
        </pre>
      </div>
      <div className="w-1/2 pl-2">
        <h3 className="font-semibold text-green-500 dark:text-green-400 mb-2">{newHeader}</h3>
        <pre className={`leading-tight ${isJsonView ? 'p-0' : 'p-2'}`}>
          {diff.map((part: Change, index: number) => (
            <div key={index} className={part.added ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : ''}>
              {part.added && part.value.split('\n').map((line, lineIndex) => (
                <div key={lineIndex} className="whitespace-pre">+{line}</div>
              ))}
              {!part.removed && !part.added && part.value.split('\n').map((line, lineIndex) => (
                <div key={lineIndex} className="text-gray-800 dark:text-gray-200 whitespace-pre"> {line}</div>
              ))}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );

  return (
    <div className={isJsonView ? '' : 'bg-white dark:bg-gray-800 p-4 rounded-lg'}>
      {diffMode === 'unified' ? renderUnifiedDiff() : renderSplitDiff()}
    </div>
  );
};

export default DiffViewer;