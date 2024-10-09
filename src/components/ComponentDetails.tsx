import React from 'react';
import { Component, DeviceComponent, CommonComponent, BinaryDependency } from '../types';
import JsonViewer from './JsonViewer';
import { File } from 'lucide-react';
import { PackageDependency } from '../types';

interface ComponentDetailsProps {
  component1: Component | undefined;
  component2: Component | undefined;
  server1Name: string;
  server2Name: string;
}

const ComponentDetails: React.FC<ComponentDetailsProps> = ({ component1, component2 }) => {
  if (!component1 || !component2) {
    return (
      <div className="text-accent-500">
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
        <span className={isDifferent ? 'bg-secondary-800' : ''}>
          {value1}
        </span>
        {isDifferent && (
          <span className="ml-2 text-accent-500">
            → {value2}
          </span>
        )}
      </div>
    );
  };

  const renderDependenciesDiff = (deps1: Array<PackageDependency| BinaryDependency>, deps2: Array<PackageDependency| BinaryDependency>, type: string) => {
    const allDeps = [...new Set([...deps1.map(d => d.name), ...deps2.map(d => d.name)])];
    return (
      <div className="mt-4">
        <h4 className="font-semibold mb-2">{type}</h4>
        <ul className="list-disc pl-5">
          {allDeps.map(depName => {
            const dep1 = deps1.find(d => d.name === depName);
            const dep2 = deps2.find(d => d.name === depName);
            const isDifferent = !dep1 || !dep2 || 
                                ('commit' in dep1 && 'commit' in dep2 && dep1.commit !== dep2.commit) || 
                                ('version' in dep1 && 'version' in dep2 && dep1.version !== dep2.version);
            return (
              <li key={depName} className={isDifferent ? 'bg-secondary-800' : ''}>
                {depName}:
                {' '}
                {dep1 ? ('commit' in dep1 ? dep1.commit : dep1.version) : 'N/A'}
                {isDifferent && (
                  <span className="ml-2 text-accent-500">
                    → {dep2 ? ('commit' in dep2 ? dep2.commit : dep2.version) : 'N/A'}
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
  const getJsonContent = () => {
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
        {isDeviceComponent && renderDiff("PID", (component1 as DeviceComponent).pid, (component2 as DeviceComponent).pid)}
      </div>
      <div>
        <h3 className="font-semibold mb-2">Dependencies</h3>
        {isDeviceComponent ? (
          <>
            {renderDependenciesDiff((component1 as DeviceComponent).packageDependencies, (component2 as DeviceComponent).packageDependencies, "Package Dependencies")}
            {renderDependenciesDiff((component1 as DeviceComponent).binaryDependencies, (component2 as DeviceComponent).binaryDependencies, "Binary Dependencies")}
          </>
        ) : (
          <>
            {renderDependenciesDiff((component1 as CommonComponent).dependencies, (component2 as CommonComponent).dependencies, "Package Dependencies")}
          </>
        )}
      </div>
      {!isDeviceComponent && (
        <div>
          <h3 className="font-semibold mb-2">Files</h3>
          <ul className="space-y-2">
            {(component1 as CommonComponent).files.map((file: string) => (
              <li key={file}>
                <div className="flex items-center space-x-2 text-primary-400">
                  <File className="w-4 h-4" />
                  <span>{file}</span>
                </div>
                <div className="mt-2 p-3 bg-secondary-800 rounded">
                  <JsonViewer data={getJsonContent()} />
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