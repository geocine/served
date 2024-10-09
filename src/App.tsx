import React, { useState, useEffect } from 'react';
import { servers } from './data';
import { Server } from './types';
import ServerView from './components/ServerView';
import ServerComparison from './components/ServerComparison';
import ThemeToggle from './components/ThemeToggle';
import { GitCompare } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import FilterableDropdown from './components/FilterableDropdown';

function App() {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [selectedServers, setSelectedServers] = useState<
    [Server | null, Server | null]
  >([null, null]);

  const [comparisonMode, setComparisonMode] = useState(false);

  useEffect(() => {
    if (servers.length > 0) {
      setSelectedServer(servers[0]);
      setSelectedServers([servers[0], null]);
    }
  }, []);

  const handleSelectServer = (serverName: string | null, index: 0 | 1) => {
    const server = serverName
      ? servers.find((s) => s.name === serverName) || null
      : null;
    const newSelectedServers: [Server | null, Server | null] = [
      ...selectedServers,
    ];
    newSelectedServers[index] = server;
    setSelectedServers(newSelectedServers);

    if (newSelectedServers[0] && newSelectedServers[1]) {
      setComparisonMode(true);
    } else {
      setComparisonMode(false);
      setSelectedServer(newSelectedServers[0]);
    }
  };

  const reverseComparison = () => {
    if (!selectedServers[0] && selectedServers[1]) {
      setSelectedServers([selectedServers[1], null]);
      setSelectedServer(selectedServers[1]);
      setComparisonMode(false);
    } else {
      setSelectedServers([selectedServers[1], selectedServers[0]]);
    }
  };

  const EmptyPlaceholder = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-secondary-900 rounded shadow-md">
      <h2 className="text-2xl font-semibold text-secondary-200 mb-2">
        {message}
      </h2>
      <p className="text-secondary-400">
        Select a server from the dropdown to view its details.
      </p>
    </div>
  );

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-secondary-900 flex flex-col">
        <header className="bg-secondary-900 shadow-sm border-b border-secondary-800">
          <div className="max-w-7xl mx-auto py-4 px-6 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-400">
                Server Monitoring Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <FilterableDropdown
                options={servers.map((s) => s.name)}
                selectedOption={selectedServers[0]?.name || ''}
                onChange={(value) => handleSelectServer(value, 0)}
                placeholder="Select Server 1"
              />
              <FilterableDropdown
                options={servers.map((s) => s.name)}
                selectedOption={selectedServers[1]?.name || ''}
                onChange={(value) => handleSelectServer(value, 1)}
                placeholder="Select Server 2"
              />
              <button
                onClick={reverseComparison}
                disabled={!selectedServers[1]}
                className={`p-2 rounded transition-colors ${
                  selectedServers[1]
                    ? 'bg-primary-500 text-black hover:bg-primary-400'
                    : 'bg-secondary-800 text-secondary-600 cursor-not-allowed'
                }`}
                aria-label="Reverse comparison"
              >
                <GitCompare className="w-5 h-5" />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <ErrorBoundary
            fallback={
              <div className="text-accent-500">
                An error occurred while rendering the content.
              </div>
            }
          >
            {comparisonMode ? (
              <ServerComparison servers={selectedServers.filter((server): server is Server => server !== null)} />
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