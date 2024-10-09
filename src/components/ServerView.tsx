import React, { useState, useEffect } from 'react';
import { Server, Component, DeviceComponent, CommonComponent } from '../types';
import {
  Search,
  HardDrive,
  Box,
  Code,
  Table,
  Package,
  Binary,
  File,
} from 'lucide-react';
import JsonViewer from './JsonViewer';
import { PackageDependency, BinaryDependency } from '../types';
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
        : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300'
    }`}
    onClick={onClick}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </button>
);

const ServerView: React.FC<ServerViewProps> = ({ server }) => {
  const [activeTab, setActiveTab] = useState<string>('package');
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null
  );
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [jsonViewMode] = useState<'interactive' | 'text'>(
    'interactive'
  );
  const [expandedFiles, setExpandedFiles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Automatically select the first component when the server loads
  useEffect(() => {
    if (server.components.length > 0) {
      setSelectedComponent(server.components[0]);
    }
  }, [server]);

  const renderJsonView = () => (
    <div className="bg-secondary-900 p-4 rounded-lg shadow">
      {jsonViewMode === 'interactive' ? (
        <JsonViewer data={server} />
      ) : (
        <pre className="bg-secondary-800 p-4 rounded-lg overflow-x-auto text-sm text-secondary-200">
          {JSON.stringify(server, null, 2)}
        </pre>
      )}
    </div>
  );

  const renderTable = (data: Array<PackageDependency | BinaryDependency>, columns: string[]) => (
    <table className="min-w-full divide-y divide-secondary-700">
      <thead className="bg-secondary-800">
        <tr>
          {columns.map((column) => (
            <th
              key={column}
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-secondary-900 divide-y divide-secondary-800">
        {data.map((item, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td
                key={column}
                className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300"
              >
                {item[column.toLowerCase() as keyof typeof item]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderFileTable = (files: string[]) => (
    <div className="bg-secondary-900 p-4 rounded-lg shadow">
      <table className="min-w-full table-fixed divide-y divide-secondary-700">
        <thead className="bg-secondary-800">
          <tr>
            <th
              scope="col"
              className="w-24 px-6 py-3 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider"
            >
              File Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider"
            >
              Content
            </th>
          </tr>
        </thead>
        <tbody className="bg-secondary-900 divide-y divide-secondary-800">
          {files.map((file) => (
            <tr key={file}>
              <td className="w-24 px-6 py-4 whitespace-nowrap text-sm text-secondary-300 align-top">
                {file}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                <button
                  onClick={() => toggleFileExpansion(file)}
                  className="text-primary-400 hover:text-primary-300"
                >
                  {expandedFiles.includes(file) ? 'Hide Content' : 'Show Content'}
                </button>
                {expandedFiles.includes(file) && (
                  <div className="mt-2 bg-secondary-800 p-4 rounded-lg">
                    <JsonViewer data={getMockJsonContent()} />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const toggleFileExpansion = (file: string) => {
    setExpandedFiles((prev) =>
      prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file]
    );
  };

  const getMockJsonContent = () => {
    return {
      key1: 'value1',
      key2: {
        nestedKey: 'nestedValue',
      },
      key3: [1, 2, 3],
    };
  };

  const renderComponentDetails = (component: Component) => {
    const isDeviceComponent = 'pid' in component;
    const deviceComponent = component as DeviceComponent;
    const commonComponent = component as CommonComponent;

    return (
      <div className="mt-4">
        <div className="mb-4">
          <h4 className="font-semibold text-secondary-200 mb-2">Details</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-secondary-300">
            <div>URL: {component.url}</div>
            <div>Version: {component.version}</div>
            <div>Commit: {component.commit}</div>
            {isDeviceComponent && <div>PID: {deviceComponent.pid}</div>}
          </div>
        </div>
        <div className="border border-secondary-700 rounded-lg overflow-hidden">
          <div className="flex border-b border-secondary-700">
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
                {activeTab === 'package' &&
                  renderTable(deviceComponent.packageDependencies, [
                    'Name',
                    'Commit',
                  ])}
                {activeTab === 'binary' &&
                  renderTable(deviceComponent.binaryDependencies, [
                    'Name',
                    'Version',
                  ])}
              </>
            ) : (
              <>
                {activeTab === 'package' &&
                   renderTable(
                    commonComponent.dependencies.map((dep) => ({
                      name: dep.name, // Assuming dep is now a PackageDependency
                      commit: dep.commit // Provide necessary properties
                    })),
                    ['Name', 'Commit'] // Updated columns to match the data
                  )}
                {activeTab === 'file' && renderFileTable(commonComponent.files)}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const filteredComponents = server.components.filter((component) =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderComponentList = () => (
    <div className="space-y-2">
      {filteredComponents.map((component) => (
        <button
          key={component.name}
          onClick={() => setSelectedComponent(component)}
          className={`flex items-center w-full text-left px-4 py-2 rounded-md ${
            selectedComponent?.name === component.name
              ? 'bg-black bg-opacity-30 text-white'
              : 'hover:bg-secondary-800 text-secondary-300'
          }`}
        >
          {'pid' in component ? (
            <HardDrive className="w-5 h-5 mr-2 text-primary-400" />
          ) : (
            <Box className="w-5 h-5 mr-2 text-secondary-400" />
          )}
          <span>{component.name}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-secondary-900 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-secondary-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-500 text-black px-3 py-1 rounded-md font-semibold">
              {server.name}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search components..."
                className="pl-8 pr-4 py-2 border rounded-md text-secondary-200 bg-secondary-800 border-secondary-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-5 h-5 absolute left-2 top-2.5 text-secondary-400" />
            </div>
            <button
              onClick={() =>
                setViewMode(viewMode === 'table' ? 'json' : 'table')
              }
              className="p-2 bg-primary-500 text-black hover:bg-primary-400 rounded-md"
              title={
                viewMode === 'table'
                  ? 'Switch to JSON View'
                  : 'Switch to Table View'
              }
            >
              {viewMode === 'table' ? (
                <Code className="w-5 h-5" />
              ) : (
                <Table className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {viewMode === 'json' ? (
          renderJsonView()
        ) : (
          <div className="flex">
            <div className="w-1/5 pr-4 border-r border-secondary-800">
              {renderComponentList()}
            </div>
            <div className="w-4/5 pl-4">
              {selectedComponent ? (
                renderComponentDetails(selectedComponent)
              ) : (
                <div className="text-secondary-400">
                  Select a component to view details
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerView;
