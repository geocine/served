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
  const diff: Change[] = diffLines(oldContent, newContent);

  const renderUnifiedDiff = () => (
    <div className={`font-mono text-sm overflow-x-auto ${isJsonView ? '' : 'bg-transparent p-4 rounded-lg'}`}>
      <div className="flex justify-between mb-2">
        <span className="text-accent-400 font-semibold">{oldHeader} (Removed)</span>
        <span className="text-primary-400 font-semibold">{newHeader} (Added)</span>
      </div>
      <pre className={`leading-tight ${isJsonView ? 'p-0' : 'p-2'}`}>
        {diff.map((part: Change, index: number) => {
          const color = part.added ? 'bg-primary-900 text-primary-200' : part.removed ? 'bg-accent-900 text-accent-200' : 'bg-transparent text-secondary-200';
          return (
            <div key={index} className={`whitespace-pre-wrap ${color} py-1`}>
              {part.value.split('\n').map((line: string, lineIndex: number) => (
                <div key={lineIndex}>
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
    <div className={`flex font-mono text-sm overflow-x-auto ${isJsonView ? '' : 'bg-transparent p-4 rounded-lg'}`}>
      <div className="w-1/2 pr-2">
        <h3 className="font-semibold text-accent-400 mb-2">{oldHeader}</h3>
        <pre className={`leading-tight ${isJsonView ? 'p-0' : 'p-2'}`}>
          {diff.map((part: Change, index: number) => (
            <div key={index} className={`whitespace-pre-wrap ${part.removed ? 'bg-accent-900 text-accent-200' : 'bg-transparent text-secondary-200'} py-1`}>
              {part.removed && part.value.split('\n').map((line: string, lineIndex: number) => (
                <div key={lineIndex}>-{line}</div>
              ))}
              {!part.removed && !part.added && part.value.split('\n').map((line: string, lineIndex: number) => (
                <div key={lineIndex}> {line}</div>
              ))}
            </div>
          ))}
        </pre>
      </div>
      <div className="w-1/2 pl-2">
        <h3 className="font-semibold text-primary-400 mb-2">{newHeader}</h3>
        <pre className={`leading-tight ${isJsonView ? 'p-0' : 'p-2'}`}>
          {diff.map((part: Change, index: number) => (
            <div key={index} className={`whitespace-pre-wrap ${part.added ? 'bg-primary-900 text-primary-200' : 'bg-transparent text-secondary-200'} py-1`}>
              {part.added && part.value.split('\n').map((line: string, lineIndex: number) => (
                <div key={lineIndex}>+{line}</div>
              ))}
              {!part.removed && !part.added && part.value.split('\n').map((line: string, lineIndex: number) => (
                <div key={lineIndex}> {line}</div>
              ))}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );

  return (
    <div className={isJsonView ? '' : 'bg-transparent p-4 rounded-lg'}>
      {diffMode === 'unified' ? renderUnifiedDiff() : renderSplitDiff()}
    </div>
  );
};

export default DiffViewer;