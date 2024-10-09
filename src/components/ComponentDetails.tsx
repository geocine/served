import React from 'react';
import { Component } from '../types';
import JsonViewer from './JsonViewer';
import { File } from 'lucide-react';

interface ComponentDetailsProps {
  component1: Component | undefined;
  component2: Component | undefined;
  server1Name: string;
  server2Name: string;
}

const ComponentDetails: React.FC<ComponentDetailsProps> = ({ component1, component2, server1Name, server2Name }) => {
  if (!component1 || !component2) {
    return (
      <div className="text-red-500 dark:text-red-400">
        Error: One or both components are undefined. Unable to compare.
      </div>
    );
  }

  const isDeviceComponent = 'pid' in component1 && 'pid' in component2;

  const renderDiff = (label: string, value1: string, value2: string) => {
    const isDifferent = value1 !== value2;
    return (
      <div className="mb-2">
        <span className="font-semibold">{label}: </span>
        <span className={isDifferent ? 'bg-yellow-100 dark:bg-yellow-900' : ''}>
          {value1}
        </span>
        {isDifferent && (
          <span className="ml-2 text-accent-500 dark:text-accent-400">
            → {value2}
          </span>
        )}
      </div>
    );
  };

  const renderDependenciesDiff = (deps1: any[], deps2: any[], type: string) => {
    const allDeps = [...new Set([...deps1.map(d => d.name), ...deps2.map(d => d.name)])];
    return (
      <div className="mt-4">
        <h4 className="font-semibold mb-2">{type}</h4>
        <ul className="list-disc pl-5">
          {allDeps.map(depName => {
            const dep1 = deps1.find(d => d.name === depName);
            const dep2 = deps2.find(d => d.name === depName);
            const isDifferent = !dep1 || !dep2 || dep1.commit !== dep2.commit || dep1.version !== dep2.version;
            return (
              <li key={depName} className={isDifferent ? 'bg-yellow-100 dark:bg-yellow-900' : ''}>
                {depName}:
                {' '}
                {dep1 ? (dep1.commit || dep1.version) : 'N/A'}
                {isDifferent && (
                  <span className="ml-2 text-accent-500 dark:text-accent-400">
                    → {dep2 ? (dep2.commit || dep2.version) : 'N/A'}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  // Mock function to get JSON content (replace with actual implementation)
  const getJsonContent = (file: string) => {
    return {
      "key1": "value1",
      "key2": {
        "nestedKey": "nestedValue"
      },
      "key3": [1, 2, 3]
    };
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <h3 className="font-semibold mb-2">Component Differences</h3>
        {renderDiff("URL", component1.url, component2.url)}
        {renderDiff("Version", component1.version, component2.version)}
        {renderDiff("Commit", component1.commit, component2.commit)}
        {isDeviceComponent && renderDiff("PID", (component1 as any).pid, (component2 as any).pid)}
      </div>
      <div>
        <h3 className="font-semibold mb-2">Dependencies</h3>
        {isDeviceComponent ? (
          <>
            {renderDependenciesDiff((component1 as any).packageDependencies, (component2 as any).packageDependencies, "Package Dependencies")}
            {renderDependenciesDiff((component1 as any).binaryDependencies, (component2 as any).binaryDependencies, "Binary Dependencies")}
          </>
        ) : (
          <ul className="list-disc pl-5">
            {(component1 as any).dependencies.map((dep: string) => (
              <li key={dep} className={(component2 as any).dependencies.includes(dep) ? '' : 'bg-yellow-100 dark:bg-yellow-900'}>
                {dep}
                {!(component2 as any).dependencies.includes(dep) && (
                  <span className="ml-2 text-accent-500 dark:text-accent-400">
                    → Removed
                  </span>
                )}
              </li>
            ))}
            {(component2 as any).dependencies.filter((dep: string) => !(component1 as any).dependencies.includes(dep)).map((dep: string) => (
              <li key={dep} className="bg-yellow-100 dark:bg-yellow-900">
                {dep}
                <span className="ml-2 text-secondary-500 dark:text-secondary-400">
                  → Added
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {!isDeviceComponent && (
        <div>
          <h3 className="font-semibold mb-2">Files</h3>
          <ul className="space-y-2">
            {(component1 as any).files.map((file: string) => (
              <li key={file}>
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                  <File className="w-4 h-4" />
                  <span>{file}</span>
                </div>
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-600 rounded">
                  <JsonViewer data={getJsonContent(file)} name={file} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComponentDetails;