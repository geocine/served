import React, { useState } from 'react';
import { Server, Component } from '../types';
import { Search, HardDrive, Box } from 'lucide-react';
import ComponentDetails from './ComponentDetails';

interface ComponentTableProps {
  server: Server;
}

const ComponentTable: React.FC<ComponentTableProps> = ({ server }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');

  const filteredComponents = server.components.filter((component) =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Components for {server.name}</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search components..."
              className="pl-8 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 absolute left-2 top-2.5 text-gray-400" />
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'json' : 'table')}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg"
          >
            {viewMode === 'table' ? 'JSON View' : 'Table View'}
          </button>
        </div>
      </div>
      {viewMode === 'table' ? (
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Version</th>
              <th className="px-4 py-2 text-left">URL</th>
            </tr>
          </thead>
          <tbody>
            {filteredComponents.map((component) => (
              <tr
                key={component.name}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedComponent(component)}
              >
                <td className="px-4 py-2">
                  {'pid' in component ? (
                    <HardDrive className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Box className="w-5 h-5 text-green-500" />
                  )}
                </td>
                <td className="px-4 py-2">{component.name}</td>
                <td className="px-4 py-2">{component.version}</td>
                <td className="px-4 py-2">{component.url}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(filteredComponents, null, 2)}
        </pre>
      )}
      {selectedComponent && (
        <ComponentDetails
          component={selectedComponent}
          onClose={() => setSelectedComponent(null)}
        />
      )}
    </div>
  );
};

export default ComponentTable;