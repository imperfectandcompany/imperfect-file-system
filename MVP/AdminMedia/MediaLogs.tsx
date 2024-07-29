// MediaLogs.tsx

import { FunctionalComponent } from "preact";
import { useState, useEffect } from "preact/hooks";
import { getToken } from "../../utils";

interface LogEntry {
  id: number;
  action: string;
  timestamp: string;
  user: string;
  details: string;
  // Start of Selection
}

const MediaLogs: FunctionalComponent = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    const token = getToken(); // getToken() is defined and returns the token
    if (token) {
      try {
      const response = await fetch('https://api.imperfectgamers.org/media/logs', {
        headers: {
          'Authorization': token
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      const data = await response.json();
      setLogs(data.logs);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred while fetching logs.');
      } else {
        setError('An unknown error occurred while fetching logs.');
      }
    } finally {
      setLoading(false);
    }
  } else {
    setError("User not authenticated!");
  }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="media-logs">
      <h2>Media Logs</h2>
      {logs.length === 0 ? (
        <p>No logs available.</p>
      ) : (
        <ul>
          {logs.map(log => (
            <li key={log.id}>
              <p>{log.action}</p>
              <p>Time: {new Date(log.timestamp).toLocaleString()}</p>
              <p>User: {log.user}</p>
              <p>Details: {log.details}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default MediaLogs;
