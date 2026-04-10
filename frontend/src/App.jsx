import React, { useState } from 'react';
import './App.css';

function App() {
  const [topic, setTopic] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResearch = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
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
    } catch (err) {
      setError(err.message || 'An error occurred while researching');
    } finally {
      setLoading(false);
    }
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
                {response.split('\n').map((paragraph, index) => 
                  paragraph.trim() && <p key={index}>{paragraph}</p>
                )}
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
