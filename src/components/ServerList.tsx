import React from 'react';
import { Server } from '../types';
import { ServerIcon, Search } from 'lucide-react';

interface ServerListProps {
  servers: Server[];
  selectedServer: Server | null;
  selectedServers: Server[];
  onSelectServer: (server: Server) => void;
  comparisonMode: boolean;
  serverFilter: string;
  setServerFilter: (filter: string) => void;
}

const ServerList: React.FC<ServerListProps> = ({
  servers,
  selectedServer,
  selectedServers,
  onSelectServer,
  comparisonMode,
  serverFilter,
  setServerFilter,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Servers</h2>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Filter servers..."
          value={serverFilter}
          onChange={(e) => setServerFilter(e.target.value)}
          className="w-full pl-8 pr-4 py-2 border rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        />
        <Search className="w-5 h-5 absolute left-2 top-2.5 text-gray-400" />
      </div>
      <ul className="space-y-2">
        {servers.map((server) => (
          <li key={server.name}>
            <button
              onClick={() => onSelectServer(server)}
              className={`flex items-center space-x-2 w-full text-left px-3 py-2 rounded ${
                (comparisonMode
                  ? selectedServers.some((s) => s.name === server.name)
                  : selectedServer?.name === server.name)
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <ServerIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span>{server.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServerList;