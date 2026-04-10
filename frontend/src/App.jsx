import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [topic, setTopic] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const suggestions = [
    'Latest AI trends 2026',
    'Computer vision in sports',
    'Cloud architecture best practices',
    'Python AI frameworks',
  ];

  const addToHistory = (searchTopic) => {
    const normalized = searchTopic.trim();
    if (!normalized) return;

    setHistory((prevHistory) => {
      const nextHistory = [
        normalized,
        ...prevHistory.filter((item) => item.toLowerCase() !== normalized.toLowerCase()),
      ];
      return nextHistory.slice(0, 10);
    });
  };

  const performResearch = async (searchTopic) => {
    const normalizedTopic = searchTopic.trim();
    if (!normalizedTopic) {
      setError('Please enter a topic');
      return;
    }

    setTopic(normalizedTopic);
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: normalizedTopic }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to research topic');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'content') {
                streamedContent += data.content;
                setResponse(streamedContent);
              } else if (data.type === 'done') {
                // Research complete
              } else if (data.type === 'error') {
                setError(data.content);
              }
            } catch (e) {
              // Skip parsing errors for incomplete JSON
            }
          }
        }
      }

      addToHistory(normalizedTopic);
    } catch (err) {
      setError(err.message || 'An error occurred while researching');
    } finally {
      setLoading(false);
    }
  };

  const handleResearch = async (e) => {
    e.preventDefault();
    await performResearch(topic);
  };

  const handleHistoryClick = async (searchTopic) => {
    if (loading) return;
    await performResearch(searchTopic);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Research Agent</h1>
        <p>Search for information on any topic using AI-powered web research</p>
      </header>

      <main className="main">
        <form onSubmit={handleResearch} className="search-form">
          <div className="input-group">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your research topic..."
              className="input"
              disabled={loading}
            />
            <button
              type="submit"
              className="button"
              disabled={loading}
            >
              {loading ? 'Researching...' : 'Research'}
            </button>
          </div>
        </form>

        {!topic.trim() && !loading && (
          <div className="suggestions-container">
            <h3>Suggested Topics</h3>
            <div className="suggestion-buttons">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="suggestion-button"
                  onClick={() => performResearch(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="history-container">
            <h3>Recent Searches</h3>
            <div className="history-chips">
              {history.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="history-chip"
                  onClick={() => handleHistoryClick(item)}
                  disabled={loading}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Searching and gathering information...</p>
          </div>
        )}

        {response && (
          <div className="response-container">
            <div className="response-content">
              <h2>Research Results</h2>
              <div className="response-text">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {!loading && !response && !error && (
          <div className="placeholder">
            <p>Enter a topic above to begin research...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
