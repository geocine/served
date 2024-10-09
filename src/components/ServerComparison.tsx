import React, { useState } from 'react';
import { Server, Component } from '../types';
import { Search, HardDrive, Box, ChevronDown, ChevronRight, GitCompare } from 'lucide-react';
import DiffViewer from './DiffViewer';
import ComponentDetails from './ComponentDetails';

interface ServerComparisonProps {
  servers: Server[];
}

const ServerComparison: React.FC<ServerComparisonProps> = ({ servers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [diffMode, setDiffMode] = useState<'split' | 'unified'>('split');

  const getComponentByName = (server: Server, name: string): Component | undefined => {
    return server.components.find(c => c.name === name);
  };

  const commonComponents = servers[0].components.filter(c1 => 
    servers[1].components.some(c2 => c2.name === c1.name)
  );

  const filteredComponents = commonComponents.filter((component) =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleComponentExpansion = (componentName: string) => {
    setExpandedComponent(prev => prev === componentName ? null : componentName);
  };

  const renderComponentSummary = (component: Component) => {
    const isDeviceComponent = 'pid' in component;
    return (
      <div className="flex items-center space-x-4">
        {'pid' in component ? (
          <HardDrive className="w-5 h-5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
        ) : (
          <Box className="w-5 h-5 text-secondary-500 dark:text-secondary-400 flex-shrink-0" />
        )}
        <span className="font-semibold text-gray-800 dark:text-gray-200">{component.name}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">v{component.version}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">{component.commit.substring(0, 7)}</span>
        {isDeviceComponent && (
          <span className="text-sm text-gray-600 dark:text-gray-400">PID: {component.pid}</span>
        )}
        <span className="text-sm text-gray-600 dark:text-gray-400 truncate flex-grow">{component.url}</span>
      </div>
    );
  };

  const renderTableView = () => (
    <div className="space-y-4">
      {filteredComponents.map((component) => (
        <div key={component.name} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => toggleComponentExpansion(component.name)}
          >
            {renderComponentSummary(component)}
            {expandedComponent === component.name ? (
              <ChevronDown className="w-5 h-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
            )}
          </div>
          {expandedComponent === component.name && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4">
              <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Comparison</h3>
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
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
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
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Server Comparison: {servers[0].name} vs {servers[1].name}</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search components..."
                className="pl-8 pr-4 py-2 border rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-5 h-5 absolute left-2 top-2.5 text-gray-400" />
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'json' : 'table')}
              className="px-3 py-2 bg-primary-100 dark:bg-primary-700 text-primary-700 dark:text-primary-100 rounded-md"
            >
              {viewMode === 'table' ? 'JSON View' : 'Table View'}
            </button>
            {viewMode === 'json' && (
              <button
                onClick={() => setDiffMode(diffMode === 'split' ? 'unified' : 'split')}
                className="px-3 py-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-100 rounded-md flex items-center"
              >
                <GitCompare className="w-4 h-4 mr-2" />
                {diffMode === 'split' ? 'Unified' : 'Split'} View
              </button>
            )}
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