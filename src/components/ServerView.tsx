import React, { useState } from 'react';
import { Server, Component, DeviceComponent, CommonComponent, PackageDependency, BinaryDependency } from '../types';
import { Search, HardDrive, Box, ChevronDown, ChevronRight, Code, List, Package, Binary, File } from 'lucide-react';
import JsonViewer from './JsonViewer';

interface ServerViewProps {
  server: Server;
}

interface TabProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, icon, isActive, onClick }) => (
  <button
    className={`flex items-center px-4 py-2 text-sm font-medium ${
      isActive
        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
    }`}
    onClick={onClick}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </button>
);

const ServerView: React.FC<ServerViewProps> = ({ server }) => {
  const [activeTab, setActiveTab] = useState<string>('package');
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [jsonViewMode, setJsonViewMode] = useState<'interactive' | 'text'>('interactive');
  const [expandedFiles, setExpandedFiles] = useState<string[]>([]);

  const renderJsonView = () => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      {jsonViewMode === 'interactive' ? (
        <JsonViewer data={server} name={server.name} />
      ) : (
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
          {JSON.stringify(server, null, 2)}
        </pre>
      )}
    </div>
  );

  const renderTable = (data: any[], columns: string[]) => (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          {columns.map((column) => (
            <th
              key={column}
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((item, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {item[column.toLowerCase()]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderFileTable = (files: string[]) => (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            File Name
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Content
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {files.map((file) => (
          <tr key={file}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{file}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              <button
                onClick={() => toggleFileExpansion(file)}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
              >
                {expandedFiles.includes(file) ? 'Hide Content' : 'Show Content'}
              </button>
              {expandedFiles.includes(file) && (
                <div className="mt-2">
                  <JsonViewer data={getMockJsonContent(file)} name={file} />
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const toggleFileExpansion = (file: string) => {
    setExpandedFiles((prev) =>
      prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file]
    );
  };

  const getMockJsonContent = (file: string) => {
    return {
      "key1": "value1",
      "key2": {
        "nestedKey": "nestedValue"
      },
      "key3": [1, 2, 3]
    };
  };

  const renderComponentDetails = (component: Component) => {
    const isDeviceComponent = 'pid' in component;
    const deviceComponent = component as DeviceComponent;
    const commonComponent = component as CommonComponent;

    return (
      <div className="mt-4">
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Details</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>URL: {component.url}</div>
            <div>Version: {component.version}</div>
            <div>Commit: {component.commit}</div>
            {isDeviceComponent && <div>PID: {deviceComponent.pid}</div>}
          </div>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <Tab
              label="Package Dependencies"
              icon={<Package className="w-4 h-4" />}
              isActive={activeTab === 'package'}
              onClick={() => setActiveTab('package')}
            />
            <Tab
              label="Binary Dependencies"
              icon={<Binary className="w-4 h-4" />}
              isActive={activeTab === 'binary'}
              onClick={() => setActiveTab('binary')}
            />
            {!isDeviceComponent && (
              <Tab
                label="Files"
                icon={<File className="w-4 h-4" />}
                isActive={activeTab === 'file'}
                onClick={() => setActiveTab('file')}
              />
            )}
          </div>
          <div className="overflow-x-auto p-4">
            {isDeviceComponent ? (
              <>
                {activeTab === 'package' && renderTable(deviceComponent.packageDependencies, ['Name', 'Commit'])}
                {activeTab === 'binary' && renderTable(deviceComponent.binaryDependencies, ['Name', 'Version'])}
              </>
            ) : (
              <>
                {activeTab === 'package' && renderTable(commonComponent.dependencies.map(dep => ({ name: dep })), ['Name'])}
                {activeTab === 'file' && renderFileTable(commonComponent.files)}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderComponentList = () => (
    <div className="space-y-2">
      {server.components.map((component) => (
        <button
          key={component.name}
          onClick={() => setSelectedComponent(component)}
          className={`flex items-center w-full text-left px-4 py-2 rounded-md ${
            selectedComponent?.name === component.name
              ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {'pid' in component ? (
            <HardDrive className="w-5 h-5 mr-2 text-primary-500 dark:text-primary-400" />
          ) : (
            <Box className="w-5 h-5 mr-2 text-secondary-500 dark:text-secondary-400" />
          )}
          <span>{component.name}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Server: {server.name}</h2>
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'json' : 'table')}
            className="px-3 py-2 bg-primary-100 dark:bg-primary-700 text-primary-700 dark:text-primary-100 rounded-md"
          >
            {viewMode === 'table' ? 'JSON View' : 'Table View'}
          </button>
        </div>
      </div>
      <div className="p-4">
        {viewMode === 'json' ? (
          renderJsonView()
        ) : (
          <div className="flex">
            <div className="w-1/3 pr-4 border-r border-gray-200 dark:border-gray-700">
              {renderComponentList()}
            </div>
            <div className="w-2/3 pl-4">
              {selectedComponent ? (
                renderComponentDetails(selectedComponent)
              ) : (
                <div className="text-gray-500 dark:text-gray-400">Select a component to view details</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerView;