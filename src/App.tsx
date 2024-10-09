import React, { useState } from 'react';
import { servers } from './data';
import { Server } from './types';
import ServerList from './components/ServerList';
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

  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
    setSelectedServers([]);
    setSelectedServer(null);
  };

  const handleSelectServer = (server: Server) => {
    if (comparisonMode) {
      if (selectedServers.some(s => s.name === server.name)) {
        setSelectedServers(selectedServers.filter(s => s.name !== server.name));
      } else if (selectedServers.length < 2) {
        setSelectedServers([...selectedServers, server]);
      }
    } else {
      setSelectedServer(server);
    }
  };

  const filteredServers = servers.filter(server =>
    server.name.toLowerCase().includes(serverFilter.toLowerCase())
  );

  const EmptyPlaceholder = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-gray-800 rounded-sm shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{message}</h2>
      <p className="text-gray-500 dark:text-gray-400">Select a server from the list on the left to view its details.</p>
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
              <button
                onClick={toggleComparisonMode}
                className={`flex items-center justify-center px-4 py-2 rounded-sm transition-colors duration-200 h-10 ${
                  comparisonMode
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-700 dark:text-primary-100'
                    : 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-300 border border-primary-300 dark:border-primary-600'
                }`}
              >
                {comparisonMode ? (
                  <>
                    <Layers className="w-5 h-5 mr-2" />
                    Single Server View
                  </>
                ) : (
                  <>
                    <GitCompare className="w-5 h-5 mr-2" />
                    Compare Servers
                  </>
                )}
              </button>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 flex">
          <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm">
            <ServerList
              servers={filteredServers}
              selectedServer={selectedServer}
              selectedServers={selectedServers}
              onSelectServer={handleSelectServer}
              comparisonMode={comparisonMode}
              serverFilter={serverFilter}
              setServerFilter={setServerFilter}
            />
          </aside>
          <div className="flex-1 p-6">
            <ErrorBoundary fallback={<div className="text-red-500">An error occurred while rendering the content.</div>}>
              {comparisonMode ? (
                selectedServers.length === 2 ? (
                  <ServerComparison servers={selectedServers} />
                ) : (
                  <EmptyPlaceholder message={`Select ${2 - selectedServers.length} more server${selectedServers.length === 1 ? '' : 's'} to compare`} />
                )
              ) : selectedServer ? (
                <ServerView server={selectedServer} />
              ) : (
                <EmptyPlaceholder message="No Server Selected" />
              )}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;