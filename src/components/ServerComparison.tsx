import React, { useState } from 'react';
import { Server, Component } from '../types';
import {
  Search,
  HardDrive,
  Box,
  ChevronDown,
  ChevronRight,
  GitCompare,
  Table,
  Code
} from 'lucide-react';
import DiffViewer from './DiffViewer';
import ComponentDetails from './ComponentDetails';

interface ServerComparisonProps {
  servers: Server[];
}

const ServerComparison: React.FC<ServerComparisonProps> = ({ servers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedComponent, setExpandedComponent] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [diffMode, setDiffMode] = useState<'split' | 'unified'>('split');

  const getComponentByName = (
    server: Server,
    name: string
  ): Component | undefined => {
    return server.components.find((c) => c.name === name);
  };

  const commonComponents = servers[0].components.filter((c1) =>
    servers[1].components.some((c2) => c2.name === c1.name)
  );

  const filteredComponents = commonComponents.filter((component) =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleComponentExpansion = (componentName: string) => {
    setExpandedComponent((prev) =>
      prev === componentName ? null : componentName
    );
  };

  const renderComponentSummary = (component: Component) => {
    const isDeviceComponent = 'pid' in component;
    return (
      <div className="flex items-center space-x-4">
        {isDeviceComponent ? (
          <HardDrive className="w-5 h-5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
        ) : (
          <Box className="w-5 h-5 text-secondary-500 dark:text-secondary-400 flex-shrink-0" />
        )}
        <span className="font-semibold text-secondary-200">
          {component.name}
        </span>
        <span className="text-sm text-secondary-400">v{component.version}</span>
        <span className="text-sm text-secondary-400">
          {component.commit.substring(0, 7)}
        </span>
        {isDeviceComponent && (
          <span className="text-sm text-secondary-400">
            PID: {component.pid}
          </span>
        )}
        <span className="text-sm text-secondary-400 truncate flex-grow">
          {component.url}
        </span>
      </div>
    );
  };

  const renderTableView = () => (
    <div className="space-y-4">
      {filteredComponents.map((component) => (
        <div
          key={component.name}
          className="border border-secondary-700 rounded-lg overflow-hidden"
        >
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary-800"
            onClick={() => toggleComponentExpansion(component.name)}
          >
            {renderComponentSummary(component)}
            {expandedComponent === component.name ? (
              <ChevronDown className="w-5 h-5 flex-shrink-0 text-secondary-400" />
            ) : (
              <ChevronRight className="w-5 h-5 flex-shrink-0 text-secondary-400" />
            )}
          </div>
          {expandedComponent === component.name && (
            <div className="bg-secondary-800 p-4">
              <h3 className="font-semibold mb-4 text-secondary-200">
                Comparison
              </h3>
              <ComponentDetails
                component1={getComponentByName(servers[0], component.name)}
                component2={getComponentByName(servers[1], component.name)}
                server1Name={servers[0].name}
                server2Name={servers[1].name}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderJsonView = () => (
    <div className="bg-secondary-900 rounded-lg overflow-hidden">
      <DiffViewer
        oldContent={JSON.stringify(servers[0], null, 2)}
        newContent={JSON.stringify(servers[1], null, 2)}
        oldHeader={servers[0].name}
        newHeader={servers[1].name}
        diffMode={diffMode}
        isJsonView={true}
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-secondary-900 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-secondary-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-500 text-black px-3 py-1 rounded-md font-semibold">
              {servers[0].name}
            </div>
            <div className="text-secondary-400 font-bold text-xl flex items-center justify-center w-2">
              ×
            </div>
            <div className="bg-accent-500 text-white px-3 py-1 rounded-md font-semibold">
              {servers[1].name}
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
              title={viewMode === 'table' ? 'Switch to JSON View' : 'Switch to Table View'}
            >
              {viewMode === 'table' ? (
                <Code className="w-5 h-5" />
              ) : (
                <Table className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() =>
                setDiffMode(diffMode === 'split' ? 'unified' : 'split')
              }
              className={`p-2 rounded-md flex items-center ${
                viewMode === 'json'
                  ? 'bg-secondary-700 text-secondary-200 hover:bg-secondary-600'
                  : 'bg-secondary-800 text-secondary-500 cursor-not-allowed'
              }`}
              disabled={viewMode === 'table'}
              title={
                viewMode === 'json'
                  ? `Switch to ${diffMode === 'split' ? 'Unified' : 'Split'} View`
                  : 'Diff view is only available in JSON mode'
              }
            >
              <GitCompare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {viewMode === 'table' ? renderTableView() : renderJsonView()}
      </div>
    </div>
  );
};

export default ServerComparison;