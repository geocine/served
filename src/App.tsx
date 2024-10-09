import React, { useState } from 'react';
import { servers } from './data';
import { Server } from './types';
import ServerView from './components/ServerView';
import ServerComparison from './components/ServerComparison';
import ThemeToggle from './components/ThemeToggle';
import { Layers, GitCompare } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [selectedServers, setSelectedServers] = useState<Server[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [serverFilter, setServerFilter] = useState('');

  const handleSelectServer = (server: Server, index: number) => {
    const newSelectedServers = [...selectedServers];
    newSelectedServers[index] = server;
    setSelectedServers(newSelectedServers);

    if (newSelectedServers[0] && newSelectedServers[1]) {
      setComparisonMode(true);
    } else {
      setComparisonMode(false);
      setSelectedServer(newSelectedServers[0] || null);
    }
  };

  const reverseComparison = () => {
    setSelectedServers([selectedServers[1], selectedServers[0]]);
  };

  const filteredServers = servers.filter(server =>
    server.name.toLowerCase().includes(serverFilter.toLowerCase())
  );

  const EmptyPlaceholder = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-gray-800 rounded-sm shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{message}</h2>
      <p className="text-gray-500 dark:text-gray-400">Select a server from the dropdown to view its details.</p>
    </div>
  );

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-6 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Server Monitoring Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                onChange={(e) => handleSelectServer(servers.find(s => s.name === e.target.value)!, 0)}
                value={selectedServers[0]?.name || ''}
                className="px-4 py-2 rounded-sm border border-gray-300 dark:border-gray-600"
              >
                <option value="">Select Server 1</option>
                {filteredServers.map(server => (
                  <option key={server.name} value={server.name}>{server.name}</option>
                ))}
              </select>
              <select
                onChange={(e) => handleSelectServer(servers.find(s => s.name === e.target.value)!, 1)}
                value={selectedServers[1]?.name || ''}
                className="px-4 py-2 rounded-sm border border-gray-300 dark:border-gray-600"
              >
                <option value="">Select Server 2</option>
                {filteredServers.map(server => (
                  <option key={server.name} value={server.name}>{server.name}</option>
                ))}
              </select>
              {comparisonMode && (
                <button
                  onClick={reverseComparison}
                  className="px-4 py-2 bg-primary-100 dark:bg-primary-700 text-primary-700 dark:text-primary-100 rounded-sm"
                >
                  Reverse Comparison
                </button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <ErrorBoundary fallback={<div className="text-red-500">An error occurred while rendering the content.</div>}>
            {comparisonMode ? (
              <ServerComparison servers={selectedServers} />
            ) : selectedServer ? (
              <ServerView server={selectedServer} />
            ) : (
              <EmptyPlaceholder message="No Server Selected" />
            )}
          </ErrorBoundary>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;