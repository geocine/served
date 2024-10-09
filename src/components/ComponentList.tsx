import React from 'react';
import { Component } from '../types';
import { HardDrive, Box } from 'lucide-react';

interface ComponentListProps {
  serverName: string;
  components: Component[];
  selectedComponents: Component[];
  onSelectComponent: (component: Component) => void;
}

const ComponentList: React.FC<ComponentListProps> = ({ serverName, components, selectedComponents, onSelectComponent }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">{serverName}</h2>
      <ul className="space-y-1">
        {components.map((component) => (
          <li key={component.name}>
            <button
              onClick={() => onSelectComponent(component)}
              className={`flex items-center space-x-2 w-full text-left px-2 py-1 rounded text-sm ${
                selectedComponents.some(c => c.name === component.name)
                  ? 'bg-blue-100 text-blue-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              {'pid' in component ? (
                <HardDrive className="w-4 h-4 text-blue-500" />
              ) : (
                <Box className="w-4 h-4 text-green-500" />
              )}
              <span>{component.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComponentList;